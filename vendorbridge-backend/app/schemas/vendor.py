import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.models.vendor import VendorStatus


class VendorCreate(BaseModel):
    company_name: str = Field(min_length=1, max_length=255)
    contact_person: str = Field(min_length=1, max_length=255)
    email: EmailStr
    phone: str = Field(min_length=1, max_length=50)
    gst_number: str | None = Field(default=None, max_length=50)
    category: str | None = Field(default=None, max_length=100)
    address: str | None = None


class VendorUpdate(BaseModel):
    company_name: str | None = Field(default=None, min_length=1, max_length=255)
    contact_person: str | None = Field(default=None, min_length=1, max_length=255)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, min_length=1, max_length=50)
    gst_number: str | None = Field(default=None, max_length=50)
    category: str | None = Field(default=None, max_length=100)
    address: str | None = None
    status: VendorStatus | None = None
    rating: float | None = Field(default=None, ge=0)


class VendorStatusUpdate(BaseModel):
    status: VendorStatus


class VendorResponse(BaseModel):
    id: uuid.UUID
    company_name: str
    contact_person: str
    email: EmailStr
    phone: str
    gst_number: str | None
    category: str | None
    address: str | None
    status: VendorStatus
    rating: float
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedVendorResponse(BaseModel):
    total: int
    page: int
    size: int
    vendors: list[VendorResponse]
