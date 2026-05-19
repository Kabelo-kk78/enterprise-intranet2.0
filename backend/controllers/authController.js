const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findUserByEmail, findUserById, addUser, addActivity } = require('../data/store');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    addActivity(`User ${user.name} logged in`, 'auth');
    res.json({
      access_token: generateToken(user.id),
      user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    if (findUserByEmail(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = addUser({ name, email, password, role: 'staff', department: department || 'General', position: 'Staff' });
    addActivity(`New user registered: ${name}`, 'auth');
    res.status(201).json({
      access_token: generateToken(user.id),
      user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, department: user.department, position: user.position });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
};

exports.logout = async (req, res) => {
  addActivity(`User logged out`, 'auth');
  res.json({ message: 'Logged out successfully' });
};

exports.updateProfile = async (req, res) => {
  try {
    const user = findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { name, department, position } = req.body;
    if (name) user.name = name;
    if (department) user.department = department;
    if (position) user.position = position;
    addActivity(`User ${user.name} updated profile`, 'user');
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, department: user.department, position: user.position });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { currentPassword, newPassword } = req.body;
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    user.password = bcrypt.hashSync(newPassword, 10);
    addActivity(`User ${user.name} changed password`, 'auth');
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
};
