from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import User, UserCreate, UserUpdate, UserRead

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
        db_user = User.model_validate(user)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return db_user

@router.patch("/{user_id}", response_model=UserRead)
def update_user(user_id: int, user_update = UserUpdate):
    with Session(engine) as session:
        db_user = session.get(User, user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
    update_data = user_update.model_dump(exclude_unset=True)
    db_user.sqlmodel_update(update_data)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

# Read an user account
@router.get("/{user_id}", response_model=UserRead)
def read_users(user_id:int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not existed")
        return user