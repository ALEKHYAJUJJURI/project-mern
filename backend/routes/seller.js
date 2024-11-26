// routes/seller.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Middleware to verify seller role
const verifySeller = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Access denied: Seller role required' });
  }
  next();
};

// Get all products uploaded by the seller
router.get('/products', verifySeller, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new product
router.post('/products', verifySeller, async (req, res) => {
  const { title, description, price, image } = req.body;
  try {
    const newProduct = new Product({
      title,
      description,
      price,
      image,
      sellerId: req.user.id,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit an existing product
router.put('/products/:id', verifySeller, async (req, res) => {
  const { id } = req.params;
  const { title, description, price, image } = req.body;
  try {
    const product = await Product.findOne({ _id: id, sellerId: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });

    product.title = title;
    product.description = description;
    product.price = price;
    product.image = image;
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a product
router.delete('/products/:id', verifySeller, async (req, res) => {
  const { id } = req.params;
  console.log(req.params)
  try {
    const product = await Product.findOne({ _id: id, sellerId: req.user.id });
    console.log(product)
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });

    await product.remove();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;