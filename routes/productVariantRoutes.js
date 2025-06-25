const express = require('express');
const router = express.Router();
const controller = require('../controllers/productVariantController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, controller.getAllVariants);
router.get('/:id', protect, controller.getVariantById);

router.post('/', protect, admin, controller.createVariant);
router.put('/:id', protect, admin, controller.updateVariant);
router.delete('/:id', protect, admin, controller.deleteVariant);

module.exports = router;