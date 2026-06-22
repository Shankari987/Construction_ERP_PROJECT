from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User
from app.schemas.user import (
    RegisterSchema,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)
router = APIRouter()
# database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
# register
@router.post("/register")
def register(
    data: RegisterSchema,
    db: Session = Depends(get_db)
):
    # check existing user
    existing_user = db.query(User).filter(
        User.username == data.username
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )
    # create user
    new_user = User(
        username=data.username,
        password=hash_password(data.password),
        role="site_engineer"
    )
    db.add(new_user)
    db.commit()
    return {
        "message": "User registered successfully"
    }
# login
@router.post("/login")
def login(
    data: OAuth2PasswordRequestForm = Depends(),
    
    db: Session = Depends(get_db)
    
):
    print(data.username)
    print(data.password)
    print(len(data.password))


    user = db.query(User).filter(
        User.username == data.username
    ).first()
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username"
        )
        
    if not verify_password(
        data.password,
        user.password
        
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )
    token = create_access_token({
        "sub": user.username,
        "role": user.role
    })
    
    return {
    "access_token": token,
    "token_type": "bearer",
    "user": {
        "id": user.id,
        "username": user.username,
        "role": user.role
    }
}