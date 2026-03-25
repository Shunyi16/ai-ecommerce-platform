from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import Order, OrderItem

router = APIRouter(
    prefix = "/orders",
    tags = ["Orders"]
)

# Create an order
@router.post("/")
def create_order(order: Order):
    # Open a connection
    with Session(engine) as session:
        session.add(order)
        session.commit()
        session.refresh(order)
        return order

# Read orders
@router.get("/")
def read_orders():
    with Session(engine) as session:
        statement = select(Order)
        orders = session.exec(statement).all()
        return orders

@router.get("/{order_id}")
def read_order_total_price(order_id:int):
    with Session(engine) as session:
        order = session.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        statement = select(OrderItem).where(OrderItem.order_id == order_id)
        items = session.exec(statement).all()
        total_price = 0
        for item in items:
            total_price += item.price_at_purchase * item.quantity

        return {
            "order_details": order,
            "items": items,
            "total_price": total_price
        }