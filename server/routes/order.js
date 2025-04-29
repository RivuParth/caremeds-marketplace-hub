
const express = require('express');
const router = express.Router();
const { protect, seller } = require('../middlewares/authMiddleware');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @route   POST api/order
// @desc    Create a new order
// @access  Private
router.post('/', protect, async (req, res) => {
  const { sellerId, items, paymentType, deliveryAddress } = req.body;
  
  try {
    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    
    // Calculate total amount and validate items
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      
      totalAmount += product.price * item.quantity;
      
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
      
      // Update product quantity
      product.quantity -= item.quantity;
      await product.save();
    }
    
    // Calculate commission (10%)
    const commission = totalAmount * 0.1;
    
    // Create order
    const order = await Order.create({
      userId: req.user._id,
      sellerId,
      items: orderItems,
      paymentType,
      totalAmount,
      deliveryAddress,
      commission
    });
    
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/order/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/order/seller
// @desc    Get seller orders
// @access  Private/Seller
router.get('/seller', protect, seller, async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/order/:id/status
// @desc    Update order status
// @access  Private/Seller
router.put('/:id/status', protect, seller, async (req, res) => {
  const { status } = req.body;
  
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if seller owns this order
    if (order.sellerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this order' });
    }
    
    order.status = status;
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/order/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (order.userId.toString() !== req.user._id.toString() && 
        order.sellerId.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
