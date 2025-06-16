const express = require('express');
const router = express.Router();
const colorController = require('../controllers/colorController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', colorController.getAllColors);
router.post('/', protect, admin, colorController.createColor);
router.put('/:id', protect, admin, colorController.updateColor);
router.delete('/:id', protect, admin, colorController.deleteColor);

module.exports = router;