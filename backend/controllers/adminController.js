const Order = require('../models/Order');
const Product = require('../models/Product');

// Get Sales Metrics, Delivery Tracking, and Financials
exports.getAdminDashboardStats = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });

    const totalRevenue = orders
      .filter(o => o.isPaid || o.orderStatus === 'Delivered')
      .reduce((acc, curr) => acc + curr.totalAmount, 0);

    const totalOrdersCount = orders.length;

    // Delivery destinations
    const deliveryLocations = orders.map(o => ({
      orderId: o._id,
      customer: o.shippingAddress.fullName,
      city: o.shippingAddress.city,
      state: o.shippingAddress.state,
      pincode: o.shippingAddress.pincode,
      status: o.orderStatus,
      totalAmount: o.totalAmount,
      isPaid: o.isPaid,
      paymentMethod: o.paymentMethod,
      date: o.createdAt
    }));

    res.json({
      totalRevenue,
      totalOrdersCount,
      deliveryLocations,
      recentOrders: orders.slice(0, 10)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};