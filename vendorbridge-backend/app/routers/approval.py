import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import approval as approval_crud
from app.database import get_db
from app.models.approval import ApprovalStatus
from app.schemas.approval import ApprovalActionRequest, ApprovalCreate, ApprovalResponse, ApprovalTimelineEvent

router = APIRouter(prefix="/approvals", tags=["Approvals"])


@router.post("/", response_model=ApprovalResponse, status_code=status.HTTP_201_CREATED)
async def create_approval(data: ApprovalCreate, db: AsyncSession = Depends(get_db)):
    return await approval_crud.create_approval(db, data)


@router.get("/", response_model=list[ApprovalResponse])
async def get_all_approvals(status: ApprovalStatus | None = None, approver_id: uuid.UUID | None = None, db: AsyncSession = Depends(get_db)):
    return await approval_crud.get_all_approvals(db, status, approver_id)


@router.get("/{approval_id}", response_model=ApprovalResponse)
async def get_approval_by_id(approval_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await approval_crud.get_approval_by_id(db, approval_id)


@router.patch("/{approval_id}/approve", response_model=ApprovalResponse)
async def approve_approval(approval_id: uuid.UUID, data: ApprovalActionRequest, db: AsyncSession = Depends(get_db)):
    return await approval_crud.approve_approval(db, approval_id, data.approver_id, data.remarks)


@router.patch("/{approval_id}/reject", response_model=ApprovalResponse)
async def reject_approval(approval_id: uuid.UUID, data: ApprovalActionRequest, db: AsyncSession = Depends(get_db)):
    return await approval_crud.reject_approval(db, approval_id, data.approver_id, data.remarks)


@router.get("/{approval_id}/timeline", response_model=list[ApprovalTimelineEvent])
async def get_approval_timeline(approval_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await approval_crud.get_approval_timeline(db, approval_id)
