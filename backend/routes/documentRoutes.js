const express = require('express');
const router = express.Router();
const { getDocuments, getDocument, createDocument, updateDocument, deleteDocument, downloadDocument, approveDocument, rejectDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', protect, getDocuments);
router.get('/:id', protect, getDocument);
router.get('/:id/download', protect, downloadDocument);
router.post('/', protect, upload.single('file'), createDocument);
router.put('/:id', protect, updateDocument);
router.post('/:id/approve', protect, approveDocument);
router.post('/:id/reject', protect, rejectDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;
