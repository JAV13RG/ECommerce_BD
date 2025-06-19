const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  type: { type: String, enum: ['Polera', 'Polerón'], required: true }, // Tipo base
  color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color', required: true },
  size: { type: String, enum: ['S', 'M', 'L', 'XL'], required: true },
  stock: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', inventorySchema);