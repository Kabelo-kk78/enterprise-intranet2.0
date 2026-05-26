const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, getEmployees } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.get('/', protect, checkRole('admin', 'manager'), getUsers);
router.get('/employees', protect, getEmployees);
router.post('/', protect, checkRole('admin'), createUser);
router.get('/:id', protect, getUser);
router.put('/:id', protect, checkRole('admin'), updateUser);

module.exports = router;
