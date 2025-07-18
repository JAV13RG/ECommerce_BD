const mongoose = require('mongoose');

function arrayLimit(val) {
  return val.length <= 10; // Limita el número de imágenes a 10
}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nombre del producto
  description: { type: String }, // Descripción
  price: { type: Number, required: true }, // Precio
  images: {
    type: [String], // Array de URLs de imágenes
    validate: [arrayLimit, '{PATH} exceeds the limit of 10 images']
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Poleras / Polerones
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }, // Piqué, Polo, etc.
  designType: { type: String }, // anime, caricatura, dibujo...
  tags: [String], // Naruto, Shingeki, etc.
  colors: [
    {
      color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color'
      }, // Colores disponibles (visual)
      stock: {
        type: Number,
        required: true,
        min: 0
      }
    }], // Stock del producto
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);