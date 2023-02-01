"""Admin dashboard statistics over the shared cars/inquiries collections."""

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..deps import get_current_admin, get_database
from ..schemas import StatsOut

router = APIRouter(prefix="/admin/stats", tags=["admin-stats"])


@router.get("", response_model=StatsOut)
async def get_stats(
    _admin: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    total_cars = await db["cars"].count_documents({})
    in_stock = await db["cars"].count_documents({"status": "In Stock"})
    in_transit = await db["cars"].count_documents({"status": "In Transit"})
    sold = await db["cars"].count_documents({"status": "Sold"})
    featured = await db["cars"].count_documents({"featured": True})
    total_inquiries = await db["inquiries"].count_documents({})
    new_inquiries = await db["inquiries"].count_documents(
        {"status": {"$in": ["New", "E re"]}}  # "E re" = legacy Albanian for "New"
    )
    pipeline = [
        {"$match": {"status": {"$ne": "Sold"}}},
        {"$group": {"_id": None, "total": {"$sum": "$price"}}},
    ]
    agg = await db["cars"].aggregate(pipeline).to_list(length=1)
    total_value = float(agg[0]["total"]) if agg else 0.0
    return {
        "totalCars": total_cars,
        "inStock": in_stock,
        "inTransit": in_transit,
        "sold": sold,
        "featured": featured,
        "totalInquiries": total_inquiries,
        "newInquiries": new_inquiries,
        "totalStockValue": total_value,
    }
