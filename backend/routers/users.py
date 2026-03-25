from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import User

router = APIRouter(
    prefix = "/users",
    tags = ["Users"]
)

# Create an user account
@router.post("/")
def create_user(user: User):
    # Open a connection
    with Session(engine) as session:
        statement = select(User).where(User.email == user.email)
        existing_user = session.exec(statement).first()
        if existing_user:
            raise HTTPException(status_code=409, detail="User with this email already exists")
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

# Read an user account
@router.get("/{user_id}")
def read_users(user_id:int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not existed")
        return user