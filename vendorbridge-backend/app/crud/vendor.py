import uuid

from fastapi import HTTPException, status as http_status
from sqlalchemy import func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.vendor import Vendor, VendorStatus
from app.schemas.vendor import VendorCreate, VendorUpdate


async def create_vendor(db: AsyncSession, data: VendorCreate) -> Vendor:
    vendor = Vendor(**data.model_dump())
    db.add(vendor)
    await db.commit()
    await db.refresh(vendor)
    return vendor


async def get_all_vendors(
    db: AsyncSession,
    status: VendorStatus | None = None,
    category: str | None = None,
    search: str | None = None,
    page: int = 1,
    size: int = 10,
) -> dict:
    filters = []
    if status is not None:
        filters.append(Vendor.status == status)
    if category is not None:
        filters.append(Vendor.category == category)
    if search:
        search_pattern = f"%{search}%"
        filters.append(or_(Vendor.company_name.ilike(search_pattern), Vendor.email.ilike(search_pattern)))

    count_stmt = select(func.count(Vendor.id))
    stmt = select(Vendor).order_by(Vendor.created_at.desc())
    if filters:
        count_stmt = count_stmt.where(*filters)
        stmt = stmt.where(*filters)

    total_result = await db.execute(count_stmt)
    total = total_result.scalar_one()

    result = await db.execute(stmt.offset((page - 1) * size).limit(size))
    vendors = result.scalars().all()

    return {"total": total, "page": page, "size": size, "vendors": vendors}


async def get_vendor_by_id(db: AsyncSession, vendor_id: uuid.UUID) -> Vendor:
    result = await db.execute(select(Vendor).where(Vendor.id == vendor_id))
    vendor = result.scalar_one_or_none()
    if vendor is None:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Vendor not found")
    return vendor


async def update_vendor(db: AsyncSession, vendor_id: uuid.UUID, data: VendorUpdate) -> Vendor:
    vendor = await get_vendor_by_id(db, vendor_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vendor, field, value)
    await db.commit()
    await db.refresh(vendor)
    return vendor


async def update_vendor_status(db: AsyncSession, vendor_id: uuid.UUID, status: VendorStatus) -> Vendor:
    vendor = await get_vendor_by_id(db, vendor_id)
    vendor.status = status
    await db.commit()
    await db.refresh(vendor)
    return vendor


async def delete_vendor(db: AsyncSession, vendor_id: uuid.UUID) -> Vendor:
    vendor = await get_vendor_by_id(db, vendor_id)
    vendor.status = VendorStatus.inactive
    await db.commit()
    await db.refresh(vendor)
    return vendor
