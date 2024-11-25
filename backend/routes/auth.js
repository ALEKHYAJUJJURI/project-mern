// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config()



// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save user to the database
    await newUser.save();

    // Send success response
    res.status(201).json({
      message: 'User created successfully',
      user: { name: newUser.name,password:newUser.password, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
console.log(user)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: 60 });
 console.log(token)
    const refreshToken = jwt.sign({email: user.email, role: user.role }, process.env.REFRESH_TOKEN, {expiresIn:'7d'})
    
    res.status(200).json({message: 'Login successful',token, refreshToken,user});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
