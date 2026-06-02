from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.file import FileRecord

class FileRepository:
    def get(self, db: Session, file_id: int) -> Optional[FileRecord]:
        return db.query(FileRecord).filter(FileRecord.id == file_id).first()

    def get_multi(self, db: Session, owner_id: int, skip: int = 0, limit: int = 100) -> List[FileRecord]:
        return (
            db.query(FileRecord)
            .filter(FileRecord.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create(self, db: Session, obj_in: dict) -> FileRecord:
        db_obj = FileRecord(**obj_in)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, file_id: int) -> Optional[FileRecord]:
        obj = db.query(FileRecord).get(file_id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

file_repo = FileRepository()
