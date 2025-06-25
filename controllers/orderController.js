const Order = require('../models/order');
const ProductVariant = require('../models/productVariant');

//Crear un nuevo pedido
exports.createOrder = async (req, res) => {
    try {
        const user = req.user._id;
        const { products, shippingAdress } = req.body;

        // Validaciones
        if (!products || !products.length) {
            return res.status(400).json({ message: 'El pedido debe contener al menos un producto' });
        }
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

        for (const item of products) {
            const { variant, quantity } = item;

            const dbVariant = await ProductVariant.findById(variant);
            if (!dbVariant) return res.status(404).json({ message: 'Variante del producto no encontrado' });

            if (dbVariant.stock < quantity) {
                return res.status(400).json({ message: `No hay stock para ${type} ${color} ${size}` });
            }

            // Descontar stock
            dbVariant.stock -= quantity;
            await dbVariant.save();

            validatedProducts.push({
                variant: dbVariant._id,
                quantity
            });

            totalPrice += dbVariant.price * quantity;
        }

        const newOrder = new Order({
            user,
            products: validatedProducts,
            shippingAdress,
            totalPrice
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ message: 'Error al crear el pedido', error });
    }
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

