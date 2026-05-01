from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import Category, CategoryRead, Product, ProductPaginationRead
from sqlalchemy import func


router = APIRouter(
    prefix = "/categories",
    tags = ["Categories"]
)

# Endpoint 1: Get all categories 
@router.get("/", response_model=list[CategoryRead])
def read_categories():
    with Session(engine) as session:
        statement = select(Category)
        return session.exec(statement).all()

# Endpoint 2: Get all products in a specific category (for category pages)
@router.get("/{category_id}/products", response_model=ProductPaginationRead)
def read_category_products(category_id: int, skip: int = 0, limit: int = 15):
    with Session(engine) as session:
        category = session.get(Category, category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # 1. Count total products in this category
        # We need a query that counts products associated with this category ID
        # Since it's a relationship, we can query the Product table filtered by category
        count_statement = select(func.count(Product.id)).where(Product.categories.any(Category.id == category_id)).where(Product.is_active == True)
        total = session.exec(count_statement).one()

        # 2. Get the paginated products
        statement = select(Product).where(Product.categories.any(Category.id == category_id)).where(Product.is_active == True).order_by(Product.id).offset(skip).limit(limit)
        results = session.exec(statement).all()

        return {'items': results, 'totalCount': total}

        
