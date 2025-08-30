const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/multer');
const { addImagesToProduct, uploadImage } = require('../controllers/productController');

const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);
router.post('/', protect, admin, productController.createProduct);

router.get('/:id', productController.getProductById);
router.put('/:id', protect, admin, productController.updateProduct);

//Eliminar un producto completo
router.delete('/:id', protect, admin, productController.deleteProduct);

//Eliminar una imagen específica de un producto
router.delete('/:id/images/:publicId', protect, admin, productController.deleteProductImage);

router.post('/:id/images', protect, admin, upload.array('images', 5), addImagesToProduct);
router.post('/upload', upload.single('images'), uploadImage);

module.exports = router;
