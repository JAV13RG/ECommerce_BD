const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const order = require('../models/order');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, orderController.createOrder); // Crear un nuevo pedido
router.get('/', orderController.getAllOrders); // Obtener todos los pedidos
router.put('/:id/status', orderController.updateOrderStatus); // Actualizar el estado de un pedido

// Exporta las rutas de pedidos para su uso en la aplicación principal
module.exports = router;

router.get('/', protect, admin, orderController.getAllOrders); // Obtener todos los pedidos (solo administradores)
router.put('/:id/status', protect, admin, orderController.updateOrderStatus); // Actualizar el estado de un pedido (solo administradores)

//Permite que el usuario vea sus pedidos
router.get('/my', protect, orderController.getMyOrders);

//Marcar un pedido como pagado
router.put('/:id/pay', protect, orderController.markOrderAsPaid);