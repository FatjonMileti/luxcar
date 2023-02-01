"""Admin authentication: login + current admin profile."""

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from .. import security
from ..deps import get_current_admin, get_database
from ..schemas import AdminLogin, AdminMe, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(payload: AdminLogin, db: AsyncIOMotorDatabase = Depends(get_database)):
    admin = await db["admins"].find_one({"email": payload.email.lower()})
    if not admin or not security.verify_password(payload.password, admin["passwordHash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )
    return TokenResponse(access_token=security.create_token(str(admin["_id"])))


@router.get("/me", response_model=AdminMe)
async def me(admin: dict = Depends(get_current_admin)):
    return {"_id": str(admin["_id"]), "email": admin["email"]}
