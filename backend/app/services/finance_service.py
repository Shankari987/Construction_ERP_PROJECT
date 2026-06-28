from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.purchase import Purchase
from app.models.stock import StockIn
from datetime import datetime

def get_total_expense(db: Session):
    total = (
        db.query(func.sum(Purchase.total_amount))
        .filter(Purchase.status == "delivered")
        .scalar()
        or 0
    )
    return {"total_expense": total}

def get_total_purchases(db: Session):
    total = db.query(func.count(Purchase.id)).filter(Purchase.status == "delivered").scalar() or 0
    return {"total_purchases": total}

def get_recent_purchases(db: Session):
    purchases = db.query(Purchase).filter(Purchase.status == "delivered").order_by(Purchase.id.desc()).limit(5).all()
    return purchases

def get_finance_dashboard(db: Session):
    # Fetch all purchases to compute aggregates and trends in Python (database-agnostic)
    purchases = (
    db.query(Purchase)
    .filter(Purchase.status == "delivered")
    .order_by(Purchase.id.desc())
    .all()
    )    
    total_expense = sum(p.total_amount for p in purchases)
    total_paid = sum(p.amount_paid for p in purchases)
    accounts_payable = sum(max(0.0, p.total_amount - p.amount_paid) for p in purchases)
    
    recent_purchases = []
    for purchase in purchases:  # Return all purchases so frontend calculations cover 100% of records
        recent_purchases.append({
            "id": purchase.id,
            "material_name": purchase.material.name,
            "supplier_name": purchase.supplier.name,
            "quantity": purchase.quantity,
            "unit_price": purchase.unit_price,
            "total_amount": purchase.total_amount,
            "status": purchase.status,
            "payment_status": purchase.payment_status,
            "amount_paid": purchase.amount_paid,
            "invoice_number": purchase.invoice_number,
            "created_at": purchase.created_at.strftime("%d-%m-%Y")
        })

    # Group trends by month
    trend_dict = {}
    # Sort chronologically for the trend lines
    for p in sorted(purchases, key=lambda x: x.created_at):
        month_key = (p.created_at.year, p.created_at.month)
        month_name = p.created_at.strftime("%b %Y")
        if month_key not in trend_dict:
            trend_dict[month_key] = {
                "month": month_name,
                "expense": 0.0,
                "paid": 0.0
            }
        trend_dict[month_key]["expense"] += p.total_amount
        trend_dict[month_key]["paid"] += p.amount_paid
        
    # Get last 6 months of trends
    monthly_trend = list(trend_dict.values())[-6:]

    return {
        "total_expense": total_expense,
        "total_paid": total_paid,
        "accounts_payable": accounts_payable,
        "total_purchases": len(purchases),
        "recent_purchases": recent_purchases,
        "monthly_trend": monthly_trend
    }