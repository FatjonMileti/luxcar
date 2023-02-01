"""Admin inquiry management: list, update status, delete."""

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..deps import get_current_admin, get_database
from ..schemas import InquiryOut, InquiryStatusUpdate

router = APIRouter(prefix="/admin/inquiries", tags=["admin-inquiries"])


# Legacy Albanian values (pre-English-rename) mapped to current English ones.
_LEGACY_STATUS = {"E re": "New", "E lexuar": "Read", "E mbyllur": "Closed"}


async def _serialize_inquiry(doc: dict, db: AsyncIOMotorDatabase) -> dict:
    status = doc.get("status", "New")
    status = _LEGACY_STATUS.get(status, status)
    if status not in ("New", "Read", "Closed"):
        status = "New"
    car_id = doc.get("car")
    label: str | None = None
    car_str: str | None = None
    if isinstance(car_id, ObjectId):
        car_str = str(car_id)
        car_doc = await db["cars"].find_one(
            {"_id": car_id}, {"brand": 1, "model": 1, "year": 1}
        )
        if car_doc:
            label = f"{car_doc.get('brand', '')} {car_doc.get('model', '')} {car_doc.get('year', '')}".strip()
    return {
        "_id": str(doc["_id"]),
        "name": doc.get("name") or doc.get("emri", ""),
        "phone": doc.get("phone") or doc.get("telefoni", ""),
        "email": doc.get("email", ""),
        "message": doc.get("message") or doc.get("mesazhi", ""),
        "car": car_str,
        "carLabel": label,
        "status": status,
    }


@router.get("", response_model=list[InquiryOut])
async def list_inquiries(
    status: str = Query(default=""),
    _admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    reverse_legacy = {v: k for k, v in _LEGACY_STATUS.items()}
    filt: dict = (
        {"status": {"$in": [status, reverse_legacy.get(status, status)]}} if status else {}
    )
    cursor = db["inquiries"].find(filt).sort("createdAt", -1).limit(200)
    return [await _serialize_inquiry(d, db) async for d in cursor]


@router.patch("/{inquiry_id}", response_model=InquiryOut)
async def update_inquiry(
    inquiry_id: str,
    payload: InquiryStatusUpdate,
    _admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    if not ObjectId.is_valid(inquiry_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")
    oid = ObjectId(inquiry_id)
    await db["inquiries"].update_one({"_id": oid}, {"$set": {"status": payload.status}})
    doc = await db["inquiries"].find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")
    return await _serialize_inquiry(doc, db)


@router.delete("/{inquiry_id}")
async def delete_inquiry(
    inquiry_id: str,
    _admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    if not ObjectId.is_valid(inquiry_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")
    result = await db["inquiries"].delete_one({"_id": ObjectId(inquiry_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")
    return {"message": "Deleted"}
