from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from .order_models import Order

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True) # Essential for e-commerce
    full_name: Optional[str] = Field(default=None)

class User(UserBase, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    # In a real app, you'd store a hashed_password here, never plain text!
    hashed_password: str 
    is_admin: bool = Field(default=False) # Important for your Admin UI plan!

    orders: List["Order"] = Relationship(back_populates="user")

class UserCreate(UserBase):
    password: str # The frontend sends a raw password, which you'll hash

class UserRead(UserBase):
    id: int
    # Note: No password or hashed_password here! We never send those back.

class UserUpdate(SQLModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None