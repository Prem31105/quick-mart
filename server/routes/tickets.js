import express from 'express';
import Ticket from '../models/Ticket.js';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// POST /api/tickets — user raises a ticket
router.post('/', protect, async (req, res) => {
  try {
    const { orderId, orderObjectId, type, productName, description } = req.body;
    const count = await Ticket.countDocuments();
    const ticketId = `TK-${String(count + 1001).padStart(5, '0')}`;

    const ticket = await Ticket.create({
      ticketId,
      order: orderObjectId,
      orderId,
      user: req.user._id,
      customerName: req.user.name,
      customerPhone: req.user.phone,
      type,
      productName,
      description,
      status: 'raised',
      statusHistory: [{ status: 'raised', timestamp: new Date(), note: 'Complaint raised by customer' }],
      messages: [{ sender: 'customer', senderName: req.user.name, message: description, type: 'text' }],
    });

    const typeLabels = {
      return: 'Return Request', damaged: 'Damaged Product', wrong_product: 'Wrong Product',
      not_working: 'Not Working', missing_parts: 'Missing Parts', quality_issue: 'Quality Issue', other: 'Other Issue'
    };
    await Notification.create({
      type: 'system',
      title: `🎫 New Complaint: ${typeLabels[type]}`,
      message: `${req.user.name} raised a ticket for "${productName}" — ${description}`,
      customerName: req.user.name,
      productName,
      orderId,
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/tickets/my-tickets — user's tickets
router.get('/my-tickets', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/tickets — all tickets (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/tickets/order/:orderId — tickets for specific order
router.get('/order/:orderId', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ orderId: req.params.orderId });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/tickets/stats — ticket stats (admin)
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: { $in: ['raised', 'accepted', 'in_process', 'info_requested'] } });
    const resolved = await Ticket.countDocuments({ status: { $in: ['resolved', 'refund_completed'] } });
    res.json({ total, open, resolved });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/tickets/:id/status — admin updates ticket status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note, refundAmount } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.status = status;
    ticket.statusHistory.push({ status, timestamp: new Date(), note: note || `Status updated to ${status}` });
    if (note) ticket.adminNote = note;
    if (refundAmount) ticket.refundAmount = refundAmount;

    // Add system message for status change
    const statusLabels = {
      accepted: 'Complaint accepted by admin', in_process: 'Under investigation',
      info_requested: 'Admin requested more information / images',
      resolved: 'Issue resolved', refund_initiated: 'Refund has been initiated',
      refund_completed: 'Refund completed', rejected: 'Complaint rejected'
    };
    ticket.messages.push({
      sender: 'admin', senderName: 'Support Agent',
      message: note || statusLabels[status] || `Status: ${status}`,
      type: status === 'info_requested' ? 'image_request' : 'system'
    });

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/tickets/:id/messages — add a chat message (both user and admin)
router.post('/:id/messages', protect, async (req, res) => {
  try {
    const { message, type } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isAdmin = req.user.role === 'admin';
    ticket.messages.push({
      sender: isAdmin ? 'admin' : 'customer',
      senderName: isAdmin ? 'Support Agent' : req.user.name,
      message,
      type: type || 'text'
    });

    // If admin sends a message, also create a notification concept
    // If customer replies to info_requested, move back to in_process
    if (!isAdmin && ticket.status === 'info_requested') {
      ticket.status = 'in_process';
      ticket.statusHistory.push({ status: 'in_process', timestamp: new Date(), note: 'Customer provided requested information' });
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/tickets/orders-with-complaints — orders that have complaints (admin)
router.get('/orders-with-complaints', protect, adminOnly, async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    const orderIds = [...new Set(tickets.map(t => t.orderId))];
    res.json({ orderIds, tickets });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
