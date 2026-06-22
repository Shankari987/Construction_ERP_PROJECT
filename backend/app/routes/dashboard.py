from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.material import Material
from app.models.purchase import Purchase
from app.models.stock import StockIn

from app.services.inventory_service import (
    calculate_stock
)

from app.utils.deps import get_db

router = APIRouter(
    tags=["Dashboard"]
)


@router.get("/")
def dashboard(
    db: Session = Depends(get_db)
):

    materials = db.query(
        Material
    ).all()

    total_stock = 0

    low_stock_materials = []

    # stock summary
    for material in materials:

        current_stock = calculate_stock(
            db,
            material.id
        )

        total_stock += current_stock

        # low stock check
        if (
        material.minimum_stock and
        current_stock <
        material.minimum_stock
):

            low_stock_materials.append({

                "material_name":
                    material.name,

                "available_stock":
                    current_stock
            })

    # total expense
    total_expense = db.query(
        func.sum(
            StockIn.quantity *
            StockIn.unit_price
        )
    ).scalar() or 0

    # recent purchases
    recent_purchases = db.query(
        Purchase
    ).order_by(
        Purchase.id.desc()
    ).limit(5).all()

    recent_data = []

    for purchase in recent_purchases:

        recent_data.append({

            "id":
                purchase.id,

            "material_name":
                purchase.material.name,

            "supplier_name":
                purchase.supplier.name,

            "quantity":
                purchase.quantity,

            "total_amount":
                purchase.total_amount,

            "status":
                purchase.status
        })

    return {

        "total_materials":
            len(materials),

        "total_stock":
            total_stock,

        "total_expense":
            total_expense,

        "low_stock_materials":
            low_stock_materials,

        "recent_purchases":
            recent_data
    }