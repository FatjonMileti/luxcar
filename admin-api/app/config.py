"""Centralised environment variables for the admin API (no hardcoded secrets/URLs)."""

import os

from dotenv import load_dotenv

load_dotenv()


def _required(name: str, fallback: str | None = None) -> str:
    value = os.getenv(name, fallback)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


PORT: int = int(os.getenv("PORT", "8000"))
MONGO_URI: str = _required("MONGO_URI", "mongodb://127.0.0.1:27017/luxcar")
JWT_SECRET: str = _required("JWT_SECRET", "dev-only-change-me")
JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", "720"))
JWT_ALGORITHM: str = "HS256"
ADMIN_EMAIL: str = _required("ADMIN_EMAIL", "admin@luxcar.al")
ADMIN_PASSWORD: str = _required("ADMIN_PASSWORD", "admin123")
CLIENT_URL: str = os.getenv("CLIENT_URL", "http://localhost:5173")
