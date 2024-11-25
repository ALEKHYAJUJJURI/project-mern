// routes/admin.js
const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' });
    res.status(200).json(sellers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve or restrict a seller
router.put('/sellers/:id/approve', async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // action = 'approve' or 'restrict'

  try {
    const seller = await User.findById(id);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    if (action === 'approve') {
      seller.isApproved = true;
    } else if (action === 'restrict') {
      seller.isApproved = false;
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await seller.save();
    res.status(200).json({ message: `Seller ${action}ed successfully`, seller });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'name');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Monitor user activity (simplified)
router.get('/user-activity', async (req, res) => {
  try {
    const users = await User.find({}, 'name email cart orders');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
