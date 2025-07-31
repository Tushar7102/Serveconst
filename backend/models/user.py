from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class Address(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    type: str  # Home, Work, etc.
    address: str
    city: str = ""
    state: str = ""
    pincode: str = ""
    isDefault: bool = False

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: EmailStr
    phone: str
    password: str  # Will be hashed
    role: str = "buyer"  # buyer, seller, admin
    addresses: List[Address] = []
    isActive: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    role: str
    addresses: List[Address] = []
    
class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    addresses: Optional[List[Address]] = None