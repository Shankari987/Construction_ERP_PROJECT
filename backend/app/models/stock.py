from sqlalchemy import (
    Column,
    Integer,
    Float,
    ForeignKey,
    DateTime,
    String
)

from datetime import datetime
from sqlalchemy.orm import relationship
from app.core.database import Base


class StockIn(Base):

    __tablename__ = "stock_in"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    material_id = Column(
        Integer,
        ForeignKey("materials.id"),
        nullable=False
    )

    quantity = Column(
        Float,
        nullable=False
    )

    unit_price = Column(
        Float,
        nullable=False
    )

    # Link to the purchase that created this stock entry
    purchase_id = Column(
        Integer,
        ForeignKey("purchases.id"),
        nullable=True,
        unique=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    purchase = relationship("Purchase")


class StockOut(Base):

    __tablename__ = "stock_out"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    material_id = Column(
        Integer,
        ForeignKey("materials.id"),
        nullable=False
    )

    quantity = Column(
        Float,
        nullable=False
    )

    # site requesting material
    site_name = Column(
        String(100),
        nullable=False
    )

    # reason for stock usage
    purpose = Column(
        String(200),
        nullable=True
    )
    # requested person
    requested_by = Column(
        String(100),
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )