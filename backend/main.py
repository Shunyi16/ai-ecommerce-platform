from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db_and_tables, engine
from routers import users, products, orders
from sqlmodel import Session, select
from models import User, Product
import time

app = FastAPI(
    title="AI Keyboard E-Commerce API",
    description="The complete backend for managing products, carts, and users.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    print("Initializing Database...")
    # First, make sure all tables exist
    create_db_and_tables()
    
    # Small delay to ensure DB handles are ready
    time.sleep(1)

    try:
        with Session(engine) as session:
            # 1. Check for User 1
            user = session.get(User, 1)
            if not user:
                print("Seeding default user...")
                session.add(User(id=1, email="guest@example.com", full_name="Guest User", hashed_password="hashed"))
                session.commit()

            # 2. Check for Products
            exists = session.exec(select(Product)).first()
            if not exists:
                print("Seeding default lamps...")
                lamps = [
                    Product(name="Modern Floor Lamp", price=129.99, inventory_count=10, description="Sleek and minimalist.", image_url="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600"),
                    Product(name="Vintage Desk Lamp", price=45.00, inventory_count=5, description="Antique brass finish.", image_url="https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=600"),
                    Product(name="Industrial Ceiling Light", price=89.00, inventory_count=12, description="Rustic metal design.", image_url="https://images.unsplash.com/photo-1513506496266-3d241995a04a?q=80&w=600")
                ]
                for lamp in lamps:
                    session.add(lamp)
                session.commit()
                print("Lamps seeded successfully.")
    except Exception as e:
        print(f"Warning: Database seeding skipped or failed: {e}")
        # We don't crash here so the server can still start
        pass

# Plug in the Routers
app.include_router(users.router)
app.include_router(products.router)
app.include_router(orders.router)

@app.get("/")
def root():
    return {"message": "Hello from FastAPI! SQLModel is officially running."}
