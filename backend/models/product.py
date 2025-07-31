from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    originalPrice: float
    category: str
    images: List[str] = []
    sizes: List[str] = []
    colors: List[str] = []
    deliveryTime: str = "7-10 days"
    freeDelivery: bool = True
    inventory: int = 100

class Product(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: str
    price: float
    originalPrice: float
    category: str
    images: List[str] = []
    seller: PyObjectId
    rating: float = 0.0
    reviews: int = 0
    inventory: int = 100
    sizes: List[str] = []
    colors: List[str] = []
    deliveryTime: str = "7-10 days"
    freeDelivery: bool = True
    isActive: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ProductResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    originalPrice: float
    category: str
    images: List[str]
    seller: str
    rating: float
    reviews: int
    inventory: int
    sizes: List[str]
    colors: List[str]
    deliveryTime: str
    freeDelivery: bool
    discount: int = 0
    
    def __init__(self, **data):
        super().__init__(**data)
        if self.originalPrice > self.price:
            self.discount = int(((self.originalPrice - self.price) / self.originalPrice) * 100)

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    originalPrice: Optional[float] = None
    category: Optional[str] = None
    images: Optional[List[str]] = None
    inventory: Optional[int] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    deliveryTime: Optional[str] = None
    freeDelivery: Optional[bool] = None

class Category(BaseModel):
    id: int
    name: str
    icon: str
    image: str