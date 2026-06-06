import uuid

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import vendor as vendor_crud
from app.database import get_db
from app.models.vendor import VendorStatus
from app.schemas.vendor import PaginatedVendorResponse, VendorCreate, VendorResponse, VendorStatusUpdate, VendorUpdate

router = APIRouter(prefix="/vendors", tags=["Vendors"])


@router.post("/", response_model=VendorResponse, status_code=status.HTTP_201_CREATED)
async def create_vendor(data: VendorCreate, db: AsyncSession = Depends(get_db)):
    return await vendor_crud.create_vendor(db, data)


@router.get("/", response_model=PaginatedVendorResponse)
async def get_all_vendors(
    status: VendorStatus | None = None,
    category: str | None = None,
    search: str | None = None,
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1),
    db: AsyncSession = Depends(get_db),
):
    return await vendor_crud.get_all_vendors(db, status, category, search, page, size)


@router.get("/{vendor_id}", response_model=VendorResponse)
async def get_vendor_by_id(vendor_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await vendor_crud.get_vendor_by_id(db, vendor_id)


@router.patch("/{vendor_id}", response_model=VendorResponse)
async def update_vendor(vendor_id: uuid.UUID, data: VendorUpdate, db: AsyncSession = Depends(get_db)):
    return await vendor_crud.update_vendor(db, vendor_id, data)


@router.patch("/{vendor_id}/status", response_model=VendorResponse)
async def update_vendor_status(vendor_id: uuid.UUID, data: VendorStatusUpdate, db: AsyncSession = Depends(get_db)):
    return await vendor_crud.update_vendor_status(db, vendor_id, data.status)


@router.delete("/{vendor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vendor(vendor_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    await vendor_crud.delete_vendor(db, vendor_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
