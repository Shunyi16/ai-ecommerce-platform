from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db_and_tables, engine
from routers import users, products, orders, categories
from sqlmodel import Session, select
from models import User, Product, Category, ProductCategoryLink
import time

app = FastAPI(
    title="AI Keyboard E-Commerce API",
    description="The complete backend for managing products, carts, and users.",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup") #FastAPI decorator, it tells the application to run the decorated function (on_startup) exactly once, right as the server starts up but before it begins accepting web requests. 
def on_startup():
    print("Initializing Database...")
    # calls the function in database.py to create tables
    create_db_and_tables()
    
    # Small delay to ensure DB handles are ready
    time.sleep(1)

    try:
        with Session(engine) as session:
            # 1. Seed Default User
            if not session.get(User, 1):
                session.add(User(id=1, email="guest@example.com", full_name="Guest User", hashed_password="hashed"))
                session.commit()

            # 2. Seed Categories
            if not session.exec(select(Category)).first():
                categories = [
                    Category(name="Chandeliers & Pendants"),
                    Category(name="Flush Mounts"),
                    Category(name="Lamps"),
                    Category(name="Bathroom Lights"),
                    Category(name="Wall Lights"),
                    Category(name="Outdoor Lights"),
                    Category(name="Sale")
                ]
                for c in categories:
                    session.add(c)
                session.commit()

    except Exception as e:
        print(f"Warning: Database seeding skipped or failed: {e}")
        pass

# Plug in the Routers
app.include_router(users.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(categories.router)

@app.get("/")
def root():
    return {"message": "Hello from FastAPI! SQLModel is officially running."}
