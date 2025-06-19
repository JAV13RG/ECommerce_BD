const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nombre del producto
  description: { type: String }, // Descripción
  price: { type: Number, required: true }, // Precio
  image: { type: String }, // URL de la imagen
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Poleras / Polerones
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }, // Piqué, Polo, etc.
  designType: { type: String }, // anime, caricatura, dibujo...
  tags: [String], // Naruto, Shingeki, etc.
  colors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Color' }], // Colores disponibles (visual)
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);