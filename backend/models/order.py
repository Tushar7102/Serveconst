from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from .user import PyObjectId, Address
from .cart import CartItem

class OrderItem(BaseModel):
    productId: PyObjectId
    name: str
    price: float
    image: str
    quantity: int
    selectedSize: Optional[str] = None
    selectedColor: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[OrderItem]
    deliveryAddress: Address
    paymentMethod: str = "COD"

class Order(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    orderId: str = Field(default_factory=lambda: f"MO{str(ObjectId())[-9:]}")
    user: PyObjectId
    items: List[OrderItem]
    totalAmount: float
    status: str = "Confirmed"  # Confirmed, Shipped, In Transit, Delivered, Cancelled
    deliveryAddress: Address
    paymentMethod: str = "COD"
    trackingId: Optional[str] = None
    estimatedDelivery: Optional[datetime] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class OrderResponse(BaseModel):
    id: str
    orderId: str
    items: List[OrderItem]
    totalAmount: float
    status: str
    deliveryAddress: Address
    paymentMethod: str
    date: str
    estimatedDelivery: Optional[str] = None
    
    def __init__(self, **data):
        super().__init__(**data)
        if isinstance(data.get('createdAt'), datetime):
            self.date = data['createdAt'].strftime("%Y-%m-%d")
        if data.get('estimatedDelivery') and isinstance(data['estimatedDelivery'], datetime):
            self.estimatedDelivery = data['estimatedDelivery'].strftime("%Y-%m-%d")