const path = require('path');
const fs = require('fs');
const { employees, documents, approvals, addDocument, addActivity, nextApprovalId } = require('../data/store');

const uploadDir = path.join(__dirname, '..', 'uploads');

exports.getDocuments = async (req, res) => {
  const docsWithApprovals = documents.map(doc => {
    const approval = approvals.find(a => a.document === doc.name);
    return approval ? { ...doc, approvalId: approval.id, approvalStatus: approval.status } : doc;
  });
  res.json(docsWithApprovals);
};

exports.getDocument = async (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  const approval = approvals.find(a => a.document === doc.name);
  res.json(approval ? { ...doc, approvalId: approval.id, approvalStatus: approval.status } : doc);
};

exports.createDocument = async (req, res) => {
  const file = req.file;
  const docName = file ? file.originalname : (req.body.name || 'Untitled');
  const assignedTo = req.body.assignedTo || null;

  const doc = addDocument({
    name: docName,
    department: req.body.department || req.user.department || 'General',
    uploadedBy: req.user.name,
    assignedTo,
    size: file ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : '0 MB',
    status: 'pending',
    filename: file ? file.filename : null,
  });

  const approvalId = nextApprovalId();
  const approval = {
    id: approvalId,
    document: docName,
    requester: req.user.name,
    assignedTo,
    department: doc.department,
    date: doc.date,
    status: 'pending',
    priority: 'Medium',
  };
  approvals.push(approval);

  addActivity(`${req.user.name} uploaded ${docName} (pending approval)`, 'document', doc.department, req.user.name);
  res.status(201).json({ ...doc, approvalId: approval.id, approvalStatus: approval.status });
};

exports.downloadDocument = async (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  if (!doc.filename) return res.status(404).json({ error: 'File not available for download' });
  const filePath = path.join(uploadDir, doc.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on server' });
  addActivity(`Document downloaded: ${doc.name}`, 'document');
  res.download(filePath, doc.name);
};

exports.updateDocument = async (req, res) => {
  const idx = documents.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Document not found' });
  documents[idx] = { ...documents[idx], ...req.body };
  addActivity(`Document updated: ${documents[idx].name}`, 'document');
  res.json(documents[idx]);
};

exports.approveDocument = async (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  if (doc.status !== 'pending') return res.status(400).json({ error: 'Document is not pending' });
  doc.status = 'approved';

  const approval = approvals.find(a => a.document === doc.name);
  if (approval) approval.status = 'approved';

  addActivity(`${req.user.name} approved ${doc.name}`, 'approval', doc.department, req.user.name);
  res.json(doc);
};

exports.rejectDocument = async (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  if (doc.status !== 'pending') return res.status(400).json({ error: 'Document is not pending' });
  doc.status = 'rejected';

  const approval = approvals.find(a => a.document === doc.name);
  if (approval) approval.status = 'rejected';

  addActivity(`${req.user.name} rejected ${doc.name}`, 'approval', doc.department, req.user.name);
  res.json(doc);
};

exports.deleteDocument = async (req, res) => {
  const idx = documents.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Document not found' });
  const [doc] = documents.splice(idx, 1);
  if (doc.filename) {
    const filePath = path.join(uploadDir, doc.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  addActivity(`Document deleted: ${doc.name}`, 'document');
  res.json({ message: 'Document deleted' });
};
