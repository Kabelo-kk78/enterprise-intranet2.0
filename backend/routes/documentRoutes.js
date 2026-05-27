const express = require('express');
const router = express.Router();
const { getDocuments, getDocument, createDocument, updateDocument, deleteDocument, downloadDocument, approveDocument, rejectDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', protect, getDocuments);
router.get('/:id', protect, getDocument);
router.get('/:id/download', protect, downloadDocument);
router.post('/', protect, checkRole('super_admin', 'admin', 'manager', 'staff'), upload.single('file'), createDocument);
router.put('/:id', protect, checkRole('super_admin', 'admin'), updateDocument);
router.post('/:id/approve', protect, checkRole('super_admin', 'admin', 'manager'), approveDocument);
router.post('/:id/reject', protect, checkRole('super_admin', 'admin', 'manager'), rejectDocument);
router.delete('/:id', protect, checkRole('super_admin', 'admin'), deleteDocument);

module.exports = router;
