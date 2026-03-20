from fastapi import FastAPI
from sqlmodel import SQLModel, Session, select
from database import engine
from models import (
    User,
    Product,
    Order,
    OrderItem,
)  # Imports your tables so SQLModel knows they exist

app = FastAPI()


# This makes sure the tables are created when the app boots up
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI! SQLModel is officially running."}


@app.post("/users")
def create_user(user: User):
    # Open a connection
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user


@app.get("/users")
def read_users():
    with Session(engine) as session:
        statement = select(User)
        users = session.exec(statement).all()
        return users


@app.post("/products")
def create_product(product: Product):
    # Open a connection
    with Session(engine) as session:
        session.add(product)
        session.commit()
        session.refresh(product)
        return product


@app.get("/products")
def read_products():
    with Session(engine) as session:
        statement = select(Product)
        products = session.exec(statement).all()
        return products


@app.post("/orders")
def create_order(order: Order):
    # Open a connection
    with Session(engine) as session:
        session.add(order)
        session.commit()
        session.refresh(order)
        return order


@app.get("/orders")
def read_orders():
    with Session(engine) as session:
        statement = select(Order)
        orders = session.exec(statement).all()
        return orders


@app.post("/items")
def create_items(items: OrderItem):
    # Open a connection
    with Session(engine) as session:
        session.add(items)
        session.commit()
        session.refresh(items)
        return items


@app.get("/items")
def read_items():
    with Session(engine) as session:
        statement = select(OrderItem)
        items = session.exec(statement).all()
        return items
