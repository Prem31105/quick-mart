import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['cart_add', 'order_placed', 'payment_received', 'low_stock', 'system'] },
  title: String,
  message: String,
  customerName: String,
  productName: String,
  orderId: String,
  amount: Number,
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
