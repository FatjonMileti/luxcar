"""Pydantic schemas. Field names match the English DB schema used by the MERN app."""

from typing import Literal

from pydantic import BaseModel, EmailStr, Field

Fuel = Literal["Petrol", "Diesel", "Electric", "Hybrid", "LPG", "CNG"]
Transmission = Literal["Automatic", "Manual"]
CarStatus = Literal["In Stock", "In Transit", "Sold", "On Order"]
InquiryStatus = Literal["New", "Read", "Closed"]


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminMe(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr

    model_config = {"populate_by_name": True}


class CarBase(BaseModel):
    brand: str
    model: str
    year: int = Field(ge=1990, le=2030)
    price: float = Field(ge=0)
    mileage: float = Field(ge=0)
    fuel: Fuel
    transmission: Transmission
    engine: str
    inspected: bool = True
    color: str = ""
    description: str = ""
    image: str = ""
    images: list[str] = []
    featured: bool = False
    status: CarStatus = "In Stock"


class CarCreate(CarBase):
    pass


class CarUpdate(BaseModel):
    brand: str | None = None
    model: str | None = None
    year: int | None = Field(default=None, ge=1990, le=2030)
    price: float | None = Field(default=None, ge=0)
    mileage: float | None = Field(default=None, ge=0)
    fuel: Fuel | None = None
    transmission: Transmission | None = None
    engine: str | None = None
    inspected: bool | None = None
    color: str | None = None
    description: str | None = None
    image: str | None = None
    images: list[str] | None = None
    featured: bool | None = None
    status: CarStatus | None = None


class CarOut(CarBase):
    id: str = Field(alias="_id")

    model_config = {"populate_by_name": True}


class CarListResponse(BaseModel):
    total: int
    page: int
    pages: int
    cars: list[CarOut]


class InquiryStatusUpdate(BaseModel):
    status: InquiryStatus


class InquiryOut(BaseModel):
    id: str = Field(alias="_id")
    name: str
    phone: str
    email: str = ""
    message: str
    car: str | None = None
    carLabel: str | None = None
    status: InquiryStatus

    model_config = {"populate_by_name": True}


class StatsOut(BaseModel):
    totalCars: int
    inStock: int
    inTransit: int
    sold: int
    featured: int
    totalInquiries: int
    newInquiries: int
    totalStockValue: float
