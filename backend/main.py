from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db_and_tables
from routers import users, products, orders

app = FastAPI(
    title="AI Keyboard E-Commerce API",
    description="The complete backend for managing products, carts, and users.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This allows requests from ANY origin. (You can lock this down later)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allows all headers
)


# This makes sure the tables are created when the app boots up
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Plug in the Routers
app.include_router(users.router)
app.include_router(products.router)
app.include_router(orders.router)
#app.include_router(items.router)

@app.get("/")
def root():
    return {"message": "Hello from FastAPI! SQLModel is officially running."}







