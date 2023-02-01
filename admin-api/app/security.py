"""Password hashing (bcrypt) + JWT helpers for admin auth."""

from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from . import config


def hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        return False


def create_token(admin_id: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": admin_id,
        "iat": now,
        "exp": now + timedelta(minutes=config.JWT_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, config.JWT_SECRET, algorithm=config.JWT_ALGORITHM)


def decode_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, config.JWT_SECRET, algorithms=[config.JWT_ALGORITHM])
        sub = payload.get("sub")
        return str(sub) if sub else None
    except jwt.PyJWTError:
        return None
