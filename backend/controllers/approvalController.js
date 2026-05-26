const { approvals, documents, addActivity, nextApprovalId } = require('../data/store');

exports.getApprovals = async (req, res) => {
  const approvalNames = new Set(approvals.map(a => a.document));

  const orphanDocs = documents.filter(d =>
    (d.status === 'pending' || d.status === 'rejected') && !approvalNames.has(d.name)
  ).map(doc => ({
    id: 'doc-' + doc.id,
    document: doc.name,
    requester: doc.uploadedBy || 'Unknown',
    department: doc.department,
    date: doc.date,
    status: doc.status,
    priority: 'Medium',
    _docId: doc.id,
  }));

  res.json([...approvals, ...orphanDocs]);
};

exports.approve = async (req, res) => {
  const id = req.params.id;

  if (id.startsWith('doc-')) {
    const docId = id.replace('doc-', '');
    const doc = documents.find(d => d.id === docId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    doc.status = 'approved';

    const approval = {
      id: nextApprovalId(),
      document: doc.name,
      requester: doc.uploadedBy || 'Unknown',
      department: doc.department,
      date: doc.date,
      status: 'approved',
      priority: 'Medium',
    };
    approvals.push(approval);

    addActivity(`${req.user.name} approved ${doc.name}`, 'approval', req.user.department, req.user.name);
    return res.json(approval);
  }

  const approval = approvals.find(a => a.id === id);
  if (!approval) return res.status(404).json({ error: 'Approval not found' });
  approval.status = 'approved';

  const doc = documents.find(d => d.name === approval.document);
  if (doc) doc.status = 'approved';

  addActivity(`${req.user.name} approved ${approval.document}`, 'approval', req.user.department, req.user.name);
  res.json(approval);
};

exports.reject = async (req, res) => {
  const id = req.params.id;

  if (id.startsWith('doc-')) {
    const docId = id.replace('doc-', '');
    const doc = documents.find(d => d.id === docId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    doc.status = 'rejected';

    const approval = {
      id: nextApprovalId(),
      document: doc.name,
      requester: doc.uploadedBy || 'Unknown',
      department: doc.department,
      date: doc.date,
      status: 'rejected',
      priority: 'Medium',
    };
    approvals.push(approval);

    addActivity(`${req.user.name} rejected ${doc.name}`, 'approval', req.user.department, req.user.name);
    return res.json(approval);
  }

  const approval = approvals.find(a => a.id === id);
  if (!approval) return res.status(404).json({ error: 'Approval not found' });
  approval.status = 'rejected';

  const doc = documents.find(d => d.name === approval.document);
  if (doc) doc.status = 'rejected';

  addActivity(`${req.user.name} rejected ${approval.document}`, 'approval', req.user.department, req.user.name);
  res.json(approval);
};
