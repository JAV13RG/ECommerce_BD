const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middleware/validators/productValidator');
const validate = require('../middleware/validators/validate');

const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);
router.post('/', protect, admin, validateProduct, validate, productController.createProduct);

router.get('/:id', productController.getProductById);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;