# products.py (Revised)
from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select, func
from database import engine
from models import Product, ProductCreate, ProductRead, ProductUpdate, ProductPaginationRead

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

@router.get("/", response_model=ProductPaginationRead)
def read_products(skip: int = 0, limit: int = 15):
    with Session(engine) as session:
        # 1. Get the total count of ACTIVE products
        count_statement = select(func.count(Product.id)).where(Product.is_active == True)
        total = session.exec(count_statement).one()

        # 2. Get the paginated results (with consistent ordering!)
        statement = select(Product).where(Product.is_active == True).order_by(Product.id).offset(skip).limit(limit)
        results = session.exec(statement).all()

        return {'items': results, 'totalCount': total}