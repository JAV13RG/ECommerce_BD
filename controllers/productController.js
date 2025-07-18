const upload = require('../middleware/uploadImage');
const Product = require('../models/product');
const { cloudinary, uploadToCloudinary } = require('../utils/cloudinary'); 

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
    const { category, subcategory, designType, tags, colors, disponible, sortBy, sortOrder, page, limit } = req.query;

    // Filtros
    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (designType) filter.designType = designType;
    if (tags) {
      const tagArray = tags.split(',');
      filter.tags = { $in: tagArray };
    }

    if (colors) {
      filter['colors.color'] = colors;
    }

    // Disponibilidad
    if (disponible == 'true') {
      filter['colors.stock'] = { $gt: 0 };
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
      .populate('colors.color', 'name')
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

//Subir la imagen y agregarla al producto
exports.addImagesToProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No se han subido imágenes' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const uploadedImages = await Promise.all(
      req.files.map(file => uploadToCloudinary(file))
    );

    if (product.images.length + uploadedImages.length > 10) {
      return res.status(400).json({ message: 'No se pueden agregar más de 10 imágenes' });
    }

    const imageUrls = uploadedImages.map(img => img.secure_url);

    product.images.push(...imageUrls);
    await product.save();

    res.status(200).json({
      message: 'Imágenes agregadas correctamente', 
      images: product.images
    });
    
  } catch (error) {
    console.error('Error al agregar imágenes al producto:', error);
    res.status(500).json({ message: 'Error al agregar imágenes al producto', details: error });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const imageUrl = require.file.path;
    res.status(200).json({ imageUrl })
  } catch {
    res.status(500).json({ message: 'Error al subir la imagen' })
  }
};

exports.removeImageFromProduct = async (req, res) => {
  const { productId, publicId } = req.params;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  product.images = product.images.filter(image => image.publicId !== publicId);
  await cloudinary.uploader.destroy(publicId);
  await product.save();

  res.status(200).json({ message: 'Imagen eliminada correctamente', product });
};