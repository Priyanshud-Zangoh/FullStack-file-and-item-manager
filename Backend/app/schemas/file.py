from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class FileRecordBase(BaseModel):
    filename: str
    content_type: Optional[str] = None
    file_size: Optional[int] = None


class FileRecordCreate(FileRecordBase):
    object_key: str
    bucket: str


class FileRecord(FileRecordBase):
    id: int
    object_key: str
    bucket: str
    owner_id: int
    created_at: Optional[datetime] = None
    download_url: Optional[str] = None

    model_config = {"from_attributes": True}
