from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import Category, CategoryRead, Product


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
@router.get("/{category_id}/products", response_model=list[Product])
def read_category_products(category_id: int):
    with Session(engine) as session:
        category = session.get(Category, category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        return category.products # Because we set up the Relationship(), we can just access .products

        
