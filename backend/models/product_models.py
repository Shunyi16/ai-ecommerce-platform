from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

# This is the "Secret Sauce" for professional Python apps
if TYPE_CHECKING:
    from .order_models import OrderItem

# This is never used directly by the database or the API; 
# it only serves as a template for the other classes to inherit from.
class ProductBase(SQLModel):
    name: str = Field(index=True)
    description: Optional[str] = Field(default=None)
    # Using float is easier for now, Decimal is safer for real money apps
    price: float = Field(default=0.0) 
    inventory_count: int = Field(default=0)
    image_url: Optional[str] = Field(default=None)

class Product(ProductBase, table=True):
    __tablename__ = "products"
    id: Optional[int] = Field(default=None, primary_key=True)
    is_active: bool = Field(default=True)

    # KEEP THIS LINE! 
    # The quotes around "OrderItem" tell Python: 
    # "Don't look for this class yet, I'll show it to you later."
    order_items: List["OrderItem"] = Relationship(back_populates="product")

class ProductCreate(ProductBase):
    """What the Frontend sends to create a new product"""
    pass # No ID required, it's auto-generated

class ProductRead(ProductBase):
    """What the API sends back to the Frontend"""
    id: int # Now the ID is guaranteed to exist

class ProductUpdate(SQLModel):
    """What the Admin sends to update a product (all fields optional)"""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    inventory_count: Optional[int] = None
    is_active: Optional[bool] = None