import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import activity_log as activity_log_crud
from app.database import get_db
from app.schemas.activity_log import ActivityLogCreate, ActivityLogResponse, NotificationResponse

router = APIRouter(prefix="/activity", tags=["Activity"])


@router.post("/log", response_model=ActivityLogResponse, status_code=status.HTTP_201_CREATED)
async def create_log(data: ActivityLogCreate, db: AsyncSession = Depends(get_db)):
    return await activity_log_crud.create_log(db, data)


@router.get("/logs")
async def get_all_logs(
    user_id: uuid.UUID | None = None,
    reference_type: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1),
    db: AsyncSession = Depends(get_db),
):
    return await activity_log_crud.get_all_logs(db, user_id, reference_type, date_from, date_to, page, size)


@router.get("/logs/{reference_type}/{reference_id}", response_model=list[ActivityLogResponse])
async def get_logs_by_reference(reference_type: str, reference_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await activity_log_crud.get_logs_by_reference(db, reference_type, reference_id)


@router.get("/notifications/{user_id}", response_model=list[NotificationResponse])
async def get_notifications(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await activity_log_crud.get_notifications(db, user_id)


@router.patch("/notifications/{log_id}/read", response_model=NotificationResponse)
async def mark_notification_read(log_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await activity_log_crud.mark_notification_read(db, log_id)
