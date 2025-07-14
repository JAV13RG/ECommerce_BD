const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadImage');
const { addImagesToProduct } = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.post('/', protect, admin, productController.createProduct);

router.get('/:id', productController.getProductById);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

router.post('/upload/:id',
    upload.array('images', 5), // Permite subir hasta 5 imágenes
    addImagesToProduct
)

module.exports = router;
