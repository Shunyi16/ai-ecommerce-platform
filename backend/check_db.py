from sqlmodel import Session, select
from database import engine
from models import User, Product

def check_db():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        products = session.exec(select(Product)).all()
        print(f"Users: {len(users)}")
        for u in users:
            print(f"  ID: {u.id}, Email: {u.email}")
        print(f"Products: {len(products)}")

if __name__ == "__main__":
    check_db()
