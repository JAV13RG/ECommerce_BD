const Product = require('../models/product');

// POST: Crear un nuevo producto
exports.getAllProducts = async (req, res) => {
  try {
    const { category, designType, tags, sortBy, sortOrder, page, limit } = req.query;

    const filter = {};

    // Filtros
    if (category) filter.category = category;
    if (designType) filter.designType = designType;
    if (tags) {
      const tagArray = tags.split(',');
      filter.tags = { $in: tagArray };
    }

    // Ordenamiento
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Paginación
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Búsqueda en DB
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      totalProducts: total
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos', details: err });
  }
};


//CRUD
//Obtener un producto por id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto', error });
  }
};

//Actualizar un producto
exports.updateProduct = async (req, res) => {
  const { name, description, price, image, category, designType, tags, stock } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.designType = designType || product.designType;
    product.tags = tags || product.tags;
    product.stock = stock ?? product.stock;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto', error });
  }
};

//Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    await product.remove();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto', error });
  }
};