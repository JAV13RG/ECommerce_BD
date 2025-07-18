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
router.delete('/:id', protect, admin, productController.deleteProduct);

router.post('/:id/images', upload.array('images', 10),productController.addImagesToProduct);
router.post('/upload', upload.single('images'), uploadImage);
router.delete('/image/:productId', productController.removeImageFromProduct);

module.exports = router;
