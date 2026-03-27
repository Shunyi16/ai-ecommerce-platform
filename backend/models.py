from datetime import datetime, timezone
from typing import Optional, List
from decimal import Decimal
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum

class OrderStatus(str,Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class User(SQLModel, table=True):
    __tablename__ = "users"

    # Optional[int] means it can be None before it's saved to the database
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    is_admin: bool = Field(default=False)
    # Automatically generates the timestamp when a user is created
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    order: List["Order"] = Relationship(back_populates="user")

class Product(SQLModel, table=True):
    __tablename__ = "products"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = Field(default=None)
    price: Decimal = Field(max_digits=10, decimal_places=2)
    inventory_count: int = Field(default=0)
    image_url: Optional[str] = Field(default=None)
    is_active: bool = Field(default=True)

    order_items: List["OrderItem"] = Relationship(back_populates="product")

class Order(SQLModel, table=True):
    __tablename__ = "orders"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    total_price: Decimal = Field(max_digits=10, decimal_places=2)
    status: OrderStatus = Field(default=OrderStatus.PENDING)
    create_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    user: "User" = Relationship(back_populates="order")
    items: List["OrderItem"] = Relationship(back_populates="order")

class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"

    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.id")
    product_id: int = Field(foreign_key="products.id")
    price_at_purchase: Decimal = Field(max_digits=10, decimal_places=2)
    quantity: int = Field(default=1)

    order: "Order" = Relationship(back_populates="items")
    product: "Product" = Relationship(back_populates="order_items")