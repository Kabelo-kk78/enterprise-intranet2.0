const express = require('express');
const router = express.Router();
const { getApprovals, approve, reject } = require('../controllers/approvalController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.get('/', protect, checkRole('super_admin', 'admin', 'manager'), getApprovals);
router.post('/:id/approve', protect, checkRole('super_admin', 'admin', 'manager'), approve);
router.post('/:id/reject', protect, checkRole('super_admin', 'admin', 'manager'), reject);

module.exports = router;
