
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const Order = require('../models/Order');
const User = require('../models/User');

// @route   GET api/admin/sellers
// @desc    Get all sellers
// @access  Private/Admin
router.get('/sellers', protect, admin, async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('-password');
    res.json(sellers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/admin/stats
// @desc    Get admin statistics
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalOrders = await Order.countDocuments();
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalAmount: { $sum: '$totalAmount' } } }
    ]);
    const totalCommission = await Order.aggregate([
      { $group: { _id: null, totalCommission: { $sum: '$commission' } } }
    ]);
    
    res.json({
      totalUsers,
      totalSellers,
      totalOrders,
      totalSales: totalSales.length > 0 ? totalSales[0].totalAmount : 0,
      totalCommission: totalCommission.length > 0 ? totalCommission[0].totalCommission : 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
