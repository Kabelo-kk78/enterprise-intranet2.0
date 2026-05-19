const { activities } = require('../data/store');

exports.getLogs = async (req, res) => {
  res.json(activities);
};
