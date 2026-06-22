from pydantic import BaseModel, Field
from typing import Literal

class PurchaseCreate(BaseModel):
    material_id: int
    supplier_id: int
    quantity: float = Field(
        gt=0,
        description="Purchase quantity"
    )
    unit_price: float = Field(
        gt=0,
        description="Price per unit"
    )
    # optional workflow status
    status: Literal[
    "pending",
    "approved",
    "delivered"
] = "Completed"

class Config:
        from_attributes = True
        
        
class PurchaseResponse(BaseModel):

    id: int

    material_name: str

    supplier_name: str

    quantity: float

    unit_price: float

    total_amount: float

    status: str

    class Config:
        from_attributes = True