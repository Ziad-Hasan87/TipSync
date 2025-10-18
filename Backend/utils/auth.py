from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext
from models.auth import User
from jwt import PyJWTError, encode, decode
from sqlalchemy.orm import Session
from utils.db import get_db
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)

def set_password(password: str) -> str:
    return pwd_context.hash(password)

# JWT config
JWT_SECRET_KEY = "ziad"  # ⚠️ move this to an environment variable!
JWT_ALGORITHM = "HS256"
JWT_EXP_MINUTES = 300000  # integer, not string!

def generate_jwt_token(user: User) -> str:
    now = datetime.utcnow()
    exp = now + timedelta(minutes=JWT_EXP_MINUTES)
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "iat": now,
        "exp": exp,
    }
    token = encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token

def verify_jwt_token(token: str) -> dict:
    try:
        payload = decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except PyJWTError:
        raise

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    try:
        payload = verify_jwt_token(token)
    except PyJWTError:
        return None

    user_id = payload.get("sub")
    if user_id is None:
        return None

    return db.query(User).filter(User.id == int(user_id)).first()
