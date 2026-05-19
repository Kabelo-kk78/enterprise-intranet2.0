const express = require('express');
const router = express.Router();
const { getStats, getEmployeeStats, getDepartmentStats, getRecentActivities } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getStats);
router.get('/employees/stats', protect, getEmployeeStats);
router.get('/departments/stats', protect, getDepartmentStats);
router.get('/activities/recent', protect, getRecentActivities);

module.exports = router;
