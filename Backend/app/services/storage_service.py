import io
import uuid
from typing import List, Optional
from datetime import timedelta
from minio.error import S3Error
from fastapi import UploadFile

from app.core.config import settings
from app.core.minio import get_minio_client
from app.repositories.file_repo import file_repo
from app.models.file import FileRecord
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

PRESIGNED_EXPIRY = timedelta(hours=1)

class StorageService:
    def get_file(self, db: Session, file_id: int) -> Optional[FileRecord]:
        return file_repo.get(db, file_id)

    def get_files(self, db: Session, owner_id: int, skip: int = 0, limit: int = 100) -> List[FileRecord]:
        return file_repo.get_multi(db, owner_id=owner_id, skip=skip, limit=limit)

    def upload_file(self, db: Session, file: UploadFile, owner_id: int) -> FileRecord:
        client = get_minio_client()
        bucket = settings.MINIO_BUCKET

        try:
            if not client.bucket_exists(bucket):
                client.make_bucket(bucket)
        except S3Error as e:
            logger.error(f"Storage error: {e}")
            raise

        ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else ""
        object_key = f"users/{owner_id}/{uuid.uuid4()}.{ext}" if ext else f"users/{owner_id}/{uuid.uuid4()}"

        content = file.file.read()
        file_size = len(content)

        try:
            client.put_object(
                bucket_name=bucket,
                object_name=object_key,
                data=io.BytesIO(content),
                length=file_size,
                content_type=file.content_type or "application/octet-stream",
            )
        except S3Error as e:
            logger.error(f"Upload failed: {e}")
            raise

        obj_data = {
            "filename": file.filename,
            "object_key": object_key,
            "content_type": file.content_type,
            "file_size": file_size,
            "bucket": bucket,
            "owner_id": owner_id,
        }
        return file_repo.create(db, obj_data)

    def delete_file(self, db: Session, file_id: int) -> bool:
        record = self.get_file(db, file_id)
        if not record:
            return False

        client = get_minio_client()
        try:
            client.remove_object(record.bucket, record.object_key)
        except S3Error as e:
            logger.warning(f"Failed to delete object from MinIO: {e}")
            # Proceed to delete from DB even if object missing

        file_repo.remove(db, file_id)
        return True

    def get_presigned_url(self, bucket: str, object_key: str) -> Optional[str]:
        client = get_minio_client()
        try:
            return client.presigned_get_object(bucket, object_key, expires=PRESIGNED_EXPIRY)
        except Exception as e:
            logger.error(f"Failed to generate presigned URL: {e}")
            return None

storage_service = StorageService()
