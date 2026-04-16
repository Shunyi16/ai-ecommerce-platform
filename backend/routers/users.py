from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import User, UserCreate, UserUpdate, UserRead
import uuid

router = APIRouter(
    prefix = "/users",
    tags = ["Users"]
)

# Create an user account
@router.post("/", response_model=UserRead)
def create_user(user: UserCreate):
    # Open a connection
    with Session(engine) as session:
        statement = select(User).where(User.email == user.email)
        existing_user = session.exec(statement).first()
        if existing_user:
            raise HTTPException(status_code=409, detail="User with this email already exists")
        
        user_data = user.model_dump() # convert the UserCreate object into a dictionary
        password = user_data.pop("password") # remove password from the dictionary  
        # In a real app, hash the password here
        db_user = User(**user_data, hashed_password=password) # create a new User object, **user_data means unpack the dictionary
        
        session.add(db_user) # tell database to get ready to insert a new row in users table
        session.commit() # commit the transaction
        session.refresh(db_user) # refresh the user object to get the id
        return db_user

@router.patch("/{user_id}", response_model=UserRead)
def update_user(user_id: int, user_update: UserUpdate):
    with Session(engine) as session:
        db_user = session.get(User, user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
            
        # convert the UserUpdate object into a dictionary, exclude_unset=True means don't update the fields that are not set
        update_data = user_update.model_dump(exclude_unset=True) 
        if "password" in update_data:
            update_data["hashed_password"] = update_data.pop("password") # remove password from the dictionary and add hashed_password
            
        db_user.sqlmodel_update(update_data) # update the user object

        session.add(db_user) # tell database to get ready to update the user object
        session.commit() # commit the transaction
        session.refresh(db_user) # refresh the user object to get the id
        return db_user

# Read an user account
@router.get("/{user_id}", response_model=UserRead)
def read_users(user_id:int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not existed")
        return user

# Create a guest user
@router.post("/guest")
def create_guest():
    with Session(engine) as session:
        guest = User(
            email=f"guest_{uuid.uuid4().hex[:6]}@store.com",
            full_name="Guest User",
            hashed_password="anonymous_guest"
        )
        session.add(guest)
        session.commit()
        session.refresh(guest)
        return {"user_id": guest.id}