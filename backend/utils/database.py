from motor.motor_asyncio import AsyncIOMotorClient
import os
from typing import Optional

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'meesho_clone')]

# Collections
users_collection = db.users
products_collection = db.products
categories_collection = db.categories
cart_collection = db.cart
orders_collection = db.orders

async def get_database():
    """Get database instance"""
    return db

async def close_database():
    """Close database connection"""
    client.close()

# Helper function to convert ObjectId to string in database results
def serialize_doc(doc) -> dict:
    """Convert MongoDB document to serializable format"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        doc['id'] = str(doc['_id'])
        if '_id' in doc:
            del doc['_id']
        return doc
    return doc