import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: { $in: ['placed', 'confirmed', 'packaging'] } });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const totalUsers = await User.countDocuments({ role: 'user' });

    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const products = await Product.find();
    let totalStock = 0;
    products.forEach(p => {
      p.stock.forEach(s => { totalStock += s.quantity; });
    });

    res.json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalUsers,
      totalRevenue,
      totalProducts: products.length,
      totalStock,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/dashboard/recent-orders
router.get('/recent-orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(10);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
