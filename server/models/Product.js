import mongoose from 'mongoose';

const stockEntrySchema = new mongoose.Schema({
  hub: String,
  city: String,
  quantity: { type: Number, default: 0 }
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: String,
  brand: String,
  rating: { type: Number, default: 4.5 },
  image: String,
  stock: [stockEntrySchema],
}, { timestamps: true });

productSchema.virtual('totalStock').get(function() {
  return this.stock.reduce((sum, s) => sum + s.quantity, 0);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', productSchema);
