const { getUsers, findUserById, users, addActivity } = require('../data/store');

exports.getUsers = async (req, res) => {
  res.json(getUsers());
};

exports.getUser = async (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password, ...userData } = user;
  res.json(userData);
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
