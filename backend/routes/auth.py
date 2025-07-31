from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.user import User, UserCreate, UserLogin, UserResponse
from utils.auth import hash_password, verify_password, create_access_token, verify_token
from utils.database import users_collection, serialize_doc
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["authentication"])
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return serialize_doc(user)

@router.post("/register", response_model=dict)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await users_collection.find_one({
        "$or": [
            {"email": user_data.email},
            {"phone": user_data.phone}
        ]
    })
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or phone already exists"
        )
    
    # Hash password and create user
    hashed_password = hash_password(user_data.password)
    user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password=hashed_password
    )
    
    # Insert user into database
    result = await users_collection.insert_one(user.dict(by_alias=True))
    
    # Create access token
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    
    # Get user data for response
    user_doc = await users_collection.find_one({"_id": result.inserted_id})
    user_response = UserResponse(
        id=str(user_doc["_id"]),
        name=user_doc["name"],
        email=user_doc["email"],
        phone=user_doc["phone"],
        role=user_doc["role"],
        addresses=user_doc.get("addresses", [])
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@router.post("/login", response_model=dict)
async def login(user_data: UserLogin):
    """Login user"""
    # Find user by email or phone
    user = await users_collection.find_one({
        "$or": [
            {"email": user_data.email},
            {"phone": user_data.email}  # Allow phone number in email field
        ]
    })
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not verify_password(user_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user["_id"])})
    
    # Prepare user response
    user_response = UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        phone=user["phone"],
        role=user["role"],
        addresses=user.get("addresses", [])
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        phone=current_user["phone"],
        role=current_user["role"],
        addresses=current_user.get("addresses", [])
    )

@router.post("/logout")
async def logout():
    """Logout user (client-side token removal)"""
    return {"message": "Successfully logged out"}