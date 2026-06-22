from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.schemas.supplier import (
    SupplierCreate,
    SupplierResponse
)

from app.utils.deps import (
    get_db,
    admin_only
)

from app.services.supplier_service import (
    create_supplier_service,
    get_all_suppliers_service,
    get_supplier_service,
    update_supplier_service,
    deactivate_supplier_service,
    activate_supplier_service,
    delete_supplier_service
)

router = APIRouter(
    tags=["Suppliers"]
)


# CREATE SUPPLIER
@router.post(
    "/",
    response_model=SupplierResponse
)
def create_supplier(
    data: SupplierCreate,
    db: Session = Depends(get_db),
    user=Depends(admin_only)
):

    return create_supplier_service(
        db,
        data
    )


# GET ALL SUPPLIERS
@router.get(
    "/",
    response_model=list[SupplierResponse]
)
def get_all_suppliers(
    db: Session = Depends(get_db)
):

    return get_all_suppliers_service(
        db
    )


# GET SINGLE SUPPLIER
@router.get(
    "/{supplier_id}",
    response_model=SupplierResponse
)
def get_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):

    return get_supplier_service(
        db,
        supplier_id
    )


# UPDATE SUPPLIER
@router.put(
    "/{supplier_id}",
    response_model=SupplierResponse
)
def update_supplier(
    supplier_id: int,
    data: SupplierCreate,
    db: Session = Depends(get_db),
    user=Depends(admin_only)
):

    return update_supplier_service(
        db,
        supplier_id,
        data
    )


# DEACTIVATE SUPPLIER
@router.put(
    "/deactivate/{supplier_id}"
)
def deactivate_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    user=Depends(admin_only)
):

    return deactivate_supplier_service(
        db,
        supplier_id
    )


# ACTIVATE SUPPLIER
@router.put(
    "/activate/{supplier_id}"
)
def activate_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    user=Depends(admin_only)
):

    return activate_supplier_service(
        db,
        supplier_id
    )


# HARD DELETE SUPPLIER
@router.delete(
    "/{supplier_id}"
)
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    user=Depends(admin_only)
):

    return delete_supplier_service(
        db,
        supplier_id
    )