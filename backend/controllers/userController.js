const { getUsers, findUserById, findUserByEmail, users, employees, addUser, addActivity } = require('../data/store');

exports.getUsers = async (req, res) => {
  res.json(getUsers());
};

exports.getUser = async (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password, ...userData } = user;
  res.json(userData);
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, department, position } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (findUserByEmail(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = addUser({ name, email, password, role: role || 'staff', department: department || 'General', position: position || 'Staff' });
    addActivity(`User created: ${name} (${role || 'staff'})`, 'user');
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.getEmployees = async (req, res) => {
  res.json(employees);
};

exports.updateUser = async (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const updatable = ['name', 'role', 'department', 'position', 'status'];
  for (const key of updatable) {
    if (req.body[key] !== undefined) users[idx][key] = req.body[key];
  }
  addActivity(`User updated: ${users[idx].name}`, 'user');
  const { password, ...userData } = users[idx];
  res.json(userData);
};
