#create_engine: plugs Python into PostgreSQL
from sqlmodel import SQLModel, create_engine

# 2. This tells Python exactly where the database lives
# Format: postgresql://[user]:[password]@[host]/[database_name]
DATABASE_URL = "postgresql://shunyiliu@localhost/postgres"

# 3. Turn on the Engine
# "echo=True" : prints every single SQL command to your terminal so you can see what it's doing behind the scenes!
engine = create_engine(DATABASE_URL, echo=True)

# 4. The "Construction Worker" Function
# Wrap this in a function so that main.py can trigger it exactly when the server starts up.
def create_db_and_tables():
    # 5. Build the Tables
    # This command looks at all the Models you created (Product, Order, etc.) 
    # and tells PostgreSQL: "If these tables don't exist yet, build them right now!"
    SQLModel.metadata.create_all(engine)