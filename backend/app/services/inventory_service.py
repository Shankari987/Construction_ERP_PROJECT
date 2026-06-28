from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.stock import StockIn, StockOut


# calculate available stock
def calculate_stock(
    db: Session,
    material_id: int
):

    stock_in = db.query(
        func.sum(StockIn.quantity)
    ).filter(
        StockIn.material_id == material_id
    ).scalar()

    stock_out = db.query(
        func.sum(StockOut.quantity)
    ).filter(
        StockOut.material_id == material_id
    ).scalar()

    available_stock = float(stock_in or 0.0) - float(stock_out or 0.0)

    return available_stock


# low stock checker
def is_low_stock(
    available_stock,
    minimum_stock
):
    min_stock = float(minimum_stock or 0.0)
    return float(available_stock or 0.0) < min_stock