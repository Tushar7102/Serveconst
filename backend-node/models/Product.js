const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'Women Ethnic',
      'Women Western', 
      'Men',
      'Bags & Footwear',
      'Kids',
      'Home & Kitchen',
      'Beauty & Health',
      'Electronics'
    ]
  },
  images: [{
    type: String,
    required: true
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Reviews count cannot be negative']
  },
  inventory: {
    type: Number,
    required: [true, 'Inventory count is required'],
    min: [0, 'Inventory cannot be negative'],
    default: 100
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']
  }],
  colors: [{
    type: String
  }],
  deliveryTime: {
    type: String,
    default: '7-10 days'
  },
  freeDelivery: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Virtual for discount percentage
ProductSchema.virtual('discount').get(function() {
  if (this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
ProductSchema.set('toJSON', { virtuals: true });

// Index for search functionality
ProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text',
  tags: 'text'
});

// Index for filtering
ProductSchema.index({ category: 1, price: 1, rating: 1 });
ProductSchema.index({ seller: 1 });

module.exports = mongoose.model('Product', ProductSchema);