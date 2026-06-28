from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.schemas.purchase import PurchaseCreate, PurchaseResponse, PaymentRequest, StatusUpdateRequest
from app.utils.deps import get_db, manager_only,get_current_user
from app.services.purchase_service import (
    create_purchase_service,
    update_purchase_status_service,
    record_purchase_payment_service
)
from app.models.purchase import Purchase

import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/")
def create_purchase(
    data: PurchaseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(manager_only)
):
    try:
        purchase = create_purchase_service(
            db,
            data
        )
        return {
            "message": "Purchase created successfully",
            "purchase_id": purchase.id,
            "total_amount": purchase.total_amount
        }
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error during purchase creation: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to create purchase order due to a database error."
        )
        

@router.get(
    "/",
    response_model=list[PurchaseResponse]
)
def get_purchases(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)

):
    purchases = db.query(
        Purchase
    ).all()

    result = []
    for purchase in purchases:
        result.append({
            "id": purchase.id,
            "material_name": purchase.material.name,
            "supplier_name": purchase.supplier.name,
            "quantity": purchase.quantity,
            "unit_price": purchase.unit_price,
            "total_amount": purchase.total_amount,
            "status": purchase.status,
            "payment_status": purchase.payment_status,
            "amount_paid": purchase.amount_paid,
            "invoice_number": purchase.invoice_number
        })

    return result


@router.put("/{id}/status", response_model=PurchaseResponse)
def update_purchase_status(
    id: int,
    data: StatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(manager_only)
):
    purchase = update_purchase_status_service(db, id, data.status)
    return {
        "id": purchase.id,
        "material_name": purchase.material.name,
        "supplier_name": purchase.supplier.name,
        "quantity": purchase.quantity,
        "unit_price": purchase.unit_price,
        "total_amount": purchase.total_amount,
        "status": purchase.status,
        "payment_status": purchase.payment_status,
        "amount_paid": purchase.amount_paid,
        "invoice_number": purchase.invoice_number
    }


@router.post("/{id}/payment", response_model=PurchaseResponse)
def record_purchase_payment(
    id: int,
    data: PaymentRequest,
    db: Session = Depends(get_db),
    current_user=Depends(manager_only)
):
    purchase = record_purchase_payment_service(db, id, data.amount)
    return {
        "id": purchase.id,
        "material_name": purchase.material.name,
        "supplier_name": purchase.supplier.name,
        "quantity": purchase.quantity,
        "unit_price": purchase.unit_price,
        "total_amount": purchase.total_amount,
        "status": purchase.status,
        "payment_status": purchase.payment_status,
        "amount_paid": purchase.amount_paid,
        "invoice_number": purchase.invoice_number
    }