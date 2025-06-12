const mongoose = require('mongoose');

// Estructura del modelo de orden
const orderSchema = new mongoose.Schema({
    // Referencia al usuario que realizó la orden
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        // Referencia al producto
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        // Cantidad del producto en la orden
        quantity: {
            type: Number,
            required: true,
            min: 1 // La cantidad debe ser al menos 1
        }
    }
    ],
    // Precio total de la orden    
    totalPrice: {
        type: Number,
        required: true,
        min: 0 // El precio total no puede ser negativo
    },
    status: {
        type: String,
        enum: ['Pendiente', 'En Proceso', 'Enviado', 'Cancelado'], // Estado de la orden
        default: 'Pendiente' // Estado por defecto
    }
}, { timestamps: true }); //crea campos de fecha de creación y actualización automáticamente

// Exporta el modelo de orden para su uso en otras partes de la aplicación
module.exports = mongoose.model('Order', orderSchema);