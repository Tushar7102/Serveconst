// Mock data for Meesho clone
export const categories = [
  { id: 1, name: "Women Ethnic", icon: "👗", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop" },
  { id: 2, name: "Women Western", icon: "👚", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=200&fit=crop" },
  { id: 3, name: "Men", icon: "👔", image: "https://images.unsplash.com/photo-1516826957135-700dedea9750?w=300&h=200&fit=crop" },
  { id: 4, name: "Bags & Footwear", icon: "👜", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop" },
  { id: 5, name: "Kids", icon: "👶", image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=300&h=200&fit=crop" },
  { id: 6, name: "Home & Kitchen", icon: "🏠", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop" },
  { id: 7, name: "Beauty & Health", icon: "💄", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=200&fit=crop" },
  { id: 8, name: "Electronics", icon: "📱", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=200&fit=crop" }
];

export const featuredProducts = [
  {
    id: 1,
    name: "Beautiful Cotton Kurti Set",
    price: 299,
    originalPrice: 999,
    discount: 70,
    rating: 4.2,
    reviews: 1245,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    category: "Women Ethnic",
    seller: "Fashion Hub",
    deliveryTime: "7-10 days",
    freeDelivery: true
  },
  {
    id: 2,
    name: "Stylish Men's Casual Shirt",
    price: 399,
    originalPrice: 1299,
    discount: 69,
    rating: 4.0,
    reviews: 867,
    image: "https://images.unsplash.com/photo-1516826957135-700dedea9750?w=400&h=400&fit=crop",
    category: "Men",
    seller: "Trendy Styles",
    deliveryTime: "5-7 days",
    freeDelivery: true
  },
  {
    id: 3,
    name: "Elegant Women's Handbag",
    price: 599,
    originalPrice: 1999,
    discount: 70,
    rating: 4.5,
    reviews: 2134,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Bags & Footwear",
    seller: "Accessory World",
    deliveryTime: "3-5 days",
    freeDelivery: true
  },
  {
    id: 4,
    name: "Kids Summer Dress",
    price: 249,
    originalPrice: 799,
    discount: 69,
    rating: 4.3,
    reviews: 456,
    image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&h=400&fit=crop",
    category: "Kids",
    seller: "Little Stars",
    deliveryTime: "4-6 days",
    freeDelivery: true
  },
  {
    id: 5,
    name: "Wireless Bluetooth Headphones",
    price: 799,
    originalPrice: 2999,
    discount: 73,
    rating: 4.1,
    reviews: 3456,
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop",
    category: "Electronics",
    seller: "Tech Store",
    deliveryTime: "2-4 days",
    freeDelivery: true
  },
  {
    id: 6,
    name: "Premium Kitchen Set",
    price: 1299,
    originalPrice: 3999,
    discount: 68,
    rating: 4.4,
    reviews: 789,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    category: "Home & Kitchen",
    seller: "Home Essentials",
    deliveryTime: "5-8 days",
    freeDelivery: true
  }
];

export const banners = [
  {
    id: 1,
    title: "Mega Fashion Sale",
    subtitle: "Up to 80% Off",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop",
    cta: "Shop Now"
  },
  {
    id: 2,
    title: "Electronics Bonanza",
    subtitle: "Best Deals on Gadgets",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=300&fit=crop",
    cta: "Explore"
  },
  {
    id: 3,
    title: "Home Decor Special",
    subtitle: "Transform Your Space",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=300&fit=crop",
    cta: "Discover"
  }
];

export const deals = [
  {
    id: 1,
    title: "Deal of the Day",
    products: featuredProducts.slice(0, 4),
    timeLeft: "23:45:12"
  },
  {
    id: 2,
    title: "Trending Products",
    products: featuredProducts.slice(2, 6)
  }
];

// Mock user data
export const mockUser = {
  id: 1,
  name: "Priya Sharma",
  email: "priya@example.com",
  phone: "+91 9876543210",
  addresses: [
    {
      id: 1,
      type: "Home",
      address: "123 MG Road, Bangalore, Karnataka 560001",
      isDefault: true
    },
    {
      id: 2,
      type: "Work",
      address: "456 Brigade Road, Bangalore, Karnataka 560025",
      isDefault: false
    }
  ]
};

// Mock cart data
export const mockCart = [
  { ...featuredProducts[0], quantity: 2, selectedSize: "M", selectedColor: "Blue" },
  { ...featuredProducts[1], quantity: 1, selectedSize: "L", selectedColor: "White" }
];

// Mock orders
export const mockOrders = [
  {
    id: "MO123456789",
    date: "2025-01-25",
    status: "Delivered",
    total: 1298,
    items: [featuredProducts[0], featuredProducts[2]],
    deliveryAddress: mockUser.addresses[0]
  },
  {
    id: "MO123456790",
    date: "2025-01-28",
    status: "In Transit",
    total: 799,
    items: [featuredProducts[4]],
    deliveryAddress: mockUser.addresses[0]
  }
];

// Seller mock data
export const mockSellerData = {
  id: 1,
  name: "Fashion Hub Store",
  rating: 4.3,
  totalProducts: 245,
  totalOrders: 1567,
  revenue: 89543,
  products: featuredProducts
};