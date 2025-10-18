from utils.auth import get_current_user
from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session
from utils.db import get_db
from models.auth import User
from utils.auth import verify_password, set_password, generate_jwt_token
from fastapi import Form
auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.post("/register")
async def register(email: str = Body(...), password: str = Body(...), db: Session = Depends(get_db)):
    print("Registering user:", email)
    print("With password:", password)
    # check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        return {"message": "User already exists"}

    new_user = User(email=email, hashed_password=set_password(password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}


@auth_router.post("/login")
async def login(email: str = Form(None), username : str = Form(None), password: str = Form(...), db: Session = Depends(get_db)):
    if(username):
        email = username
    user = db.query(User).filter(User.email == email).first()
    print("Logging in user:", email)
    print("With password:", password)
    print("Found user:", user)
    if user and verify_password(password, user.hashed_password):
        return {
            "message": "Login successful",
            "access_token": generate_jwt_token(user)
        }
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
        headers={"WWW-Authenticate": "Bearer"}
    )
@auth_router.get("/me")
async def read_current_user(user:User = Depends(get_current_user)):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"email": user.email, "id": user.id}