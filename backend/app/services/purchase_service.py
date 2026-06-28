from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.material import Material
from app.models.supplier import Supplier
from app.models.purchase import Purchase
from app.models.stock import StockIn
import logging

logger = logging.getLogger(__name__)


def create_purchase_service(db: Session, data):
    # check material
    material = db.query(Material).filter(
        Material.id == data.material_id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )
    if not material.is_active:
        raise HTTPException(
            status_code=400,
            detail="Material is inactive"
        )

    # check supplier
    supplier = db.query(Supplier).filter(
        Supplier.id == data.supplier_id
    ).first()

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    # calculate total amount
    total_amount = data.quantity * data.unit_price

    # create purchase — always starts as pending/unpaid regardless of input
    purchase = Purchase(
        material_id=data.material_id,
        supplier_id=data.supplier_id,
        quantity=data.quantity,
        unit_price=data.unit_price,
        total_amount=total_amount,
        status="pending",
        invoice_number=data.invoice_number,
        payment_status="unpaid",
        amount_paid=0.0
    )

    db.add(purchase)

    try:
        db.commit()
        db.refresh(purchase)
        return purchase
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Purchase creation failed: {str(e)}"
        )


# Valid status transitions
VALID_TRANSITIONS = {
    "pending": ["approved", "cancelled"],
    "approved": ["delivered", "cancelled"],
    "delivered": [],   # terminal state — no further transitions
    "cancelled": [],   # terminal state
}


def update_purchase_status_service(db: Session, purchase_id: int, status: str):
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    if not purchase:
        raise HTTPException(
            status_code=404,
            detail="Purchase not found"
        )

    # Guard: same status — no-op
    if status == purchase.status:
        raise HTTPException(
            status_code=400,
            detail=f"Purchase is already '{status}'"
        )

    # Guard: enforce valid transitions only
    allowed = VALID_TRANSITIONS.get(purchase.status, [])
    if status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot transition from '{purchase.status}' to '{status}'"
        )

    # Guard: prevent duplicate delivery — idempotency check via purchase_id
    if status == "delivered":
        existing_stock = db.query(StockIn).filter(
            StockIn.purchase_id == purchase.id
        ).first()

        if existing_stock:
            raise HTTPException(
                status_code=400,
                detail="Stock entry already exists for this purchase"
            )

        stock = StockIn(
            material_id=purchase.material_id,
            quantity=purchase.quantity,
            unit_price=purchase.unit_price,
            purchase_id=purchase.id
        )
        db.add(stock)

    purchase.status = status

    try:
        db.commit()
        db.refresh(purchase)
        return purchase
    except Exception as e:
        db.rollback()
        logger.error(f"Status update failed for purchase {purchase_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to update purchase status due to a server error."
        )


def record_purchase_payment_service(db: Session, purchase_id: int, amount: float):
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    if not purchase:
        raise HTTPException(
            status_code=404,
            detail="Purchase not found"
        )

    # Guard: payment amount must be positive
    if amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Payment amount must be greater than zero"
        )

    # Guard: already fully paid
    if purchase.payment_status == "paid":
        raise HTTPException(
            status_code=400,
            detail="This purchase is already fully paid"
        )

    # Guard: payment cannot exceed remaining balance
    remaining_balance = purchase.total_amount - purchase.amount_paid
    if amount > remaining_balance + 0.01:  # small floating point margin
        raise HTTPException(
            status_code=400,
            detail=f"Payment of ₹{amount} exceeds remaining balance of ₹{remaining_balance:.2f}"
        )

    # Cap the payment to remaining balance to prevent overpayment from float rounding
    if amount > remaining_balance:
        amount = remaining_balance

    purchase.amount_paid += amount

    # Determine new payment status
    if abs(purchase.amount_paid - purchase.total_amount) < 0.01:
        purchase.payment_status = "paid"
        purchase.amount_paid = purchase.total_amount  # snap to exact value
    else:
        purchase.payment_status = "partially_paid"

    try:
        db.commit()
        db.refresh(purchase)
        return purchase
    except Exception as e:
        db.rollback()
        logger.error(f"Payment recording failed for purchase {purchase_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to record payment due to a server error."
        )