from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from enum import Enum

if TYPE_CHECKING:
    from .user_models import User
    from .product_models import Product

# --- ORDER ITEM (The Link Table) ---

class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class OrderItemBase(SQLModel):
    order_id: Optional[int] = Field(default=None, foreign_key="orders.id")
    product_id: Optional[int] = Field(default=None, foreign_key="products.id")
    quantity: int = Field(default=1)
    price_at_purchase: float # Vital for historical accuracy!

class OrderItem(OrderItemBase, table=True):
    __tablename__ = "order_items"
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relationships
    order: "Order" = Relationship(back_populates="items")
    product: "Product" = Relationship(back_populates="order_items")

class OrderItemCreate(SQLModel):
    """What the frontend sends to add an item to a cart/order"""
    product_id: int
    quantity: int = 1
    price_at_purchase: float
    order_id: Optional[int] = None # Optional in case the order is created later

# --- ORDER (The Main Receipt) ---

class OrderBase(SQLModel):
    user_id: int = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending") # e.g., pending, shipped, delivered

class Order(OrderBase, table=True):
    __tablename__ = "orders"
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relationships
    user: "User" = Relationship(back_populates="orders")
    items: List["OrderItem"] = Relationship(back_populates="order")

# --- DTOs for API ---

class OrderRead(OrderBase):
    id: int
    items: List[OrderItem] # Allows the frontend to see items inside the order object

class OrderCreate(OrderBase):
    pass