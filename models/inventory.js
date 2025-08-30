const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true},
    size : { type: String, enum: ['S', 'M', 'L', 'XL'], required: true },
    color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color', required: true },
    stock : {type: Number, default: 0, min: 0}
}, { timestamps: true });