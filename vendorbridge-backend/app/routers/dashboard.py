from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import dashboard as dashboard_crud
from app.database import get_db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
async def get_summary(db: AsyncSession = Depends(get_db)):
    return await dashboard_crud.get_summary(db)


@router.get("/quick-stats")
async def get_quick_stats(db: AsyncSession = Depends(get_db)):
    return await dashboard_crud.get_quick_stats(db)
