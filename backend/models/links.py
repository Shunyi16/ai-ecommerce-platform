from sqlmodel import SQLModel, Field
from typing import Optional

class ProductCategoryLink(SQLModel, table=True):
    __tablename__ = "product_category_links"
    product_id: Optional[int] = Field(default=None, foreign_key="products.id", primary_key=True)
    category_id: Optional[int] = Field(default=None, foreign_key="categories.id", primary_key=True)
