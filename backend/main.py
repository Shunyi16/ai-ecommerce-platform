from fastapi import FastAPI, HTTPException
from sqlmodel import SQLModel, Session, select
from database import engine
from models import (
    User,
    Product,
    Order,
    OrderItem,
) 

app = FastAPI()


# This makes sure the tables are created when the app boots up
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI! SQLModel is officially running."}

# Create an user account
@app.post("/users")
def create_user(user: User):
    # Open a connection
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

# Read an user account
@app.get("/users")
def read_users():
    with Session(engine) as session:
        statement = select(User)
        users = session.exec(statement).all()
        return users

# Create a product
@app.post("/products")
def create_product(product: Product):
    # Open a connection
    with Session(engine) as session:
        session.add(product)
        session.commit()
        session.refresh(product)
        return product
    
# Update a product
@app.patch("/products/{product_id}")
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
@app.delete("/products/{product_id}")
def delete_product(product_id:int):
    with Session(engine) as session:
        product_delete = session.get(Product, product_id)
        if not product_delete:
            raise HTTPException(status_code=404, detail="Product not found")
        session.delete(product_delete)
        session.commit()
        return {"message" : f"Product {product_id} deleted successfully"}

# Read products
@app.get("/products")
def read_products():
    with Session(engine) as session:
        statement = select(Product)
        products = session.exec(statement).all()
        return products
    
# Read a product
@app.get("/products/{product_id}")
def read_a_product(product_id: int):
    with Session(engine) as session:
        product = session.get(Product, product_id)

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

# Create an order
@app.post("/orders")
def create_order(order: Order):
    # Open a connection
    with Session(engine) as session:
        session.add(order)
        session.commit()
        session.refresh(order)
        return order

# Read orders
@app.get("/orders")
def read_orders():
    with Session(engine) as session:
        statement = select(Order)
        orders = session.exec(statement).all()
        return orders

@app.get("/orders/{order_id}")
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

# Create items of the order
@app.post("/items")
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
@app.delete("/items/{item_id}")
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
@app.get("/items")
def read_items():
    with Session(engine) as session:
        statement = select(OrderItem)
        items = session.exec(statement).all()
        return items
