from pydantic import BaseModel, Field
from typing import Optional

class SupplierCreate(BaseModel):

    name: str = Field(
        min_length=2,
        max_length=100
    )
    contact: str = Field(
        min_length=5,
        max_length=100
    )
    # optional supplier address
    address: Optional[str] = None

class SupplierResponse(BaseModel):
    id: int
    name: str
    contact: str
    address: Optional[str]
    is_active: bool
    class Config:
        from_attributes = True