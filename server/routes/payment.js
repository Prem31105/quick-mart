import express from 'express';
import crypto from 'crypto';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Razorpay credentials from environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

// POST /api/payment/create-order — Create Razorpay order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay credentials not configured' });
    }

    const amountInPaise = Math.round(amount * 100);

    // Use Razorpay Orders API with fetch (no SDK dependency needed)
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `qm_${Date.now()}`,
        notes: {
          customer: req.user.name,
          email: req.user.email,
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Razorpay order creation failed:', errData);
      return res.status(response.status).json({ 
        message: 'Failed to create Razorpay order', 
        error: errData 
      });
    }

    const order = await response.json();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Payment order error:', err);
    res.status(500).json({ message: 'Server error creating payment order', error: err.message });
  }
});

// POST /api/payment/verify — Verify Razorpay payment signature
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay secret not configured' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.json({ 
        verified: true, 
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      res.status(400).json({ verified: false, message: 'Payment signature verification failed' });
    }
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ message: 'Server error verifying payment', error: err.message });
  }
});

// GET /api/payment/config — Return Razorpay key for frontend
router.get('/config', protect, (req, res) => {
  res.json({ 
    keyId: RAZORPAY_KEY_ID || '',
    configured: !!(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET),
  });
});

export default router;
