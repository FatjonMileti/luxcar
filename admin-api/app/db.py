"""Shared async MongoDB client. Uses the same DB as the Express API."""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import MongoClient

from . import config

_client: AsyncIOMotorClient | None = None


def _db_name() -> str:
    # Reuse the database name from MONGO_URI (defaults to "luxcar").
    parsed = MongoClient(config.MONGO_URI).get_database()
    return parsed.name


def get_db() -> AsyncIOMotorDatabase:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(config.MONGO_URI)
    return _client[_db_name()]
