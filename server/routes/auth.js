import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { decryptData } from '../utils/encryption.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password: encPassword, role } = req.body;
    const password = encPassword ? decryptData(encPassword) : null;

    if (!password) {
       return res.status(400).json({ message: 'Password is required or decryption failed' });
    }

    // Support simple role+password login (backward compatible)
    if (role && password && !email) {
      const roleKey = role.toLowerCase();
      const users = await User.find({ role: roleKey });
      if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

      const token = generateToken(user._id);
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }

    // Email + password login
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password: encPassword, phone } = req.body;
    const password = encPassword ? decryptData(encPassword) : null;
    
    if (!password) {
       return res.status(400).json({ message: 'Password is required or decryption failed' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, phone, role: 'user' });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
