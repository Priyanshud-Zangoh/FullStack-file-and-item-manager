from typing import Optional
from datetime import datetime
from pydantic import BaseModel


# Shared properties
class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_active: Optional[bool] = True


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


# Properties shared by models stored in DB
class ItemInDBBase(ItemBase):
    id: int
    owner_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# Additional properties to return via API
class Item(ItemInDBBase):
    pass
