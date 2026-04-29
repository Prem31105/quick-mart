import mongoose from 'mongoose';

const hubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: String,
  address: String,
  pincode: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Hub', hubSchema);
