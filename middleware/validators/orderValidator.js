const { body } = require('express-validator');

exports.validateOrder = [
    body('products').isArray({ min: 1 }).withMessage('Debe haber al menos un producto en la orden'),
    body('products.*.variant').notEmpty().withMessage('La variante del producto es obligatoria'),
    body('products.*.quantity').isInt({ min: 1}).withMessage('Se necesita al menos una unidad del producto'),
    body('shippingAdress.street').notEmpty().withMessage('La calle de envío es obligatoria'),
    body('shippingAdress.city').notEmpty().withMessage('La ciudad de envío es obligatoria'),
    body('shippingAdress.region').notEmpty().withMessage('El estado de envío es obligatorio'),
    body('shippingAdress.postalCode').notEmpty().withMessage('El código postal de envío es obligatorio')
];