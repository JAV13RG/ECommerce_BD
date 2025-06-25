const mongoose = require('mongoose');

// Estructura del modelo de orden
const orderSchema = new mongoose.Schema({
    // Referencia al usuario que realizó la orden
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            variant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: true }, // Referencia a la variante del producto
            quantity: { type: Number, required: true, min: 1 }, // Cantidad del producto
        }
    ],
    // Dirección de envío
    shippingAdress: {
        street : String,
        city: String,
        region: String,
        postalCode: String
    },
    // Precio total de la orden    
    totalPrice: {type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: ['Pendiente', 'En Proceso', 'Enviado', 'Cancelado'], // Estado de la orden
        default: 'Pendiente' // Estado por defecto
    }
}, { timestamps: true }); //crea campos de fecha de creación y actualización automáticamente

// Exporta el modelo de orden para su uso en otras partes de la aplicación
module.exports = mongoose.model('Order', orderSchema);