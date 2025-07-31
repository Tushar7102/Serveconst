from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId

class CartItem(BaseModel):
    productId: PyObjectId
    name: str
    price: float
    image: str
    quantity: int = 1
    selectedSize: Optional[str] = None
    selectedColor: Optional[str] = None

class CartItemAdd(BaseModel):
    productId: str
    quantity: int = 1
    selectedSize: Optional[str] = None
    selectedColor: Optional[str] = None

class Cart(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user: PyObjectId
    items: List[CartItem] = []
    totalAmount: float = 0.0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CartResponse(BaseModel):
    id: str
    items: List[CartItem]
    totalAmount: float
    totalItems: int = 0
    
    def __init__(self, **data):
        super().__init__(**data)
        self.totalItems = sum(item.quantity for item in self.items)
        self.totalAmount = sum(item.price * item.quantity for item in self.items)