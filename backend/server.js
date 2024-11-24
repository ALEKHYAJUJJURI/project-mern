// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const sellerRoutes = require('./routes/seller');
const { verifyToken } = require('./middleware/auth');

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const cors = require('cors')
app.use(cors(
  {
    origin: 'http://localhost:3000',  // Only allow your frontend's origin
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods:["GET","POST"]
  }
))

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', verifyToken('admin'), adminRoutes);
app.use('/api/user', verifyToken('user'), userRoutes);
app.use('/api/seller', verifyToken('seller'), sellerRoutes);
app.use('/api/products', verifyToken('seller'), productRoutes);

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
