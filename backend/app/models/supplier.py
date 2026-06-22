from sqlalchemy import (
    Column,
    Boolean,
    Integer,
    String
)
from app.core.database import Base
class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    # supplier company name
    name = Column(
        String(100),
        unique=True,
        nullable=False
    )
    # contact number/email
    contact = Column(
        String(100),
        nullable=False
    )
    # supplier address
    address = Column(
        String(255),
        nullable=True
    )
    is_active = Column(
    Boolean,
    default=True
)