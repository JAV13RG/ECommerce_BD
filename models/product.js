const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nombre del producto
  description: { type: String }, // Descripción
  image: { type: String }, // URL de la imagen
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Poleras / Polerones
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }, // Piqué, Polo, etc.
  tags: [ String ] // Naruto, Shingeki, etc.
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);