const { body } = require('express-validator');

exports.productValidatorRules = [
    body('name').notEmpty().withMessage('El nombre del producto es obligatorio'),
    body('price').isNumeric().withMessage('El precio debe ser un número'),
    body('category').notEmpty().withMessage('La categoría es obligatoria'),
    body('description').optional().isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres')
];