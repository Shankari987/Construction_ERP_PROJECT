from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.core.config import settings
# token
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/login"
)
# database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db

    finally:
        db.close()
# get current user
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:

        payload = jwt.decode(
    token,
    settings.SECRET_KEY,
    algorithms=[settings.ALGORITHM]
)
        username = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )
        user = db.query(User).filter(
            User.username == username
        ).first()
        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )
        return user
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
# admin check
def admin_only(
    user=Depends(get_current_user)
):
    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin only"
        )
    return user
def manager_only(
    user=Depends(get_current_user)
):
    if user.role not in [
        "admin",
        "manager"
    ]:
        raise HTTPException(
            status_code=403,
            detail="Manager access required"
        )
    return user