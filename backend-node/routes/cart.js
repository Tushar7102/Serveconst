const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      data: {
        id: cart._id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', [
  auth,
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('selectedSize').optional().trim(),
  body('selectedColor').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, quantity, selectedSize, selectedColor } = req.body;

    // Check if product exists
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check inventory
    if (product.inventory < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient inventory'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.inventory < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient inventory for requested quantity'
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      const cartItem = {
        product: productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
        selectedSize,
        selectedColor
      };
      cart.items.push(cartItem);
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        id: cart._id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to cart'
    });
  }
});

// @route   PUT /api/cart/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/:itemId', [
  auth,
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Check product inventory
    const product = await Product.findById(cart.items[itemIndex].product);
    if (product.inventory < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient inventory'
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: {
        id: cart._id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
});

// @route   DELETE /api/cart/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        id: cart._id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart'
    });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        id: cart._id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
});

module.exports = router;