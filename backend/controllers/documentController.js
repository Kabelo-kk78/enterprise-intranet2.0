const path = require('path');
const fs = require('fs');
const { documents, addDocument, addActivity } = require('../data/store');

const uploadDir = path.join(__dirname, '..', 'uploads');

exports.getDocuments = async (req, res) => {
  res.json(documents);
};

exports.getDocument = async (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.json(doc);
};

exports.createDocument = async (req, res) => {
  const file = req.file;
  const doc = addDocument({
    name: file ? file.originalname : req.body.name,
    department: req.body.department || req.user.department || 'General',
    uploadedBy: req.user.name,
    size: file ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : '0 MB',
    status: 'approved',
    filename: file ? file.filename : null,
  });
  addActivity(`Document uploaded: ${doc.name}`, 'document');
  res.status(201).json(doc);
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
