// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'seller', 'admin'], required: true },
  cart: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
  orders: [{ orderId: mongoose.Schema.Types.ObjectId, status: String }],
});

module.exports = mongoose.model('User', userSchema);
