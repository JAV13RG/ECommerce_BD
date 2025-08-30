const express = require('express');
const router = express.Router();
const productVariantController = require('../controllers/productVariantController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, productVariantController.createVariant);

module.exports = router;