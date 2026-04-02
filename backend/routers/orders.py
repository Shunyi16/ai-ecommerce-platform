from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import Order, OrderItem, Product, OrderRead, OrderCreate, OrderItemCreate

router = APIRouter(
    prefix = "/orders",
    tags = ["Orders & Items"]
)


# --- ITEM MANAGEMENT (Sub-resources of Orders) ---

# add_item_to_order
@router.post("/items", response_model=OrderItem)
def add_item_to_order(item: OrderItemCreate):
    # Open a connection
    with Session(engine) as session:
        product = session.get(Product,item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if product.inventory_count < item.quantity:
            raise HTTPException(status_code=400, detail="Product low in stock")
        # Update Inventory
        product.inventory_count -= item.quantity

        db_item = OrderItem.model_validate(item)
        session.add(db_item)
        session.add(product)
        session.commit()
        session.refresh(db_item)
        return db_item

# Remove item from cart
@router.delete("/items/{item_id}")
def remove_item(item_id:int):
    with Session(engine) as session:
        item = session.get(OrderItem,item_id)
        if not item:
            raise HTTPException(status_code=404, detail= "Item not found in cart")
        
        # Restore Inventory
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

# -------------------------- ORDER MANAGEMENT -----------------------------
# Create an order
@router.post("/",response_model=OrderRead)
def create_order(order: OrderCreate):
    # Open a connection
    with Session(engine) as session:
        db_order = Order.model_validate(order) # Convert DTO to DB Model
        session.add(db_order)
        session.commit()
        session.refresh(db_order)
        return db_order

# Read single order    
@router.get("/{order_id}", response_model=OrderRead)
def read_single_order(order_id: int):
    with Session(engine) as session:
        order = session.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Note: If your OrderRead schema includes an 'items' list, 
        # SQLModel relationships will automatically fill it for you!
        return order

# Read all orders
@router.get("/", response_model=list[OrderRead])
def read_all_orders():
    with Session(engine) as session:
        statement = select(Order)
        orders = session.exec(statement).all()
        return orders


#Read total price of an order
@router.get("/{order_id}/total")
def read_order_total_price(order_id:int):
    with Session(engine) as session:
        order = session.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Use the relationship directly
        total_price = sum(item.price_at_purchase * item.quantity for item in order.items)

        return {
            "order_id": order_id,
            "total_price": total_price,
            "item_count": len(order.items)
        }