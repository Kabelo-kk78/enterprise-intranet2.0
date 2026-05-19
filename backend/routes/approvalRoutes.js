const express = require('express');
const router = express.Router();
const { getApprovals, approve, reject } = require('../controllers/approvalController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getApprovals);
router.post('/:id/approve', protect, approve);
router.post('/:id/reject', protect, reject);

module.exports = router;
