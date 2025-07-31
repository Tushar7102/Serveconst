const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { user: req.user._id };
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.product', 'name images');

    const totalCount = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    const formattedOrders = orders.map(order => ({
      id: order._id,
      orderId: order.orderId,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      paymentMethod: order.paymentMethod,
      date: order.createdAt.toISOString().split('T')[0],
      estimatedDelivery: order.estimatedDelivery ? order.estimatedDelivery.toISOString().split('T')[0] : null,
      deliveredAt: order.deliveredAt ? order.deliveredAt.toISOString().split('T')[0] : null
    }));

    res.json({
      success: true,
      data: {
        orders: formattedOrders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: order._id,
        orderId: order.orderId,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        trackingId: order.trackingId,
        date: order.createdAt.toISOString().split('T')[0],
        estimatedDelivery: order.estimatedDelivery ? order.estimatedDelivery.toISOString().split('T')[0] : null,
        deliveredAt: order.deliveredAt ? order.deliveredAt.toISOString().split('T')[0] : null
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order from cart
// @access  Private
router.post('/', [
  auth,
  body('deliveryAddress').isObject().withMessage('Delivery address is required'),
  body('deliveryAddress.type').notEmpty().withMessage('Address type is required'),
  body('deliveryAddress.address').notEmpty().withMessage('Address is required'),
  body('paymentMethod').isIn(['COD', 'UPI', 'Card', 'Net Banking']).withMessage('Invalid payment method')
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

    const { deliveryAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Verify inventory for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || product.inventory < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for ${item.name}`
        });
      }
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items: cart.items.map(item => ({
        product: item.product,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      })),
      totalAmount: cart.totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid'
    });

    await order.save();

    // Update product inventory
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { inventory: -item.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        id: order._id,
        orderId: order.orderId,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod,
        date: order.createdAt.toISOString().split('T')[0],
        estimatedDelivery: order.estimatedDelivery ? order.estimatedDelivery.toISOString().split('T')[0] : null
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (['Shipped', 'In Transit', 'Delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order in current status'
      });
    }

    // Update order status
    order.status = 'Cancelled';
    await order.save();

    // Restore inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { inventory: item.quantity } }
      );
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        id: order._id,
        orderId: order.orderId,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
});

module.exports = router;