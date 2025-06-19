const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, inventoryController.getAllInventory);
router.post('/', protect, admin, inventoryController.createInventoryItem);
router.put('/:id', protect, admin, inventoryController.updateInventoryItem);
router.delete('/:id', protect, admin, inventoryController.deleteInventoryItem);

module.exports = router;