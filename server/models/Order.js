import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  quantity: Number,
  image: String
});

const statusHistorySchema = new mongoose.Schema({
  status: String,
  timestamp: { type: Date, default: Date.now },
  note: String
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  items: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    mobile: String
  },
  paymentMethod: { type: String, enum: ['razorpay', 'cod'] },
  paymentId: String,
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'packaging', 'shipped', 'in_hub', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  statusHistory: [statusHistorySchema],
  totalAmount: Number,
  estimatedDelivery: Date,
  deliveredAt: Date,
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
