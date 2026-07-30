from datetime import datetime, timedelta, timezone
from typing import Optional
from passlib.context import CryptContext
import jwt

# Secret key to sign the JWT token
# IMPORTANT: In a real app, DO NOT hardcode this! Load it from a .env file.
SECRET_KEY = "your-super-secret-key-that-should-be-in-an-environment-variable"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # Token stays valid for 7 days

# Password hashing configuration (bcrypt is the standard secure algorithm)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies that a plain text password matches the hashed version from the DB."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hashes a plain text password so it's safe to store in the DB."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Creates a JWT (JSON Web Token) that the user uses to prove who they are."""
    to_encode = data.copy()
    
    # Calculate when the token should expire
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
        
    # Add the expiration time to the token's data
    to_encode.update({"exp": expire})
    
    # Generate and sign the token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
