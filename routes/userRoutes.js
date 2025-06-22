const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, userController.getAllUsers);
router.get('/:id', protect, admin, userController.getUserById);
router.put('/:id', protect, admin, userController.updateUser);
router.delete('/:id', protect, admin, userController.deleteUser);

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;