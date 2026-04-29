import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// POST /api/orders — create order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentId, totalAmount } = req.body;

    // Generate order ID
    const count = await Order.countDocuments();
    const orderId = `QM-${String(count + 1001).padStart(5, '0')}`;

    // Estimated delivery: 5-7 days from now
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 3) + 5);

    const order = await Order.create({
      orderId,
      user: req.user._id,
      customerName: req.user.name,
      customerPhone: req.user.phone || shippingAddress.mobile,
      customerEmail: req.user.email,
      items,
      shippingAddress,
      paymentMethod,
      paymentId,
      status: 'placed',
      statusHistory: [{ status: 'placed', timestamp: new Date(), note: 'Order placed by customer' }],
      totalAmount,
      estimatedDelivery,
    });

    // Decrease stock from nearest hub (pick first hub with stock for each item)
    for (const item of items) {
      if (item.product) {
        const product = await Product.findById(item.product);
        if (product) {
          const hubWithStock = product.stock.find(s => s.quantity >= item.quantity);
          if (hubWithStock) {
            hubWithStock.quantity -= item.quantity;
            await product.save();
          }
        }
      }
    }

    // Create notification for admin
    const itemNames = items.map(i => i.name).join(', ');
    await Notification.create({
      type: 'order_placed',
      title: 'New Order Placed!',
      message: `${req.user.name} ordered ${itemNames} — ₹${totalAmount.toLocaleString('en-IN')}`,
      customerName: req.user.name,
      productName: itemNames,
      orderId,
      amount: totalAmount,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/orders — all orders (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/orders/my-orders — user's orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/orders/track/:orderId — tracking by order number
router.get('/track/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ message: 'Tracking ID not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/orders/:id/status — update order status (admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`
    });

    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
