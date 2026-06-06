import uuid
from datetime import datetime

from pydantic import BaseModel


class ActivityLogCreate(BaseModel):
    user_id: uuid.UUID
    action: str
    reference_id: uuid.UUID | None = None
    reference_type: str | None = None
    description: str | None = None


class ActivityLogResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    action: str
    reference_id: uuid.UUID | None
    reference_type: str | None
    description: str | None
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class NotificationResponse(BaseModel):
    id: uuid.UUID
    action: str
    description: str | None
    reference_type: str | None
    reference_id: uuid.UUID | None
    created_at: datetime
    is_read: bool

    model_config = {"from_attributes": True}
