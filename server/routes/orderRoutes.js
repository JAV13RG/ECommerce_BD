const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const order = require('../models/order');

router.post('/', orderController.createOrder); // Crear un nuevo pedido
router.get('/', orderController.getAllOrders); // Obtener todos los pedidos
router.put('/:id/status', orderController.updateOrderStatus); // Actualizar el estado de un pedido

// Exporta las rutas de pedidos para su uso en la aplicación principal
module.exports = router;

const { protect, admin } = require('../middleware/authMiddleware');
router.get('/', protect, admin, orderController.getAllOrders); // Obtener todos los pedidos (solo administradores)
router.put('/:id/status', protect, admin, orderController.updateOrderStatus); // Actualizar el estado de un pedido (solo administradores)