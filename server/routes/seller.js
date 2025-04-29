
const express = require('express');
const router = express.Router();
const { protect, seller } = require('../middlewares/authMiddleware');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @route   GET api/seller/products
// @desc    Get seller products
// @access  Private/Seller
router.get('/products', protect, seller, async (req, res) => {
  try {
    const products = await Product.find({ storeId: req.user._id });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/seller/stats
// @desc    Get seller statistics
// @access  Private/Seller
router.get('/stats', protect, seller, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({ sellerId: req.user._id });
    const pendingOrders = await Order.countDocuments({ sellerId: req.user._id, status: 'pending' });
    const totalSales = await Order.aggregate([
      { $match: { sellerId: req.user._id } },
      { $group: { _id: null, totalAmount: { $sum: '$totalAmount' } } }
    ]);
    const totalCommission = await Order.aggregate([
      { $match: { sellerId: req.user._id } },
      { $group: { _id: null, totalCommission: { $sum: '$commission' } } }
    ]);
    
    res.json({
      totalOrders,
      pendingOrders,
      totalSales: totalSales.length > 0 ? totalSales[0].totalAmount : 0,
      totalCommission: totalCommission.length > 0 ? totalCommission[0].totalCommission : 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
