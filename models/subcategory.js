const mongoose = require('mongoose');
const category = require('./category');

const subcategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('subcategory', subcategorySchema);