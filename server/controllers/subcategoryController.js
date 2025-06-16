const subcategory = require('../models/subcategory');

//Crear una nueva subcategoría
exports.createSubcategory = async (req, res) => {
    const { name, category } = req.body;

    if (!name || !category) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    try {
        const newSubcategory = new subcategory({ name, category });
        const savedSubcategory = await newSubcategory.save();
        res.status(201).json(savedSubcategory);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la subcategoría', error });
    }
};

//Actualizar una subcategoría
exports.updateSubcategory = async (req, res) => {
    const { name, category } = req.body;

    try {
        const subcategory = await subcategory.findByIdAndUpdate( 
            req.params.id,
            { name, category },
            { new: true }
        );
        if (!subcategory) return res.status(404).json({ message: 'Subcategoria no encontrada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la subcategoría' });
    }
};

//Eliminar una subcategoría
exports.deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await subcategory.findByIdAndDelete(req.params.id); 
        if (!subcategory) return res.status(404).json({ message: 'Subcategoria no encontrada' });
        res.json({ message: 'Subcategoria eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la subcategoría', error });
    }
};

//Obtener todas las subcategorías
exports.getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await subcategory.find().populate('category', 'name');
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: 'Error en la petición (subcategories)', error });
    }
};