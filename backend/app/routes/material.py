from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.schemas.material import (
    MaterialCreate,
    MaterialResponse
)

from app.utils.deps import (
    get_db,
    admin_only
)

from app.services.material_service import (
    create_material_service,
    get_all_materials_service,
    get_material_service,
    update_material_service,
    deactivate_material_service,
    activate_material_service
)

router = APIRouter(
    tags=["Materials"]
)


# CREATE MATERIAL
@router.post(
    "/",
    response_model=MaterialResponse
)
def create_material(
    data: MaterialCreate,
    db: Session = Depends(get_db),
    user=Depends(admin_only)
):

    return create_material_service(
        db,
        data
    )


# GET ALL MATERIALS
@router.get(
    "/",
    response_model=list[MaterialResponse]
)
def get_all_materials(
    db: Session = Depends(get_db)
):

    return get_all_materials_service(db)


# GET SINGLE MATERIAL
@router.get(
    "/{material_id}",
    response_model=MaterialResponse
)
def get_material(
    material_id: int,
    db: Session = Depends(get_db)
):

    return get_material_service(
        db,
        material_id
    )


# UPDATE MATERIAL
@router.put(
    "/{material_id}",
    response_model=MaterialResponse
)
def update_material(
    material_id: int,
    data: MaterialCreate,
    db: Session = Depends(get_db),
    user=Depends(admin_only)
):

    return update_material_service(
        db,
        material_id,
        data
    )


# DEACTIVATE MATERIAL
@router.put("/deactivate/{material_id}")
def deactivate_material(
    material_id: int,
    db: Session = Depends(get_db),
    user=Depends(admin_only)
):

    return deactivate_material_service(
        db,
        material_id
    )


# ACTIVATE MATERIAL
@router.put("/activate/{material_id}")
def activate_material(
    material_id: int,
    db: Session = Depends(get_db),
    user=Depends(admin_only)
):

    return activate_material_service(
        db,
        material_id
    )