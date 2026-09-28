const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress, 
      paymentMethod,   
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      deliveryStatus: 'Processing'
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/admin/metrics', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
  
  try {
    const orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 });
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    res.json({
      totalRevenue,
      totalOrders: orders.length,
      orders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;