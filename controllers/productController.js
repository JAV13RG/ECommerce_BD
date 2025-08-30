const upload = require('../middleware/uploadImage');
const Product = require('../models/product');
const Inventory = require('../models/inventory');
const ProductVariant = require('../models/productVariant');
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
    const { category, subcategory, tags, sortBy, sortOrder, page=1, limit=10} = req.query;

    // Filtros
    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (tags) filter.tags = { $in: tags.split(',') };

    // Ordenamiento
    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const skip = (Number(page) - 1) * Number(limit);

    // Búsqueda en DB con populate
    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    const withAvailability = await Promise.all(products.map(async (product) => {
      const sum = await Inventory.aggregate([
        { $match: { category: product.category._id, subcategory: product.subcategory._id } },
        { $group: { _id: null, totalStock: { $sum: '$stock' } } }
      ]);
      return {
        ...product.toObject(),
        totalAvailable: sum[0]?.totalStock || 0
      };
    }));

    res.json({
      products: withAvailability,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalProducts: total
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos', details: err });
  }
};

//Obtener un producto por id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('subcategory', 'name');
    
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    
    //Trae el inventario del producto (tallas y colores)
    const inventory = await Inventory.find({
      category: product.category._id,
      subcategory: product.subcategory._id
    }).populate('color', 'name');
    
    res.json({ product, inventory });

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

    //Eliminar las imagenes de Cloudinary
    for (const img of product.images) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    // Eliminar variantes asociadas
    await ProductVariant.deleteMany({ product: product._id });

    //Eliminar el producto de la base de datos
    await product.deleteOne();

    res.json({ message: 'Producto, imagenes y variantes eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto', error });
  }
};

//Subir la imagen y agregarla al producto
exports.addImagesToProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No se han subido imágenes' });
    }

    const uploadedImages = await Promise.all(
      req.files.map(file => uploadToCloudinary(file))
    );

    //validar limite de imágenes
    if (product.images.length + uploadedImages.length > 10) {
      return res.status(400).json({ message: 'No se pueden agregar más de 10 imágenes al producto' });
    }

    const imageData = uploadedImages.map(img => ({url: img.secure_url, publicId: img.public_id}));

    product.images.push(...imageData);
    await product.save();

    res.status(200).json({ message: 'Imágenes agregadas correctamente', images: product.images });
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

exports.deleteProductImage = async (req, res) => {
  try {
    const { productId, publicId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    // Buscar la imagen en el producto
    const imageToDelete = product.images.find(img => img.publicId === publicId);
    if (!imageToDelete) return res.status(404).json({ message: 'Imagen no encontrada en el producto' });

    // Eliminar la imagen de Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Eliminar la imagen del producto
    product.images = product.images.filter(img => img.publicId !== publicId);
    await product.save();

    res.status(200).json({ message: 'Imagen eliminada correctamente', images: product.images });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar imagen del producto', error });
  }
};