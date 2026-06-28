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
    invoice_number: str | None = None

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
    payment_status: str
    amount_paid: float
    invoice_number: str | None = None

    class Config:
        from_attributes = True


class PaymentRequest(BaseModel):
    amount: float = Field(gt=0)


class StatusUpdateRequest(BaseModel):
    status: Literal["approved", "delivered", "cancelled"]