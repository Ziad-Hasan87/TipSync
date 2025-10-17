from fastapi import APIRouter,Body, Depends
from sqlalchemy.orm import Session
from utils.db import get_db
from models.auth import User
from utils.auth import verify_password, set_password
from utils.auth import generate_jwt_token

auth_router = APIRouter(prefix="/auth", tags=["auth"])
# Define your authentication routes here


@auth_router.post("/register")
async def register(email:str = Body(...), password:str = Body(...), db:Session = Depends(get_db)):
    db.add(User(email=email, hashed_password= set_password(password)))
    db.commit()
    return {"message": "User registered successfully"}


@auth_router.post("/login")
async def login(email:str = Body(...), password:str = Body(...), db:Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user and verify_password(password, user.hashed_password):
        return {"message": "Login successful", "access_token": generate_jwt_token(user)}
    return {"message": "Invalid credentials"}