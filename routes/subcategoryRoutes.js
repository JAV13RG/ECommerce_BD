const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

const {
    createSubcategory,
    getAllSubcategories,
    updateSubcategory,
    deleteSubcategory
} = require('../controllers/subcategoryController');

//Publico
router.get('/', getAllSubcategories);

//Privado (solo administradores)
router.post('/', protect, admin, createSubcategory);
router.put('/:id', protect, admin, updateSubcategory);
router.delete('/:id', protect, admin, deleteSubcategory);

module.exports = router;