from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.routes import (
    auth,
    material,
    supplier,
    purchase,
    inventory,
    finance,
    dashboard
)
Base.metadata.create_all(bind=engine)
app = FastAPI(title="Mini Construction ERP")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*","https://construction-erp-1.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(material.router, prefix="/api/v1/materials")
app.include_router(supplier.router, prefix="/api/v1/suppliers")
app.include_router(purchase.router, prefix="/api/v1/purchases")
app.include_router(inventory.router, prefix="/api/v1/inventory")
app.include_router(finance.router, prefix="/api/v1/finance")
app.include_router(dashboard.router, prefix="/api/v1/dashboard")