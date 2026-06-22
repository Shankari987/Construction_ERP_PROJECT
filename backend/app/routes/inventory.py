from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.stock import StockIn, StockOut
from app.models.material import Material
from app.schemas.stock import StockOutCreate
from app.utils.deps import get_db, manager_only
from app.services.inventory_service import calculate_stock
router = APIRouter()

# get current stock
@router.get("/{material_id}")
def get_current_stock(
    material_id: int,
    db: Session = Depends(get_db)
):
    material = db.query(Material).filter(
        Material.id == material_id
    ).first()
    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )
    # check active status
    if not material.is_active:

        raise HTTPException(
            status_code=400,
            detail="Material is inactive"
    )
    current_stock = calculate_stock(db, material_id)
    low_stock = False
    if hasattr(material, "minimum_stock"):
        if current_stock < material.minimum_stock:
            low_stock = True
    return {
        "material_id": material.id,
        "material_name": material.name,
        "available_stock": current_stock,
        "low_stock": low_stock
    }
@router.get("/")
def get_inventory(
    db: Session = Depends(get_db)
):

    materials = db.query(
        Material
    ).all()

    inventory = []

    for material in materials:

        available_stock = calculate_stock(
            db,
            material.id
        )
        low_stock = (
            available_stock <
            material.minimum_stock
        )
        inventory.append({
            "material_id":
                material.id,

            "material_name":
                material.name,

            "unit":
                material.unit,

            "available_stock":
                available_stock,

            "minimum_stock":
                material.minimum_stock,

            "low_stock":
                low_stock
        })

    return inventory
# stock out / site request
@router.post("/stock-out")
def stock_out(
    data: StockOutCreate,
    db: Session = Depends(get_db),
    current_user=Depends(manager_only)
):
    material = db.query(Material).filter(
        Material.id == data.material_id
    ).first()
    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )
    available_stock = calculate_stock(
        db,
        data.material_id
    )
    # prevent negative stock
    if available_stock < data.quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock"
        )
    stock = StockOut(
        material_id=data.material_id,
        quantity=data.quantity,
        site_name=data.site_name,
        purpose=data.purpose,
        requested_by=data.requested_by
    )
    db.add(stock)
    db.commit()
    db.refresh(stock)
    remaining_stock = available_stock - data.quantity
    return {
        "message": "Stock issued to site successfully",
        "site_name": stock.site_name,
        "remaining_stock": remaining_stock
    }
# stock history
@router.get("/history/{material_id}")
def stock_history(
    material_id: int,
    db: Session = Depends(get_db)
):

    stock_in = db.query(StockIn).filter(
        StockIn.material_id == material_id
    ).all()

    stock_out = db.query(StockOut).filter(
        StockOut.material_id == material_id
    ).all()

    history = []
    # stock in history
    for item in stock_in:
        history.append({
            "type": "IN",
            "quantity": item.quantity,
            "date":item.created_at.strftime("%d-%m-%Y")        
            })
    # stock out history
    for item in stock_out:
        history.append({
            "type": "OUT",
            "quantity": item.quantity,
            "site_name": item.site_name,
            "purpose": item.purpose,
            "requested_by": item.requested_by,
            "date":item.created_at.strftime("%d-%m-%Y")       
            })
    return {
        "material_id": material_id,
        "history": history
    }