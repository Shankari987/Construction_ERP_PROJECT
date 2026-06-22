from pydantic import BaseModel, Field
from typing import Optional

class StockOutCreate(BaseModel):
    material_id: int

    quantity: float = Field(
        gt=0,
        description="Stock issue quantity"
    )
    site_name: str
    purpose: Optional[str] = None
    requested_by: Optional[str] = None
    
class StockOutResponse(BaseModel):
    id: int
    material_id: int
    quantity: float
    site_name: str
    purpose: Optional[str]
    requested_by: Optional[str]

    class Config:
        from_attributes = True