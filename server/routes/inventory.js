import express from 'express';
import Product from '../models/Product.js';
import Hub from '../models/Hub.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/inventory/hubs — all hubs with stock summary
router.get('/hubs', protect, adminOnly, async (req, res) => {
  try {
    const hubs = await Hub.find({ isActive: true });
    const products = await Product.find();

    const hubData = hubs.map(hub => {
      let totalStock = 0;
      let totalProducts = 0;
      let lowStockCount = 0;

      products.forEach(product => {
        const entry = product.stock.find(s => s.city === hub.city);
        if (entry) {
          totalProducts++;
          totalStock += entry.quantity;
          if (entry.quantity > 0 && entry.quantity <= 10) lowStockCount++;
        }
      });

      return {
        ...hub.toObject(),
        totalStock,
        totalProducts,
        lowStockCount,
      };
    });

    res.json(hubData);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/inventory/hubs/:city — stock for a specific hub city
router.get('/hubs/:city', protect, adminOnly, async (req, res) => {
  try {
    const city = req.params.city;
    const products = await Product.find();

    const stockData = products.map(product => {
      const entry = product.stock.find(s => s.city === city);
      return {
        productId: product._id,
        name: product.name,
        category: product.category,
        brand: product.brand,
        price: product.price,
        image: product.image,
        quantity: entry ? entry.quantity : 0,
        stockId: entry ? entry._id : null,
      };
    }).sort((a, b) => a.quantity - b.quantity);

    res.json(stockData);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/inventory/stock — update stock for a product in a hub
router.put('/stock', protect, adminOnly, async (req, res) => {
  try {
    const { productId, city, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const entry = product.stock.find(s => s.city === city);
    if (entry) {
      entry.quantity = quantity;
    } else {
      product.stock.push({ hub: `${city} Hub`, city, quantity });
    }

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/inventory/low-stock
router.get('/low-stock', protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find();
    const lowStock = [];

    products.forEach(product => {
      product.stock.forEach(entry => {
        if (entry.quantity <= 10 && entry.quantity > 0) {
          lowStock.push({
            productId: product._id,
            name: product.name,
            city: entry.city,
            hub: entry.hub,
            quantity: entry.quantity,
          });
        }
      });
    });

    res.json(lowStock);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
