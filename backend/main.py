from fastapi import FastAPI
from sqlmodel import SQLModel, Session
from database import engine
from models import User # Imports your tables so SQLModel knows they exist

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
    #Open a connection
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user