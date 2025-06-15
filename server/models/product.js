const mongoose = require('mongoose');

//Estructura del modelo de producto
const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, //Nombre del producto
  description: { type: String }, //Descripción del producto
  price: { type: Number, required: true },  //Precio del producto
  image: { type: String }, //URL de la imagen del producto
  category: { type: String }, //Categoría principal del producto
  designType: { type: String }, //Tipo de diseño del producto(anime, caricatura, dibujo, etc.)
  tags: [String], //Etiquetas del producto (Naruto, Kimetsu, Shingeki, etc.)
  stock: { type: Number, default: 0 } //Cantidad en stock del producto
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
