const Order = require('../models/order');
const Product = require('../models/product');

//Crear un nuevo pedido
exports.createOrder = async (req, res) => {
    try {
        const user = req.user._id;
        const { product, shippingAdress } = req.body;

        if (
            !shippingAdress ||
            !shippingAdress.street ||
            !shippingAdress.city ||
            !shippingAdress.region ||
            !shippingAdress.postalCode
        ) {
            return res.status(400).json({ message: 'Datos de envío no proporcionados' });
        }

        let totalPrice = 0;
        const validatedProducts = [];

        for (const item of product) {
            const { product: productId, quantity, type, color, size } = item;

            const dbProduct = await Product.findById(productId);
            if (!dbProduct) return res.status(404).json({ message: 'Producto no encontrado' });

            const inventory = await inventoryItem.findOne({ type, color, size });

            if (!inventory || inventory.stock < quantity) {
                return res.status(400).json({ message: `No hay stock para ${type} ${color} ${size}` });
            }
        }

        // Descontar stock
        inventory.stock -= quantity;
        await inventory.save();

        validatedProducts.push({
            product: dbProduct._id,
            quantity
        });

        totalPrice += dbProduct.price * quantity;

        const newOrder = new Order({
            user,
            products: validatedProducts,
            shippingAdress,
            totalPrice,
            status: 'pending'
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {}
};

// Obtener todos los pedidos (admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('products.product', 'name price');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
};

//(PUT) -> Actualizar el estado de un pedido
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del pedido', error });
    }
};

// Obtener los pedidos de un usuario
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products.product', 'name price image')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
};

exports.markOrderAsPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

        order.isPaid = true;
        order.paidAt = new Date.now();

        const updated = await order.save();
        res.json({ message: 'Pedido marcado como pagado', order: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error al marcar el pedido como pagado', error });
    }
};

