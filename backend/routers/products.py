from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import Product

router = APIRouter(
    prefix = "/products",
    tags = ["Products"]
)

# Create a product
@router.post("/")
def create_product(product: Product):
    # Open a connection
    with Session(engine) as session:
        session.add(product)
        session.commit()
        session.refresh(product)
        return product
    
# Update a product
@router.patch("/{product_id}")
def update_product(product_id: int, product_update:Product):
    # Open a connection
    with Session(engine) as session:
        db_product = session.get(Product, product_id)
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        update_data = product_update.model_dump(exclude_unset=True)        
        db_product.sqlmodel_update(update_data)
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        return db_product
    
# Delete a product
@router.delete("/{product_id}")
def delete_product(product_id:int):
    with Session(engine) as session:
        product_delete = session.get(Product, product_id)
        if not product_delete:
            raise HTTPException(status_code=404, detail="Product not found")
        session.delete(product_delete)
        session.commit()
        return {"message" : f"Product {product_id} deleted successfully"}

# Read products
@router.get("/")
def read_products():
    with Session(engine) as session:
        statement = select(Product)
        products = session.exec(statement).all()
        return products
    
# Read a product
@router.get("/{product_id}")
def read_a_product(product_id: int):
    with Session(engine) as session:
        product = session.get(Product, product_id)

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product