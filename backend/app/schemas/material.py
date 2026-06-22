from pydantic import BaseModel, Field
class MaterialCreate(BaseModel):
    name: str
    unit: str
    minimum_stock: float = Field(
        gt=0,
        description="Minimum stock alert level"
    )
class MaterialResponse(BaseModel):
    id: int
    name: str
    unit: str
    minimum_stock: float
    is_active: bool
    class Config:
        from_attributes = True