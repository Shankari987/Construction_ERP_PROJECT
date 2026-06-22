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
class Purchase(Base):
    __tablename__ = "purchases"
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
    supplier_id = Column(
        Integer,
        ForeignKey("suppliers.id"),
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
    # total purchase cost
    total_amount = Column(
        Float,
        nullable=False
    )
    # workflow status
    status = Column(
        String(100),
        default="Completed"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    # relationships
    material = relationship("Material")

    supplier = relationship("Supplier")