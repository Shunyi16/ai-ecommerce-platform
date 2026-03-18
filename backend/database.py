from sqlmodel import create_engine

# The connection string to your local PostgreSQL database
SQLALCHEMY_DATABASE_URL = "postgresql://shunyiliu@localhost/postgres"

# Create the engine that manages the connection. 
# echo=True prints the generated SQL to your terminal, which is great for debugging!
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)