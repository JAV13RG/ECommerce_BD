const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas para la gestión de usuarios
router.post('/register', userController.registerUser);

// Rutas para la autenticación de usuarios
module.exports = router;