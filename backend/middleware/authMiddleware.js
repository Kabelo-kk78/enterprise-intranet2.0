const jwt = require('jsonwebtoken');
const { findUserById } = require('../data/store');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized' });
  }
};

module.exports = { protect };
