from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from enum import Enum
from pydantic import computed_field

if TYPE_CHECKING:
    from .user_models import User
    from .product_models import Product

# ---------------- ORDER ITEM (The Link Table) ----------------

class OrderStatus(str, Enum):
    CART = "cart"
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

# creates an order_id when adding an item to the cart
class OrderItemCreate(SQLModel):
    """customer adds an item to a cart/order"""
    user_id: int
    product_id: int
    quantity: int = 1
    price_at_purchase: float
    order_id: Optional[int] = None # Optional in case the order is created later

# ------------ ORDER (The Main Receipt) ---------------------

class OrderBase(SQLModel):
    user_id: int = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending") # e.g., pending, shipped, delivered
    full_name: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    order_number: Optional[str] = Field(default=None, index=True)
    tracking_number: Optional[str] = Field(default=None)
    carrier: Optional[str] = Field(default=None)

class Order(OrderBase, table=True):
    __tablename__ = "orders"
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relationships
    user: "User" = Relationship(back_populates="orders")
    items: List["OrderItem"] = Relationship(back_populates="order")

# --- ---------------------DTOs for API -----------------------

from .product_models import ProductRead

class OrderItemRead(OrderItemBase):
    id: int
    product: Optional[ProductRead] = None

class OrderRead(OrderBase):
    id: int
    items: List[OrderItemRead] = [] 
    
    @computed_field
    @property
    def total_price(self) -> float:
        """Automatically calculates total when accessed"""
        return sum(item.price_at_purchase * item.quantity for item in self.items)


class OrderCreate(OrderBase):
    pass