from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import OrderItem, Product

router = APIRouter(
    prefix = "/items",
    tags = ["Items"]
)

# Create items of the order
@router.post("/")
def create_item(item: OrderItem):
    # Open a connection
    with Session(engine) as session:
        product = session.get(Product,item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if product.inventory_count < item.quantity:
            raise HTTPException(status_code=404, detail="Product low in stock")
        product.inventory_count -= item.quantity
        session.add(item)
        session.add(product)
        session.commit()
        session.refresh(item)
        return item
    
# Remove item from cart
@router.delete("/{item_id}")
def remove_item_from_cart(item_id:int):
    with Session(engine) as session:
        item = session.get(OrderItem,item_id)
        if not item:
            raise HTTPException(status_code=404, detail= "Item not found in cart")
        
        product = session.get(Product,item.product_id)
        if product:
            product.inventory_count += item.quantity
            session.add(product)
        
        session.delete(item)
        session.commit()
        return {"message" : "Item removed and inventory restored"}

# Read items from an order
@router.get("/")
def read_items():
    with Session(engine) as session:
        statement = select(OrderItem)
        items = session.exec(statement).all()
        return items
