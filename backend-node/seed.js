const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const categories = [
  { id: 1, name: "Women Ethnic", icon: "👗", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop" },
  { id: 2, name: "Women Western", icon: "👚", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=200&fit=crop" },
  { id: 3, name: "Men", icon: "👔", image: "https://images.unsplash.com/photo-1516826957135-700dedea9750?w=300&h=200&fit=crop" },
  { id: 4, name: "Bags & Footwear", icon: "👜", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop" },
  { id: 5, name: "Kids", icon: "👶", image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=300&h=200&fit=crop" },
  { id: 6, name: "Home & Kitchen", icon: "🏠", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop" },
  { id: 7, name: "Beauty & Health", icon: "💄", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=200&fit=crop" },
  { id: 8, name: "Electronics", icon: "📱", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=200&fit=crop" }
];

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/meesho_clone');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    
    // Seed categories
    console.log('📂 Seeding categories...');
    await Category.insertMany(categories);
    console.log('✅ Categories seeded successfully');

    // Create a seller user
    console.log('👤 Creating seller user...');
    const seller = new User({
      name: 'Meesho Store',
      email: 'seller@meesho.com',
      phone: '+919876543210',
      password: '123456',
      role: 'seller'
    });
    await seller.save();
    console.log('✅ Seller user created');

    // Create sample products
    console.log('🛍️ Seeding products...');
    const products = [
      {
        name: "Beautiful Cotton Kurti Set",
        description: "This beautiful cotton kurti set is perfect for any occasion. Made from high-quality materials with attention to detail, it offers both comfort and style.",
        price: 299,
        originalPrice: 999,
        category: "Women Ethnic",
        images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"],
        seller: seller._id,
        rating: 4.2,
        reviews: 1245,
        inventory: 50,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Blue", "Pink", "White", "Black"],
        deliveryTime: "7-10 days",
        freeDelivery: true,
        tags: ["kurti", "ethnic", "women", "cotton"]
      },
      {
        name: "Stylish Men's Casual Shirt",
        description: "Premium quality casual shirt perfect for everyday wear. Comfortable fabric with modern fit.",
        price: 399,
        originalPrice: 1299,
        category: "Men",
        images: ["https://images.unsplash.com/photo-1516826957135-700dedea9750?w=400&h=400&fit=crop"],
        seller: seller._id,
        rating: 4.0,
        reviews: 867,
        inventory: 30,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Blue", "White", "Black", "Grey"],
        deliveryTime: "5-7 days",
        freeDelivery: true,
        tags: ["shirt", "casual", "men", "cotton"]
      },
      {
        name: "Elegant Women's Handbag",
        description: "Stylish and spacious handbag perfect for daily use. Premium quality with multiple compartments.",
        price: 599,
        originalPrice: 1999,
        category: "Bags & Footwear",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"],
        seller: seller._id,
        rating: 4.5,
        reviews: 2134,
        inventory: 25,
        sizes: ["Free Size"],
        colors: ["Black", "Brown", "Red", "Blue"],
        deliveryTime: "3-5 days",
        freeDelivery: true,
        tags: ["handbag", "women", "accessories", "leather"]
      },
      {
        name: "Kids Summer Dress",
        description: "Cute and comfortable summer dress for kids. Soft fabric perfect for playtime.",
        price: 249,
        originalPrice: 799,
        category: "Kids",
        images: ["https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&h=400&fit=crop"],
        seller: seller._id,
        rating: 4.3,
        reviews: 456,
        inventory: 40,
        sizes: ["2-3 Years", "4-5 Years", "6-7 Years", "8-9 Years"],
        colors: ["Pink", "Yellow", "Blue", "White"],
        deliveryTime: "4-6 days",
        freeDelivery: true,
        tags: ["dress", "kids", "summer", "cotton"]
      },
      {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with excellent sound quality and long battery life.",
        price: 799,
        originalPrice: 2999,
        category: "Electronics",
        images: ["https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop"],
        seller: seller._id,
        rating: 4.1,
        reviews: 3456,
        inventory: 15,
        sizes: ["Free Size"],
        colors: ["Black", "White", "Blue", "Red"],
        deliveryTime: "2-4 days",
        freeDelivery: true,
        tags: ["headphones", "wireless", "bluetooth", "electronics"]
      },
      {
        name: "Premium Kitchen Set",
        description: "Complete kitchen utensil set with all essential items. Made from high-quality stainless steel.",
        price: 1299,
        originalPrice: 3999,
        category: "Home & Kitchen",
        images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop"],
        seller: seller._id,
        rating: 4.4,
        reviews: 789,
        inventory: 20,
        sizes: ["Free Size"],
        colors: ["Silver", "Black"],
        deliveryTime: "5-8 days",
        freeDelivery: true,
        tags: ["kitchen", "utensils", "steel", "cooking"]
      },
      {
        name: "Trendy Western Top",
        description: "Fashionable western top perfect for casual outings. Comfortable and stylish design.",
        price: 399,
        originalPrice: 1199,
        category: "Women Western",
        images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop"],
        seller: seller._id,
        rating: 4.0,
        reviews: 623,
        inventory: 35,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["White", "Black", "Pink", "Blue"],
        deliveryTime: "6-8 days",
        freeDelivery: true,
        tags: ["top", "western", "women", "casual"]
      },
      {
        name: "Natural Beauty Skincare Set",
        description: "Complete skincare routine set with natural ingredients. Perfect for all skin types.",
        price: 599,
        originalPrice: 1499,
        category: "Beauty & Health",
        images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop"],
        seller: seller._id,
        rating: 4.3,
        reviews: 891,
        inventory: 45,
        sizes: ["Free Size"],
        colors: ["Natural"],
        deliveryTime: "3-5 days",
        freeDelivery: true,
        tags: ["skincare", "beauty", "natural", "cosmetics"]
      }
    ];

    await Product.insertMany(products);
    console.log('✅ Products seeded successfully');

    console.log('🎉 Database seeded successfully!');
    console.log(`📊 Created ${categories.length} categories`);
    console.log(`📦 Created ${products.length} products`);
    console.log(`👤 Created 1 seller user`);
    console.log('📧 Seller credentials: seller@meesho.com / 123456');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seed function
seedDatabase();