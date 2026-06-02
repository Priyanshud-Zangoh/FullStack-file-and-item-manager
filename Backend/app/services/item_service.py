from typing import Optional, List
from sqlalchemy.orm import Session
from app.repositories.item_repo import item_repo
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemUpdate

class ItemService:
    def get_item(self, db: Session, item_id: int) -> Optional[Item]:
        return item_repo.get(db, item_id)

    def get_items(self, db: Session, owner_id: int, skip: int = 0, limit: int = 100) -> List[Item]:
        return item_repo.get_multi(db, owner_id=owner_id, skip=skip, limit=limit)

    def get_all_items(self, db: Session, skip: int = 0, limit: int = 100) -> List[Item]:
        return item_repo.get_multi_all(db, skip=skip, limit=limit)

    def create_item(self, db: Session, obj_in: ItemCreate, owner_id: int) -> Item:
        obj_data = obj_in.model_dump()
        obj_data["owner_id"] = owner_id
        return item_repo.create(db, obj_data)

    def update_item(self, db: Session, db_obj: Item, obj_in: ItemUpdate) -> Item:
        update_data = obj_in.model_dump(exclude_unset=True)
        return item_repo.update(db, db_obj, update_data)

    def delete_item(self, db: Session, item_id: int) -> Optional[Item]:
        return item_repo.remove(db, item_id)

item_service = ItemService()
