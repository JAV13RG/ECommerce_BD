const express = require('express');
const router = express.Router();
const variantController = require('../controllers/productVariantController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateVariant } = require('../middleware/validators/variantValidator');
const validate = require('../middleware/validators/validate');

router.get('/', protect, variantController.getAllVariants);
router.get('/:id', protect, variantController.getVariantById);

router.post('/', protect, admin, variantController.createVariant);
router.put('/:id', protect, admin, variantController.updateVariant);
router.delete('/:id', protect, admin, variantController.deleteVariant);

router.post('/', protect, admin, validateVariant, validate, variantController.createVariant);

module.exports = router;