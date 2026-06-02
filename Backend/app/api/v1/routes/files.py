from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app import schemas
from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.services.storage_service import storage_service

router = APIRouter()

@router.get("/", response_model=List[schemas.FileRecord])
def list_files(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """List files owned by current user."""
    records = storage_service.get_files(db, owner_id=current_user.id, skip=skip, limit=limit)
    result = []
    for r in records:
        url = storage_service.get_presigned_url(r.bucket, r.object_key)
        item = schemas.FileRecord.model_validate(r)
        item.download_url = url
        result.append(item)
    return result

@router.post("/upload", response_model=schemas.FileRecord, status_code=201)
def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Upload a file to MinIO and record metadata in DB."""
    try:
        record = storage_service.upload_file(db, file, owner_id=current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    url = storage_service.get_presigned_url(record.bucket, record.object_key)
    result = schemas.FileRecord.model_validate(record)
    result.download_url = url
    return result

@router.delete("/{file_id}", status_code=204)
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete a file from MinIO and remove the DB record."""
    record = storage_service.get_file(db, file_id=file_id)
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    if record.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough privileges")

    if not storage_service.delete_file(db, file_id=file_id):
        raise HTTPException(status_code=500, detail="Failed to delete file")
