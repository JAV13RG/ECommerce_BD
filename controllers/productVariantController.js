const productVariant = require('../models/productVariant');

//Crear variante
exports.createVariant = async (req, res, next) => {
    try {
        const { product, color, size, price, stock } = req.body;

        //Evitar duplicados
        const existingVariant = await productVariant.findOne({ product, color, size });
        if (existingVariant) {
            const error = new Error('Variante de producto ya existe');
            error.statusCode = 400;
            return next(error);
        }

        const variant = new productVariant({ product, color, size, price, stock });
        const savedVariant = await variant.save();
        res.status(201).json(savedVariant);
    } catch (error) {
        next(error);
    }
};

// Obtener todas las variantes de un producto
exports.getAllVariants = async (req, res, next) => {
    try {
        const variants = await productVariant.find()
            .populate('product', 'name category subcategory')
            .populate('color', 'name')
        res.json(variants);
    } catch (error) {
        next(error);
    }
};

// Obtener una variante de un producto (ID)
exports.getVariantById = async (req, res, next) => {
    try {
        const variant = await productVariant.findById(req.params.id)
            .populate('product', 'name category subcategory')
            .populate('color', 'name');
        if (!variant) {
            const error = new Error('Variante no encontrada');
            error.statusCode = 404;
            return next(error);
        }
        res.json(variant);
    } catch (error) {
        next(error);
    }
};

// Actualizar una variante
exports.updateVariant = async (req, res, next) => {
    try {
        const { product, color, size, price, stock } = req.body;
        const variant = await productVariant.findById(req.params.id);
        if (!variant) {
            const error = new Error('Variante no encontrada');
            error.statusCode = 404;
            return next(error);
        }

        if (product) variant.product = product;
        if (color) variant.color = color;
        if (size) variant.size = size;
        if (typeof price !== 'undefined') variant.price = price;
        if (typeof stock !== 'undefined') variant.stock = stock;
        const updatedVariant = await variant.save();
        res.json(updatedVariant);
    } catch (error) {
        next(error);
    }
};

// Eliminar una variante
exports.deleteVariant = async (req, res, next) => {
    try {
        const deleted = await productVariant.findByIdAndDelete(req.params.id);
        if (!deleted) {
            const error = new Error('Variante no encontrada');
            error.statusCode = 404;
            return next(error);
        }
        res.json({ message: 'Variante eliminada correctamente' });
    } catch (error) {
        next(error);
    }
};