from datetime import datetime, timedelta
from typing import Optional

from passlib.context import CryptContext
from models.auth import User
from jwt import PyJWTError, encode, decode
from sqlalchemy.orm import Session

from utils.db import get_db
from fastapi import Depends

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def set_password(password: str) -> str:
    hashed_password = pwd_context.hash(password)
    return hashed_password


# JWT configuration (can be overridden with environment variables)
JWT_SECRET_KEY = "ziad"
JWT_ALGORITHM = "HS256"
JWT_EXP_MINUTES = "300000"


def generate_jwt_token(user: User) -> str:
    """Generate a JWT for the given user.

    Payload includes:
      - sub: user id
      - email: user email
      - exp: expiration time
    """
    now = datetime.now()
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
    """Decode and verify a JWT token. Returns the payload on success.

    Raises PyJWTError on failure.
    """
    try:
        payload = decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except PyJWTError:
        raise


def get_current_user(token: str, db:Session= Depends(get_db)) -> Optional[User]:
    """Return the User instance for the provided access token, or None if not found/invalid."""
    try:
        payload = verify_jwt_token(token)
    except PyJWTError:
        return None

    user_id = payload.get("sub")
    if user_id is None:
        return None

    # load user from DB
    try:
        user = db.query(User).filter(User.id == int(user_id)).first()
        return user
    finally:
        db.close()
