from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import Order, OrderItem, Product, OrderRead, OrderCreate, OrderItemCreate, OrderItemRead
from sqlalchemy.orm import selectinload
import random
import string

router = APIRouter(
    prefix = "/orders",
    tags = ["Orders & Items"]
)

def generate_order_number():
    """Generates a professional order number like AG-83921"""
    digits = ''.join(random.choices(string.digits, k=5))
    return f"AG-{digits}"

def generate_tracking_number():
    """Generates a mock tracking number like TRK-XYZ123"""
    chars = ''.join(random.choices(string.ascii_uppercase, k=3))
    digits = ''.join(random.choices(string.digits, k=6))
    return f"TRK-{chars}{digits}"

# customer add an item to the cart
@router.post("/items", response_model=OrderItem)
def add_item_to_cart(item_data: OrderItemCreate):
    # Open a connection
    with Session(engine) as session:
        # 1. Check Product & Inventory
        product = session.get(Product,item_data.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if product.inventory_count < item_data.quantity:
            raise HTTPException(status_code=400, detail="Product low in stock")
        
        # find an existing or create the order id
        statement = select(Order).where(
            Order.user_id == item_data.user_id,
            Order.status == "cart" # Look for the unpaid draft order
        )
        exist_order = session.exec(statement).first()
        # not no existing order id, create a new row w/ id, user_id, and status in Order table) 
        if not exist_order:
            exist_order = Order(user_id = item_data.user_id, status = "cart")
            session.add(exist_order)
            session.commit()
            session.refresh(exist_order)

        # 3. Check if the item already exists in this specific cart
        statement_item = select(OrderItem).where(
            OrderItem.order_id == exist_order.id,
            OrderItem.product_id == item_data.product_id
        )
        existing_item = session.exec(statement_item).first()

        if existing_item:
            # If it exists, just update the quantity
            existing_item.quantity += item_data.quantity
            session.add(existing_item)
            db_item = existing_item
        else:
            # Otherwise, create a brand new row
            db_item = OrderItem(
                order_id = exist_order.id,
                product_id = item_data.product_id,
                quantity = item_data.quantity,
                price_at_purchase = item_data.price_at_purchase
            )
            session.add(db_item)

        # 4. Update Inventory
        product.inventory_count -= item_data.quantity
        session.add(product)

        session.commit()
        session.refresh(db_item)
        return db_item
    
    
# customer reviews the cart
@router.get("/cart/{user_id}", response_model= list[OrderItemRead])
def view_cart(user_id : int):
    with Session(engine) as session:
        statement = select(Order).where(
            Order.user_id == user_id,
            Order.status == "cart"
        ).options(
            selectinload(Order.items).selectinload(OrderItem.product)
        )
        cart_order = session.exec(statement).first()
        if not cart_order:
            return []
        return cart_order.items
    

# customer remove an item from cart
@router.delete("/items/{item_id}")
def remove_item(item_id:int):
    with Session(engine) as session:
        item = session.get(OrderItem,item_id)
        if not item:
            raise HTTPException(status_code=404, detail= "Item not found in cart")

        # 2. Security Check: Is this item part of an active cart? 
        if item.order.status != "cart":
            raise HTTPException(status_code=400, detail="Cannot remove items from a finalized order")

        # Restore Inventory
        product = session.get(Product,item.product_id)
        if product:
            product.inventory_count += item.quantity
            session.add(product)
        
        session.delete(item)
        session.commit()
        return {"message": "Item successfully removed from cart"}
    

# Customer place an order ----------
@router.post("/checkout",response_model=OrderRead)
def create_order(order: OrderCreate):
    # Open a connection
    with Session(engine) as session:
        # 1. find the items that are in cart
        statement = select(Order).where(
            Order.user_id == order.user_id,
            Order.status == "cart"
        ).options(
            selectinload(Order.items).selectinload(OrderItem.product)
        )
        # .first() return a single order object
        db_order = session.exec(statement).first() 

        if not db_order:
            raise HTTPException(status_code=400, detail="No active cart found for this user")
        
        # 2. Update Order Details (Shipping Info)
        db_order.full_name = order.full_name
        db_order.email = order.email
        db_order.address = order.address
        db_order.city = order.city
        db_order.state = order.state
        db_order.zip_code = order.zip_code

        # 3. Update Status and Info
        db_order.status = "pending"
        db_order.order_number = generate_order_number()
        # tracking_number and carrier stay null until fulfillment

        session.add(db_order)
        session.commit()
        session.refresh(db_order)
        return db_order
    

# Customer review an order  
@router.get("/{order_id}", response_model=OrderRead)
def read_single_order(order_id: int):
    with Session(engine) as session:
        statement = select(Order).where(
            Order.id == order_id,
            Order.status != "cart"
        ).options(
            selectinload(Order.items).selectinload(OrderItem.product)
        )
        # Use .first() to get the single object which is what response_model expects
        order = session.exec(statement).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return order

# Customer view order history
@router.get("/history/{user_id}", response_model=list[OrderRead])
def read_order_history(user_id: int):
    with Session(engine) as session:
        statement = select(Order).where(
            Order.user_id == user_id,
            Order.status != "cart" # <-- Exclude the active shopping cart
            ).order_by(Order.created_at.desc()).options(
                selectinload(Order.items).selectinload(OrderItem.product)
            ) # <-- Sort newest to oldest
        orders = session.exec(statement).all() # <--  returns a list of orders
        return orders
    

# #Read total price of an order
# @router.get("/{order_id}/total")
# def read_order_total_price(order_id:int):
#     with Session(engine) as session:
#         order = session.get(Order, order_id)
#         if not order:
#             raise HTTPException(status_code=404, detail="Order not found")
        
#         # Use the relationship directly
#         total_price = sum(item.price_at_purchase * item.quantity for item in order.items)

#         return {
#             "order_id": order_id,
#             "total_price": total_price,
#             "item_count": len(order.items)
#         }
