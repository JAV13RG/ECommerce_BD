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

  colors: [// colores disponibles con stock
    {
      color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' },
      stock: { type: Number, default: 0 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

