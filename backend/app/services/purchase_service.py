from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.material import Material
from app.models.supplier import Supplier
from app.models.purchase import Purchase
from app.models.stock import StockIn


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

    # create purchase
    purchase = Purchase(
        material_id=data.material_id,
        supplier_id=data.supplier_id,
        quantity=data.quantity,
        unit_price=data.unit_price,
        total_amount=total_amount,
        status=data.status
    )
    
    

    # create stock entry
    stock = StockIn(
        material_id=data.material_id,
        quantity=data.quantity,
        unit_price=data.unit_price
    )

    try:

        db.add(purchase)
        db.add(stock)
        db.commit()
        db.refresh(purchase)
        return purchase
    except Exception:

        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Purchase creation failed"
        )
        