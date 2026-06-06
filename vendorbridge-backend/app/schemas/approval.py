import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.approval import ApprovalStatus


class ApprovalCreate(BaseModel):
    reference_id: uuid.UUID
    reference_type: str
    approver_id: uuid.UUID


class ApprovalUpdate(BaseModel):
    remarks: str | None = None


class ApprovalActionRequest(BaseModel):
    approver_id: uuid.UUID
    remarks: str | None = None


class ApprovalResponse(BaseModel):
    id: uuid.UUID
    reference_id: uuid.UUID
    reference_type: str
    status: ApprovalStatus
    remarks: str | None
    approver_id: uuid.UUID
    approved_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ApprovalTimelineEvent(BaseModel):
    event: str
    timestamp: datetime
    actor_id: uuid.UUID
    remarks: str | None = None
