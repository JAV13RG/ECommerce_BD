const { body, ExpressValidator } = require('express-validator');

exports.validateVariant = [
    body('product').notEmpty().withMessage('El producto es obligatorio'),
    body('color').notEmpty().withMessage('El color es obligatorio'),
    body('size').notEmpty().withMessage('La talla es obligatoria'),
    body('price').isNumeric({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0'),
    body('stock').isNumeric({ min: 0 }).withMessage('El stock debe ser un número mayor o igual a 0')
];