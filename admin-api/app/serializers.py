"""Shared serialisers: Mongo docs -> API shapes (keeps `_id` like the Express API)."""

from bson import ObjectId


def serialize_car(doc: dict) -> dict:
    return {
        "_id": str(doc["_id"]),
        "brand": doc.get("brand", ""),
        "model": doc.get("model", ""),
        "year": doc.get("year", 0),
        "price": doc.get("price", 0),
        "mileage": doc.get("mileage", 0),
        "fuel": doc.get("fuel", ""),
        "transmission": doc.get("transmission", ""),
        "engine": doc.get("engine", ""),
        "inspected": bool(doc.get("inspected", False)),
        "color": doc.get("color", ""),
        "description": doc.get("description", ""),
        "image": doc.get("image", ""),
        "images": doc.get("images", []),
        "featured": bool(doc.get("featured", False)),
        "status": doc.get("status", ""),
    }


def parse_object_id(value: str) -> ObjectId:
    if not ObjectId.is_valid(value):
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    return ObjectId(value)
