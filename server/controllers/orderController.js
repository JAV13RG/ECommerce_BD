const Order = require('../models/order');
//Crear un nuevo pedido
exports.createOrder = async (req, res) => {
    const { products, shippingAdress } = req.body;

    //Validaciones
    if(!products || products.length === 0) {
        return res.status(400).json({ message: 'El pedido debe tener al menos un producto' });
    }

    if(
        !shippingAdress ||
        !shippingAdress.street ||
        !shippingAdress.city ||
        shippingAdress.region ||
        !shippingAdress.postalCode
    ) {
        return res.status(400).json({ message: 'La dirección de envío está incompleta' });
    }

    try {
        //Calculo dinamico de la totalidad del pedido
        let totalPrice = 0;
        for (const item of products) {
            const dbProduct = await Product.findById(item.product);
            if (!dbProduct) {
                return res.status(400).json({ message: `Producto con ID: ${item.product} no existe` });
            }

            totalPrice += dbProduct.price * item.quantity;
        }

        const newOrder = new Order({
            user: req.user._id, // Obtener el ID del usuario desde el middleware de autenticación
            products,
            totalPrice,
            shippingAdress
        });

        const savedOrder = await newOrder.save();

        //Buscar el pedido ya guardado (.populate)
        const populatedOrder = await Order.findById(savedOrder._id).populate('products.product', 'name price image');

        res.status(201).json(populatedOrder);
    } catch (error) {
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
        const orders = await Order.find({ user: req.user._id }).populate('products.product', 'name price image');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
};