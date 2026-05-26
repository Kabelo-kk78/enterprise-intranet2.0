const { employees, departments, activities, documents, approvals, users } = require('../data/store');

exports.getStats = async (req, res) => {
  const byDepartment = {};
  const byStatus = { approved: 0, pending: 0, rejected: 0 };

  departments.forEach(d => { byDepartment[d.name] = 0; });

  documents.forEach(doc => {
    if (byDepartment[doc.department] !== undefined) {
      byDepartment[doc.department]++;
    } else {
      byDepartment[doc.department] = 1;
    }
    if (byStatus[doc.status] !== undefined) {
      byStatus[doc.status]++;
    }
  });

  const recentDocuments = documents
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const recentActivities = activities.slice(0, 10);

  res.json({
    totalDocuments: documents.length,
    pendingApprovals: approvals.filter(a => a.status === 'pending').length,
    activeUsers: employees.length,
    totalDepartments: departments.length,
    byDepartment,
    byStatus,
    recentDocuments,
    recentActivities,
  });
};

exports.getEmployeeStats = async (req, res) => {
  res.json({ total: employees.length, active: employees.filter(e => e.status === 'active').length });
};

exports.getDepartmentStats = async (req, res) => {
  const byDepartment = {};
  departments.forEach(d => { byDepartment[d.name] = 0; });
  documents.forEach(doc => {
    if (byDepartment[doc.department] !== undefined) {
      byDepartment[doc.department]++;
    } else {
      byDepartment[doc.department] = 1;
    }
  });

  const deptList = departments.map(d => ({
    ...d,
    documentCount: byDepartment[d.name] || 0,
  }));

  const extraDepts = Object.keys(byDepartment).filter(
    name => !departments.some(d => d.name === name)
  );

  extraDepts.forEach(name => {
    deptList.push({
      id: name.toLowerCase(),
      name,
      headCount: 0,
      documentCount: byDepartment[name],
    });
  });

  res.json({
    total: deptList.length,
    list: deptList,
  });
};

exports.getRecentActivities = async (req, res) => {
  res.json(activities.slice(0, 20));
};
