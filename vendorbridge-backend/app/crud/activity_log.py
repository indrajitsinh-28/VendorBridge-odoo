import uuid
from datetime import datetime

from fastapi import HTTPException, status as http_status
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.activity_log import ActivityLog
from app.schemas.activity_log import ActivityLogCreate


async def create_log(db: AsyncSession, data: ActivityLogCreate) -> ActivityLog:
    log = ActivityLog(**data.model_dump())
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log


async def get_all_logs(
    db: AsyncSession,
    user_id: uuid.UUID | None = None,
    reference_type: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    page: int = 1,
    size: int = 10,
) -> dict:
    filters = []
    if user_id is not None:
        filters.append(ActivityLog.user_id == user_id)
    if reference_type is not None:
        filters.append(ActivityLog.reference_type == reference_type)
    if date_from is not None:
        filters.append(ActivityLog.created_at >= date_from)
    if date_to is not None:
        filters.append(ActivityLog.created_at <= date_to)

    count_stmt = select(func.count(ActivityLog.id))
    stmt = select(ActivityLog).order_by(ActivityLog.created_at.desc())
    if filters:
        count_stmt = count_stmt.where(*filters)
        stmt = stmt.where(*filters)

    total_result = await db.execute(count_stmt)
    total = total_result.scalar_one()
    result = await db.execute(stmt.offset((page - 1) * size).limit(size))
    logs = result.scalars().all()
    return {"total": total, "page": page, "size": size, "logs": logs}


async def get_logs_by_reference(db: AsyncSession, reference_type: str, reference_id: uuid.UUID) -> list[ActivityLog]:
    result = await db.execute(
        select(ActivityLog)
        .where(ActivityLog.reference_type == reference_type)
        .where(ActivityLog.reference_id == reference_id)
        .order_by(ActivityLog.created_at.asc())
    )
    return result.scalars().all()


async def get_notifications(db: AsyncSession, user_id: uuid.UUID) -> list[ActivityLog]:
    result = await db.execute(
        select(ActivityLog)
        .where(ActivityLog.user_id == user_id)
        .order_by(ActivityLog.created_at.desc())
        .limit(20)
    )
    return result.scalars().all()


async def mark_notification_read(db: AsyncSession, log_id: uuid.UUID) -> ActivityLog:
    result = await db.execute(select(ActivityLog).where(ActivityLog.id == log_id))
    log = result.scalar_one_or_none()
    if log is None:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Activity log not found")
    log.is_read = True
    await db.commit()
    await db.refresh(log)
    return log
