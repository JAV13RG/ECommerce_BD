const ProductVariant = require('../models/productVariant');

exports.createVariant = async (req, res, next) => {
  try {
    const { product, color, size, price, stock } = req.body;
    const newVariant = new ProductVariant({ product, color, size, price, stock });
    await newVariant.save();
    res.status(201).json(newVariant);
  } catch (error) {
    next(error);
  }
};