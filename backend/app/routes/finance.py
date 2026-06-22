from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.utils.deps import get_db, manager_only
from app.services.finance_service import (
    get_total_expense,
    get_total_purchases,
    get_recent_purchases,
    get_finance_dashboard
)
router = APIRouter(
    tags=["Finance"]
)

@router.get("/total-expense")
def total_expense(
    db: Session = Depends(get_db),
    current_user=Depends(manager_only)
):

    return get_total_expense(db)

@router.get("/total-purchases")
def total_purchases(
    db: Session = Depends(get_db),
    current_user=Depends(manager_only)
):

    return get_total_purchases(db)


@router.get("/recent-purchases")
def recent_purchases(
    db: Session = Depends(get_db),
    current_user=Depends(manager_only)
):

    return get_recent_purchases(db)


@router.get("/dashboard")
def finance_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(manager_only)
):
    return get_finance_dashboard(db)