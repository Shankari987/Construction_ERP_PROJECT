from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.material import Material
from app.models.purchase import Purchase
from app.models.stock import StockIn

from app.services.inventory_service import (
    calculate_stock
)

from app.utils.deps import get_db,get_current_user

router = APIRouter(
    tags=["Dashboard"]
)


@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)

):
    materials = db.query(
        Material
    ).all()

    total_stock = 0
    low_stock_materials = []
    stock_breakdown = []

    # stock summary
    for material in materials:
        current_stock = calculate_stock(
            db,
            material.id
        )
        total_stock += current_stock

        # low stock check
        min_stock = float(material.minimum_stock or 0.0) if material.minimum_stock is not None else 0.0
        is_low = False
        if current_stock < min_stock:
            is_low = True
            low_stock_materials.append({
                "material_id": material.id,
                "material_name": material.name,
                "available_stock": current_stock,
                "minimum_stock": min_stock
            })
            
        stock_breakdown.append({
            "material_name": material.name,
            "available_stock": current_stock,
            "minimum_stock": min_stock,
            "is_low": is_low
        })

    # Re-use finance dashboard values for consistency
    from app.services.finance_service import get_finance_dashboard
    finance_dash = get_finance_dashboard(db)
    
    total_expense = finance_dash["total_expense"]
    monthly_trend = finance_dash["monthly_trend"]
    recent_purchases = finance_dash["recent_purchases"][:5]  # Limit to 5 for dashboard

    return {
        "total_materials": len(materials),
        "total_stock": total_stock,
        "total_expense": total_expense,
        "low_stock_materials": low_stock_materials,
        "stock_breakdown": stock_breakdown,
        "monthly_trend": monthly_trend,
        "recent_purchases": recent_purchases
    }