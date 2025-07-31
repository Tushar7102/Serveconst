# Meesho Clone - Development Contracts

## Frontend Implementation Status ✅
**Status**: COMPLETED with Mock Data

### Core Features Implemented:
1. **Homepage** - Hero banners, category grid, deals sections, product listings
2. **Product Listing** - Advanced filtering, sorting, search functionality
3. **Product Details** - Image gallery, size/color selection, reviews, detailed info
4. **Authentication** - Sign in/up modals with social login options
5. **Header Navigation** - Search, cart, notifications, user profile
6. **Responsive Design** - Mobile and desktop optimized

## Mock Data Currently Used:
- **Categories**: 8 main categories (Women Ethnic, Men, Kids, etc.)
- **Products**: 6 featured products with complete details
- **User Data**: Mock user profile and authentication
- **Cart Items**: Sample cart with 2 products
- **Orders**: Mock order history
- **Banners**: 3 promotional banners

## Backend API Contracts (To Be Implemented)

### 1. Authentication APIs
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me
```

### 2. Product APIs
```
GET /api/products - Get all products with filters
GET /api/products/:id - Get single product
GET /api/categories - Get all categories
GET /api/products/search?q=query - Search products
```

### 3. Cart APIs
```
GET /api/cart - Get user cart
POST /api/cart/add - Add item to cart
PUT /api/cart/:id - Update cart item
DELETE /api/cart/:id - Remove from cart
```

### 4. Order APIs
```
POST /api/orders - Create new order
GET /api/orders - Get user orders
GET /api/orders/:id - Get order details
```

### 5. User APIs
```
GET /api/users/profile - Get user profile
PUT /api/users/profile - Update profile
GET /api/users/addresses - Get user addresses
POST /api/users/addresses - Add new address
```

### 6. Seller APIs
```
GET /api/seller/dashboard - Get seller stats
GET /api/seller/products - Get seller products
POST /api/seller/products - Add new product
PUT /api/seller/products/:id - Update product
DELETE /api/seller/products/:id - Delete product
GET /api/seller/orders - Get seller orders
```

## Database Models Needed:

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  password: String (hashed),
  role: String (buyer/seller/admin),
  addresses: [AddressSchema],
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  images: [String],
  seller: ObjectId,
  rating: Number,
  reviews: Number,
  inventory: Number,
  sizes: [String],
  colors: [String],
  deliveryTime: String,
  freeDelivery: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  items: [OrderItemSchema],
  totalAmount: Number,
  status: String,
  deliveryAddress: AddressSchema,
  paymentMethod: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  items: [CartItemSchema],
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend-Backend Integration Plan:

1. **Replace Mock Data**: Remove mockData.js and connect to real APIs
2. **Add API Service Layer**: Create apiService.js for all backend calls  
3. **Add Loading States**: Implement proper loading indicators
4. **Error Handling**: Add comprehensive error handling and user feedback
5. **Authentication Flow**: Implement JWT token management
6. **Real-time Updates**: Add cart count updates, order status tracking

## Additional Features to Implement:
1. **Seller Dashboard** - Product management, order tracking, analytics
2. **Admin Panel** - User management, product approval, analytics
3. **Search Functionality** - Advanced search with filters
4. **Wishlist** - Save products for later
5. **Reviews & Ratings** - User can rate and review products
6. **Payment Integration** - Razorpay/Stripe integration
7. **Order Tracking** - Real-time order status updates
8. **Notifications** - Email/SMS notifications for order updates

## Current Frontend Structure:
```
src/
├── components/
│   ├── ui/ (shadcn components)
│   ├── Header.jsx
│   ├── CategoryGrid.jsx
│   ├── ProductCard.jsx
│   ├── Banner.jsx
│   └── AuthModal.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── ProductListingPage.jsx
│   └── ProductDetailPage.jsx
├── data/
│   └── mockData.js (to be replaced)
└── hooks/
    └── use-toast.js
```

## Technology Stack:
- **Frontend**: React.js + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI (Python) 
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **File Storage**: Local storage (can be upgraded to AWS S3)
- **Payment**: To be integrated (Razorpay recommended for India)