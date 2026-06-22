from fastapi import HTTPException

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.supplier import Supplier
from app.models.purchase import Purchase

from app.schemas.supplier import (
    SupplierCreate
)


# CREATE SUPPLIER
def create_supplier_service(
    db: Session,
    data: SupplierCreate
):

    existing_supplier = db.query(
        Supplier
    ).filter(
        func.lower(Supplier.name)
        == data.name.lower()
    ).first()

    # REACTIVATE IF INACTIVE
    if existing_supplier:

        if not existing_supplier.is_active:

            existing_supplier.is_active = True

            existing_supplier.contact = (
                data.contact
            )

            existing_supplier.address = (
                data.address
            )

            db.commit()

            db.refresh(existing_supplier)

            return existing_supplier

        raise HTTPException(
            status_code=400,
            detail="Supplier already exists"
        )

    supplier = Supplier(
        name=data.name,
        contact=data.contact,
        address=data.address
    )

    db.add(supplier)

    db.commit()

    db.refresh(supplier)

    return supplier


# GET ALL SUPPLIERS
def get_all_suppliers_service(
    db: Session
):

    return db.query(
        Supplier
    ).all()


# GET SINGLE SUPPLIER
def get_supplier_service(
    db: Session,
    supplier_id: int
):

    supplier = db.query(
        Supplier
    ).filter(
        Supplier.id == supplier_id
    ).first()

    if not supplier:

        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    return supplier


# UPDATE SUPPLIER
def update_supplier_service(
    db: Session,
    supplier_id: int,
    data: SupplierCreate
):

    supplier = db.query(
        Supplier
    ).filter(
        Supplier.id == supplier_id
    ).first()

    if not supplier:

        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    existing_supplier = db.query(
        Supplier
    ).filter(
        func.lower(Supplier.name)
        == data.name.lower(),

        Supplier.id != supplier_id
    ).first()

    if existing_supplier:

        raise HTTPException(
            status_code=400,
            detail="Supplier already exists"
        )

    supplier.name = data.name

    supplier.contact = data.contact

    supplier.address = data.address

    db.commit()

    db.refresh(supplier)

    return supplier


# DEACTIVATE SUPPLIER
def deactivate_supplier_service(
    db: Session,
    supplier_id: int
):

    supplier = db.query(
        Supplier
    ).filter(
        Supplier.id == supplier_id
    ).first()

    if not supplier:

        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    supplier.is_active = False

    db.commit()

    return {
        "message":
        "Supplier deactivated successfully"
    }


# ACTIVATE SUPPLIER
def activate_supplier_service(
    db: Session,
    supplier_id: int
):

    supplier = db.query(
        Supplier
    ).filter(
        Supplier.id == supplier_id
    ).first()

    if not supplier:

        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    supplier.is_active = True

    db.commit()

    return {
        "message":
        "Supplier activated successfully"
    }


# HARD DELETE SUPPLIER
def delete_supplier_service(
    db: Session,
    supplier_id: int
):

    supplier = db.query(
        Supplier
    ).filter(
        Supplier.id == supplier_id
    ).first()

    if not supplier:

        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    purchase_exists = db.query(
        Purchase
    ).filter(
        Purchase.supplier_id
        == supplier_id
    ).first()

    if purchase_exists:

        raise HTTPException(
            status_code=400,
            detail=(
                "Cannot delete supplier "
                "with purchases"
            )
        )

    db.delete(supplier)

    db.commit()

    return {
        "message":
        "Supplier deleted successfully"
    }