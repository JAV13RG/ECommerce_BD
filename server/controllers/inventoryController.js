const InventoryItem = require('../models/inventoryItem');

//Crear item de inventario
exports.createInventoryItem = async (req, res) => {
    try {
        const { type, color, size, stock } = req.body;

        const existingItem = await InventoryItem.findOne({ type, color, size });
        if (existingItem) {
            return res.status(400).json({ message: 'El item de inventario ya existe con esas especificaciones (tipo, color, talla).' });
        }

        const item = new InventoryItem({ type, color, size, stock });
        const saved = await item.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el item de inventario', error: error.message });
    }
};

// Obtener todos los items de inventario
exports.getAllInventoryItems = async (req, res) => {
    try {
        const items = await InventoryItem.find().populate('color', 'name');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los items de inventario', error: error.message });
    }
};

//Actualizar item de inventario
exports.updateInventoryItem = async (req, res) => {
    try {
        const item = await InventoryItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item de inventario no encontrado' });

        const { type, color, size, stock } = req.body;

        item.type = type || item.type;
        item.color = color || item.color;
        item.size = size || item.size;
        item.stock = stock || item.stock;

        const updated = await item.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el item de inventario', error: error.message });
    }
};

// Eliminar item de inventario
exports.deleteInventoryItem = async (req, res) => {
    try {
        const deleted = await InventoryItem.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Item de inventario no encontrado' });
        res.json({ message: 'Item de inventario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el item de inventario', error: error.message });
    }
};