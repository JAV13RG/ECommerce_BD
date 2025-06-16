const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subCategoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', subcategoryController.getAllSubcategories);
router.post('/', protect, admin, subcategoryController.createSubcategory);
router.put('/:id', protect, admin, subcategoryController.updateSubcategory);
router.delete('/:id', protect, admin, subcategoryController.deleteSubcategory);

module.exports = router;