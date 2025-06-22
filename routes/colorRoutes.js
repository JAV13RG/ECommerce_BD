const express = require('express');
const router = express.Router();

const {
    createColor,
    getAllColors,
    updateColor,
    deleteColor
} = require('../controllers/colorController');

const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllColors);
router.post('/', protect, admin, createColor);
router.put('/:id', protect, admin, updateColor);
router.delete('/:id', protect, admin, deleteColor);

module.exports = router;