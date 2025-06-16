const Category = require('../models/category');

//Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error en la petición', error });
    }
};

//Crear una nueva categoría
exports.createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const exist = await Category.findOne({ name });
        if (exist) return res.status(400).json({ message: 'Categoria ya existente' });

        const newCategory = new Category({ name });
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la categoría', error });
    }
};

//Actualizar una categoría
exports.updateCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!category) return res.status(404).json({ message: 'Categoria no encontrada' });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la categoría', error });
    }
};

//Eliminar una categoría
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Categoria no encontrada' });
        res.json({ message: 'Categoria eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la categoría', error });
    }
};