from typing import Optional, List
from sqlalchemy.orm import Session
from app.repositories.user_repo import user_repo
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

class UserService:
    def get_user(self, db: Session, user_id: int) -> Optional[User]:
        return user_repo.get(db, user_id)

    def get_user_by_email(self, db: Session, email: str) -> Optional[User]:
        return user_repo.get_by_email(db, email)

    def get_user_by_username(self, db: Session, username: str) -> Optional[User]:
        return user_repo.get_by_username(db, username)

    def get_users(self, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        return user_repo.get_multi(db, skip=skip, limit=limit)

    def create_user(self, db: Session, obj_in: UserCreate) -> User:
        obj_data = {
            "email": obj_in.email,
            "username": obj_in.username,
            "hashed_password": get_password_hash(obj_in.password),
            "is_active": obj_in.is_active,
        }
        return user_repo.create(db, obj_data)

    def update_user(self, db: Session, db_obj: User, obj_in: UserUpdate) -> User:
        update_data = obj_in.model_dump(exclude_unset=True)
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        return user_repo.update(db, db_obj, update_data)

    def delete_user(self, db: Session, user_id: int) -> Optional[User]:
        return user_repo.remove(db, user_id)

    def authenticate(self, db: Session, email: str, password: str) -> Optional[User]:
        user = self.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

user_service = UserService()
