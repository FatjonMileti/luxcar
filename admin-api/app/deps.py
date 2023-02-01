"""Auth dependency: validates the Bearer JWT and loads the admin."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from . import security
from .db import get_db

_bearer = HTTPBearer(auto_error=False)


def get_database() -> AsyncIOMotorDatabase:
    return get_db()


async def get_current_admin(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict:
    if creds is None or not creds.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    admin_id = security.decode_token(creds.credentials)
    if not admin_id or not ObjectId.is_valid(admin_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    admin = await db["admins"].find_one({"_id": ObjectId(admin_id)})
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin not found")
    return admin
