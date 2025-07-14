const Product = require('../models/product');
const cloudinary = require('../utils/cloudinary');

//Crear un nuevo producto
exports.createProduct = async (req, res) => {

  try {
    const { name, description, price, image, category, subcategory, designType, tags, colors } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category,
      subcategory,
      designType,
      tags,
      colors
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto', details: error });
  }
};

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const { category, subcategory, tags, sortBy, sortOrder, page, limit } = req.query;

    // Filtros
    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
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

    // Búsqueda en DB con populate
    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('subcategory', 'name')
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
    console.error('Error en getAllProducts:', err);
    res.status(500).json({ error: 'Error al obtener productos', details: err.message });
  }
};

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
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const { name, description, price, image, category, subcategory, designType, tags, colors } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.designType = designType || product.designType;
    product.tags = tags || product.tags;
    product.colors = colors || product.colors;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto', details: error });
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

//Subir imagen
exports.uploadImage = async (req, res) => {
  console.log('Archivo recibido:', req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    const imageUrl = req.file.path;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ error: 'Error interno', details: error });
  }
};

//Agregar imagenes a un producto
exports.addImagesToProduct = async (req, res) => {
  try {
    const { id } = req.params;

    //Buscar el producto por su id
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({error: "Producto no encontrado"});

    //Verificar si los archivos fueron recibidos
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: 'No se ha subido ninguna imagen' });

    //Obtener las URLs de las imágenes subidas
    const imageUrls = req.files.map(file => file.path);

    //Agregar imagenes al array existente del producto
    product.image.push(...imageUrls);
    await product.save();

    res.json({ message: 'Imagenes agregadas correctamente', image: product.images });
  } catch {
    console.error("Error al subir las imagenes");
    res.status(500).json({ error: 'Error interno', details: error });
  }
};