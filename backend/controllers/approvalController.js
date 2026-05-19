const { approvals, addActivity } = require('../data/store');

exports.getApprovals = async (req, res) => {
  res.json(approvals);
};

exports.approve = async (req, res) => {
  const approval = approvals.find(a => a.id === req.params.id);
  if (!approval) return res.status(404).json({ error: 'Approval not found' });
  approval.status = 'approved';
  addActivity(`Document approved: ${approval.document}`, 'approval');
  res.json(approval);
};

exports.reject = async (req, res) => {
  const approval = approvals.find(a => a.id === req.params.id);
  if (!approval) return res.status(404).json({ error: 'Approval not found' });
  approval.status = 'rejected';
  addActivity(`Document rejected: ${approval.document}`, 'approval');
  res.json(approval);
};
