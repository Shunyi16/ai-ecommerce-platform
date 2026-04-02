# products.py (Revised)
from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import Product, ProductCreate, ProductRead, ProductUpdate # New Imports

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductRead)
def create_product(product: ProductCreate):
    with Session(engine) as session:
        # Convert the "Create" DTO into the "Database" Model
        db_product = Product.model_validate(product)
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        return db_product

@router.patch("/{product_id}", response_model=ProductRead)
def update_product(product_id: int, product_update: ProductUpdate):
    with Session(engine) as session:
        db_product = session.get(Product, product_id)
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Only update the fields that were actually sent in the request
        update_data = product_update.model_dump(exclude_unset=True)        
        db_product.sqlmodel_update(update_data)
        
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        return db_product

@router.get("/", response_model=list[ProductRead])
def read_products():
    with Session(engine) as session:
        # Note: We filter for active products here!
        statement = select(Product).where(Product.is_active == True).order_by(Product.id)
        return session.exec(statement).all()