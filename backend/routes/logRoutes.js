const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.get('/', protect, checkRole('admin'), getLogs);

module.exports = router;
