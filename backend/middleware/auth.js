// middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (role) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== role) {
      return res.status(403).json({ message: 'Unauthorized role' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };
