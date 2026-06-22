from fastapi import HTTPException

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.material import Material
from app.models.purchase import Purchase
from app.models.stock import StockIn, StockOut
from app.schemas.material import (
    MaterialCreate
)


# CREATE MATERIAL
def create_material_service(
    db: Session,
    data: MaterialCreate
):

    # Case-insensitive duplicate check
    existing_material = db.query(Material).filter(
        func.lower(Material.name)
        == data.name.lower()
    ).first()

    # Reactivate if inactive
    if existing_material:

        if not existing_material.is_active:

            existing_material.is_active = True

            existing_material.unit = data.unit

            existing_material.minimum_stock = (
                data.minimum_stock
            )

            db.commit()

            db.refresh(existing_material)

            return existing_material

        raise HTTPException(
            status_code=400,
            detail="Material already exists"
        )

    # Create new material
    material = Material(
        name=data.name,
        unit=data.unit,
        minimum_stock=data.minimum_stock
    )

    db.add(material)

    db.commit()

    db.refresh(material)

    return material


# GET ALL MATERIALS
def get_all_materials_service(
    db: Session
):

    return db.query(Material).all()


# GET SINGLE MATERIAL
def get_material_service(
    db: Session,
    material_id: int
):

    material = db.query(Material).filter(
        Material.id == material_id
    ).first()

    if not material:

        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )

    return material


# UPDATE MATERIAL
def update_material_service(
    db: Session,
    material_id: int,
    data: MaterialCreate
):

    material = db.query(Material).filter(
        Material.id == material_id
    ).first()

    if not material:

        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )

    # Duplicate check during update
    existing_material = db.query(Material).filter(
        func.lower(Material.name)
        == data.name.lower(),
        Material.id != material_id
    ).first()

    if existing_material:

        raise HTTPException(
            status_code=400,
            detail="Material name already exists"
        )

    material.name = data.name

    material.unit = data.unit

    material.minimum_stock = data.minimum_stock

    db.commit()

    db.refresh(material)

    return material


# DEACTIVATE MATERIAL
def deactivate_material_service(
    db: Session,
    material_id: int
):

    material = db.query(Material).filter(
        Material.id == material_id
    ).first()

    if not material:

        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )

    if not material.is_active:

        raise HTTPException(
            status_code=400,
            detail="Material already inactive"
        )

    material.is_active = False

    db.commit()

    return {
        "message":
        "Material deactivated successfully"
    }


# ACTIVATE MATERIAL
def activate_material_service(
    db: Session,
    material_id: int
):

    material = db.query(Material).filter(
        Material.id == material_id
    ).first()

    if not material:

        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )

    if material.is_active:

        raise HTTPException(
            status_code=400,
            detail="Material already active"
        )

    material.is_active = True

    db.commit()

    return {
        "message":
        "Material activated successfully"
    }
    
    # HARD DELETE MATERIAL
def delete_material_service(
    db: Session,
    material_id: int
):

    material = db.query(Material).filter(
        Material.id == material_id
    ).first()

    if not material:

        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )

    # CHECK RELATIONSHIPS
    purchase_exists = db.query(Purchase).filter(
        Purchase.material_id == material_id
    ).first()

    stock_in_exists = db.query(StockIn).filter(
        StockIn.material_id == material_id
    ).first()

    stock_out_exists = db.query(StockOut).filter(
        StockOut.material_id == material_id
    ).first()

    # PREVENT DELETE
    if (
        purchase_exists or
        stock_in_exists or
        stock_out_exists
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Cannot delete material "
                "with transactions"
            )
        )