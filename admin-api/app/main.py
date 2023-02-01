"""FastAPI admin service for LuxCar. Shares MongoDB with the Express public API."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import config, security
from .db import get_db
from .routers import auth, cars, inquiries, stats


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Bootstrap the default admin account from env vars (idempotent).
    db = get_db()
    existing = await db["admins"].find_one({"email": config.ADMIN_EMAIL.lower()})
    if not existing:
        await db["admins"].insert_one(
            {
                "email": config.ADMIN_EMAIL.lower(),
                "passwordHash": security.hash_password(config.ADMIN_PASSWORD),
            }
        )
    yield


app = FastAPI(title="LuxCar Admin API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True, "app": "LuxCar Admin API"}


app.include_router(auth.router)
app.include_router(cars.router)
app.include_router(inquiries.router)
app.include_router(stats.router)
