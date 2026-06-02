from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.item import Item

class ItemRepository:
    def get(self, db: Session, item_id: int) -> Optional[Item]:
        return db.query(Item).filter(Item.id == item_id).first()

    def get_multi(self, db: Session, owner_id: int, skip: int = 0, limit: int = 100) -> List[Item]:
        return (
            db.query(Item)
            .filter(Item.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_multi_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Item]:
        return db.query(Item).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: dict) -> Item:
        db_obj = Item(**obj_in)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: Item, obj_in: dict) -> Item:
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, item_id: int) -> Optional[Item]:
        obj = db.query(Item).get(item_id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

item_repo = ItemRepository()
