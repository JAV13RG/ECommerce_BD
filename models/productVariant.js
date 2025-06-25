const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // referencia al diseño
  color:   { type: mongoose.Schema.Types.ObjectId, ref: 'Color', required: true },
  size:    { type: String, enum: ['S', 'M', 'L', 'XL'], required: true },
  price:   { type: Number, required: true },   // precio de esta variante
  stock:   { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ProductVariant', productVariantSchema);