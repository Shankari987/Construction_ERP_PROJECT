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
    ).scalar() or 0

    stock_out = db.query(
        func.sum(StockOut.quantity)
    ).filter(
        StockOut.material_id == material_id
    ).scalar() or 0

    available_stock = stock_in - stock_out

    return available_stock


# low stock checker
def is_low_stock(
    available_stock,
    minimum_stock
):

    return available_stock < minimum_stock