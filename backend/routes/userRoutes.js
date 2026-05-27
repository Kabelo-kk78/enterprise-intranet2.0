const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, getEmployees } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.get('/', protect, checkRole('super_admin', 'admin'), getUsers);
router.get('/employees', protect, getEmployees);
router.post('/', protect, checkRole('super_admin', 'admin'), createUser);
router.get('/:id', protect, getUser);
router.put('/:id', protect, checkRole('super_admin', 'admin'), updateUser);

module.exports = router;
