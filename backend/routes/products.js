// routes/products.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const verifySeller = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract the token from the "Authorization" header
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
}
try {
  // Verify the token and extract payload
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
  req.user = decoded; // Set the decoded payload in req.user
  next(); // Proceed to the next middleware or route handler
} catch (err) {
  return res.status(400).json({ message: 'Invalid Token.' });
}
}

// Get all products (for users)

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'name');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new product (for sellers)
router.post('/', verifySeller, async (req, res) => {
  const { title, description, price, image } = req.body;
  const sellerId = req.user.id; // Set from the verifyToken middleware
  try {
    const newProduct = new Product({ title, description, price, image, sellerId });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a product (for sellers)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user.id; // Set from the verifyToken middleware
  try {
    const product = await Product.findOne({ _id: id, sellerId });
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a product (for sellers)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user.id; // Set from the verifyToken middleware
  try {
    const product = await Product.findOne({ _id: id, sellerId });
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
