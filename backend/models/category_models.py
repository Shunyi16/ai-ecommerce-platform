from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from .links import ProductCategoryLink 

if TYPE_CHECKING:
    from .product_models import Product

class Category(SQLModel, table=True):
    __tablename__ = "categories"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    
    # Many-to-Many relationship using the link table
    products: List["Product"] = Relationship(
        back_populates="categories", 
        link_model=ProductCategoryLink
    )

class CategoryCreate(SQLModel):
    name: str

class CategoryRead(SQLModel):
    id: int
    name: str
