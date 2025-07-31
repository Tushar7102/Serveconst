from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from models.product import Product, ProductCreate, ProductResponse, ProductUpdate, Category
from models.user import User
from routes.auth import get_current_user
from utils.database import products_collection, categories_collection, serialize_doc
from bson import ObjectId
import math

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/", response_model=dict)
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),  
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = Query("createdAt", regex="^(createdAt|price|rating|name)$"),
    sort_order: Optional[str] = Query("desc", regex="^(asc|desc)$"),
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None
):
    """Get products with pagination and filters"""
    
    # Build query filter
    query_filter = {"isActive": True}
    
    if category:
        query_filter["category"] = category
    
    if search:
        query_filter["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}}
        ]
    
    if min_price is not None:
        query_filter["price"] = {"$gte": min_price}
    
    if max_price is not None:
        if "price" in query_filter:
            query_filter["price"]["$lte"] = max_price
        else:
            query_filter["price"] = {"$lte": max_price}
    
    if min_rating is not None:
        query_filter["rating"] = {"$gte": min_rating}
    
    # Build sort criteria
    sort_direction = 1 if sort_order == "asc" else -1
    sort_criteria = [(sort_by, sort_direction)]
    
    # Calculate pagination
    skip = (page - 1) * limit
    
    # Get total count
    total_count = await products_collection.count_documents(query_filter)
    
    # Get products
    cursor = products_collection.find(query_filter).sort(sort_criteria).skip(skip).limit(limit)
    products = await cursor.to_list(length=limit)
    
    # Serialize products
    products_response = []
    for product in products:
        product_data = serialize_doc(product)
        product_response = ProductResponse(**product_data)
        products_response.append(product_response)
    
    # Calculate pagination info
    total_pages = math.ceil(total_count / limit)
    
    return {
        "products": products_response,
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_count": total_count,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    }

@router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all product categories"""
    categories = await categories_collection.find().to_list(1000)
    return [Category(**serialize_doc(cat)) for cat in categories]

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """Get single product by ID"""
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    
    product = await products_collection.find_one({"_id": ObjectId(product_id), "isActive": True})
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product_data = serialize_doc(product)
    return ProductResponse(**product_data)

@router.post("/", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new product (sellers only)"""
    if current_user["role"] not in ["seller", "admin"]:
        raise HTTPException(status_code=403, detail="Only sellers can create products")
    
    product = Product(
        **product_data.dict(),
        seller=ObjectId(current_user["id"])
    )
    
    result = await products_collection.insert_one(product.dict(by_alias=True))
    
    # Get created product
    created_product = await products_collection.find_one({"_id": result.inserted_id})
    product_data = serialize_doc(created_product)
    
    return ProductResponse(**product_data)

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update product (seller/admin only)"""
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    
    # Check if product exists and user owns it
    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if current_user["role"] != "admin" and str(product["seller"]) != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this product")
    
    # Update product
    update_data = {k: v for k, v in product_data.dict().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()
    
    await products_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_data}
    )
    
    # Get updated product
    updated_product = await products_collection.find_one({"_id": ObjectId(product_id)})
    product_data = serialize_doc(updated_product)
    
    return ProductResponse(**product_data)

@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete product (soft delete - set isActive to False)"""
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    
    # Check if product exists and user owns it
    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if current_user["role"] != "admin" and str(product["seller"]) != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this product")
    
    # Soft delete
    await products_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"isActive": False, "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Product deleted successfully"}