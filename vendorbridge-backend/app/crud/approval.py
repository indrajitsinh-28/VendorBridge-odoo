import uuid
from datetime import datetime

from fastapi import HTTPException, status as http_status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.approval import Approval, ApprovalStatus
from app.schemas.approval import ApprovalCreate, ApprovalTimelineEvent


async def create_approval(db: AsyncSession, data: ApprovalCreate) -> Approval:
    approval = Approval(**data.model_dump(), status=ApprovalStatus.pending)
    db.add(approval)
    await db.commit()
    await db.refresh(approval)
    return approval


async def get_all_approvals(db: AsyncSession, status: ApprovalStatus | None = None, approver_id: uuid.UUID | None = None) -> list[Approval]:
    stmt = select(Approval).order_by(Approval.created_at.desc())
    if status is not None:
        stmt = stmt.where(Approval.status == status)
    if approver_id is not None:
        stmt = stmt.where(Approval.approver_id == approver_id)
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_approval_by_id(db: AsyncSession, approval_id: uuid.UUID) -> Approval:
    result = await db.execute(select(Approval).where(Approval.id == approval_id))
    approval = result.scalar_one_or_none()
    if approval is None:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Approval not found")
    return approval


async def approve_approval(db: AsyncSession, approval_id: uuid.UUID, approver_id: uuid.UUID, remarks: str | None = None) -> Approval:
    approval = await get_approval_by_id(db, approval_id)
    approval.status = ApprovalStatus.approved
    approval.approver_id = approver_id
    approval.remarks = remarks
    approval.approved_at = datetime.utcnow()
    await db.commit()
    await db.refresh(approval)
    return approval


async def reject_approval(db: AsyncSession, approval_id: uuid.UUID, approver_id: uuid.UUID, remarks: str | None = None) -> Approval:
    approval = await get_approval_by_id(db, approval_id)
    approval.status = ApprovalStatus.rejected
    approval.approver_id = approver_id
    approval.remarks = remarks
    await db.commit()
    await db.refresh(approval)
    return approval


async def get_approval_timeline(db: AsyncSession, approval_id: uuid.UUID) -> list[ApprovalTimelineEvent]:
    approval = await get_approval_by_id(db, approval_id)
    events = [
        ApprovalTimelineEvent(
            event="created",
            timestamp=approval.created_at,
            actor_id=approval.approver_id,
            remarks=None,
        )
    ]
    if approval.status in {ApprovalStatus.approved, ApprovalStatus.rejected}:
        events.append(
            ApprovalTimelineEvent(
                event=approval.status.value,
                timestamp=approval.approved_at or approval.created_at,
                actor_id=approval.approver_id,
                remarks=approval.remarks,
            )
        )
    return events
