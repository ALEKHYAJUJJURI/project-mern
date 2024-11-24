// routes/user.js
const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const router = express.Router();

// Middleware to verify user role
const verifyUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Access denied: User role required' });
  }
  next();
};

// Get all products
router.get('/products', verifyUser, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add product to cart
router.post('/cart/add', verifyUser, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user.id);
    const existingItem = user.cart.find((item) => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.status(200).json({ message: 'Product added to cart', cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get cart items
router.get('/cart', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId', 'title price image');
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Place an order
router.post('/order', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId', 'title price');

    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = user.cart.map((item) => ({
      productId: item.productId._id,
      title: item.productId.title,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      status: 'pending',
    });

    await newOrder.save();

    user.cart = [];
    await user.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order history
router.get('/orders', verifyUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
