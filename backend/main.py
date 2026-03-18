from fastapi import FastAPI
from sqlmodel import SQLModel
from database import engine
import models  # Imports your tables so SQLModel knows they exist

# This line tells SQLModel to create the tables in PostgreSQL
SQLModel.metadata.create_all(engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI! SQLModel is officially running."}