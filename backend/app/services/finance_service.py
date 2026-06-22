from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.stock import StockIn
from app.models.purchase import Purchase


def get_total_expense(db: Session):

    total = db.query(
        func.sum(StockIn.quantity * StockIn.unit_price)
    ).scalar()

    return {
        "total_expense": total or 0
    }


def get_total_purchases(db: Session):

    total = db.query(
        func.count(Purchase.id)
    ).scalar()

    return {
        "total_purchases": total
    }


def get_recent_purchases(db: Session):

    purchases = db.query(Purchase).order_by(
        Purchase.id.desc()
    ).limit(5).all()

    return purchases


def get_finance_dashboard(db: Session):

    total_expense = db.query(
        func.sum(
            StockIn.quantity *
            StockIn.unit_price
        )
    ).scalar() or 0

    total_purchases = db.query(
        func.count(Purchase.id)
    ).scalar() or 0

    purchases = db.query(
        Purchase
    ).order_by(
        Purchase.id.desc()
    ).limit(5).all()

    recent_purchases = []

    for purchase in purchases:

        recent_purchases.append({

            "id":
                purchase.id,

            "material_name":
                purchase.material.name,

            "quantity":
                purchase.quantity,

            "total_amount":
                purchase.total_amount,

            "status":
                purchase.status
        })

    return {

        "total_expense":
            total_expense,

        "total_purchases":
            total_purchases,

        "recent_purchases":
            recent_purchases
    }