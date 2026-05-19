const { employees, departments, activities, documents, users } = require('../data/store');

exports.getStats = async (req, res) => {
  res.json({
    totalEmployees: employees.length,
    departments: departments.length,
    totalDocuments: 234,
    pendingApprovals: 12,
    teamMembers: 45,
  });
};

exports.getEmployeeStats = async (req, res) => {
  res.json({ total: employees.length, active: employees.filter(e => e.status === 'active').length });
};

exports.getDepartmentStats = async (req, res) => {
  res.json({ total: departments.length, list: departments });
};

exports.getRecentActivities = async (req, res) => {
  res.json(activities.slice(0, 10));
};
