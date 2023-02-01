"""Admin car management: list/search, create, update, delete."""

import math
import re

from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..deps import get_current_admin, get_database
from ..schemas import CarCreate, CarListResponse, CarOut, CarUpdate
from ..serializers import parse_object_id, serialize_car

router = APIRouter(prefix="/admin/cars", tags=["admin-cars"])


@router.get("", response_model=CarListResponse)
async def list_cars(
    search: str = Query(default=""),
    status: str = Query(default=""),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    _admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    filt: dict = {}
    if search:
        rx = re.compile(re.escape(search), re.IGNORECASE)
        filt["$or"] = [{"brand": rx}, {"model": rx}, {"engine": rx}]
    if status:
        filt["status"] = status
    total = await db["cars"].count_documents(filt)
    pages = max(1, math.ceil(total / limit))
    cursor = db["cars"].find(filt).sort("createdAt", -1).skip((page - 1) * limit).limit(limit)
    cars = [serialize_car(d) async for d in cursor]
    return {"total": total, "page": page, "pages": pages, "cars": cars}


@router.post("", response_model=CarOut, status_code=201)
async def create_car(
    payload: CarCreate,
    _admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    result = await db["cars"].insert_one(payload.model_dump())
    doc = await db["cars"].find_one({"_id": result.inserted_id})
    assert doc is not None
    return serialize_car(doc)


@router.put("/{car_id}", response_model=CarOut)
async def update_car(
    car_id: str,
    payload: CarUpdate,
    _admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    oid = parse_object_id(car_id)
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if update:
        await db["cars"].update_one({"_id": oid}, {"$set": update})
    doc = await db["cars"].find_one({"_id": oid})
    if not doc:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    return serialize_car(doc)


@router.delete("/{car_id}")
async def delete_car(
    car_id: str,
    _admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    oid = parse_object_id(car_id)
    result = await db["cars"].delete_one({"_id": oid})
    if result.deleted_count == 0:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    return {"message": "Car deleted"}
