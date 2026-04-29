import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['customer', 'admin'], required: true },
  senderName: String,
  message: String,
  type: { type: String, enum: ['text', 'image_request', 'system'], default: 'text' },
}, { timestamps: true });

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  orderId: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: String,
  customerPhone: String,
  type: {
    type: String,
    enum: ['return', 'damaged', 'wrong_product', 'not_working', 'missing_parts', 'quality_issue', 'other'],
    required: true
  },
  productName: String,
  description: String,
  status: {
    type: String,
    enum: ['raised', 'accepted', 'in_process', 'info_requested', 'resolved', 'refund_initiated', 'refund_completed', 'rejected'],
    default: 'raised'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  messages: [messageSchema],
  adminNote: String,
  refundAmount: Number,
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);
