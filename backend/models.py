from datetime import datetime, timezone
from typing import Optional
from decimal import Decimal
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    __tablename__ = "users"

    # Optional[int] means it can be None before it's saved to the database
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    is_admin: bool = Field(default=False)
    # Automatically generates the timestamp when a user is created
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Product(SQLModel, table=True):
    __tablename__ = "products"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = Field(default=None)
    price: Decimal = Field(max_digits=10, decimal_places=2)
    inventory_count: int = Field(default=0)
    image_url: Optional[str] = Field(default=None)
