from sqlalchemy import Boolean, Column, Integer, String, Float
from app.core.database import Base
class Material(Base):

    __tablename__ = "materials"
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    # material name
    name = Column(
        String(100),
        unique=True,
        nullable=False
    )

    # unit type
    unit = Column(
        String(20),
        nullable=False
    )

    # minimum stock alert level
    minimum_stock = Column(
        Float,
        default=10
    )
    is_active = Column(
    Boolean,
    default=True
)