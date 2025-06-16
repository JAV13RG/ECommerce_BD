const Color = require('../models/color');

//Crear una opcion de color
exports.createColor = async (req, res) => {
    const { name } = req.body;

    try {
        const exist = await Color.findOne({ name });
        if (exist) return res.status(400).json({ message: 'Color ya creado' });

        const newColor = new Color({ name });
        const savedColor = await newColor.save();
        res.status(201).json(savedColor);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el color', error });
    }
};

//Actualizar un color
exports.updateColor = async (req, res) => {
    const { name } = req.body;

    try {
        const color = await Color.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );
        if (!color) return res.status(404).json({ message: 'Color no encontrado' });
        res.json(color);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el color', error });
    }
};

//Eliminar un color
exports.deleteColor = async (req, res) => {
    try {
        const color = await Color.findByIdAndDelete(req.params.id);
        if (!color) return res.status(404).json({ message: 'Color no encontrado' });
        res.json({ message: 'Color eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el color', error });
    }
};

//Obtener todas las colores
exports.getAllColors = async (req, res) => {
    try {
        const colors = await Color.find();
        res.json(colors);
    } catch (error) {
        res.status(500).json({ message: 'Error en la petición', error });
    }
};