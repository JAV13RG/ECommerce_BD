const { body } = require('express-validator');

// Validacion de producto
exports.validateProduct = [
    body('name').notEmpty().withMessage('El nombre del producto es obligatorio'),
    body('category').notEmpty().withMessage('La categoría del producto es obligatoria'),
    body('subcategory').notEmpty().withMessage('La subcategoría del producto es obligatoria'),
    body('tags').isArray().withMessage('Los tags deben ser un arreglo')
];