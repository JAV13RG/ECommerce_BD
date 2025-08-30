const Order = require('../models/order');
const Product = require('../models/product');
const inventoryItem = require('../models/inventoryItem');
const Inventory = require('../models/inventory');

//Crear un nuevo pedido
exports.createOrder = async (req, res) => {
    try {
        const user = req.user._id;
        const { items, shippingAdress } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            const error = new Error('El pedido debe contener al menos un item');
            error.status = 400;
            throw error;
        }

        if (
            !shippingAdress ||
            !shippingAdress.street ||
            !shippingAdress.city ||
            !shippingAdress.region ||
            !shippingAdress.postalCode
        ) {
            const error = new Error('La direccion de envio no puede estar incompleta o vacia');
            error.status = 400;
            throw error;
        }

        let totalPrice = 0;
        const lines = [];
        //Se guarda lo que se va descontando para poder revertir si falla algo
        const decremented = []; //[{ inventoryId, quantity }]

        for (const it of items) {
            const { product: productId, size, color, quantity } = it;

            // 1. Producto vendible
            const prod = await Product.findById(productId);
            if (!prod) {
                const error = new Error('Producto no encontrado');
                error.statusCode = 404;
                //rollback (no hay nada que revertir si es el primero)
                throw error;
            }

            // 2. Descuento de stock en base a la combinacion 
            // Stock >= quantity para no dejar stock negativo
            const inv = await Inventory.findOneAndUpdate(
                {
                    category: prod.category,
                    subcategory: prod.subcategory,
                    size,
                    color, 
                    stock: { $gte: quantity }
                },
                { $inc: { stock: -quantity } },
                { new: true } //devuelve el objeto modificado
            );

            if (!inv) {
                // Revertir lo previamente descontado
                for (const d of decremented) {
                    try {
                        await Inventory.findByIdAndUpdate(d.inventoryId, { $inc: { stock: d.quantity } });
                    } catch {
                        console.error('Error revertiendo stock', d);
                    }
                }
                const error = new Error(
                    `Sin stock suficiente para el producto ${prod.name} (talla ${size}, color ${color})`
                );
                error.statusCode = 400;
                throw error;
            }

            //Registrar lo descontado (para potencial rollback)
            decremented.push({ inventoryId: inv._id, quantity });

            // 3. Calcular el precio con el pedido del momento
            totalPrice += prod.price * quantity;

            //4. Linea con el snapshot (+ name y price)
            lines.push({
                product: prod._id,
                name: prod.name,
                price: prod.price,
                size,
                color, //ObjectId del color
                quantity
            });
        }

        // 5. Crear la orden
        const order = new Order({
            user,
            products: lines,
            shippingAdress,
            totalPrice
            //Status es por default 'pending'
        });

        let saveOrder;
        try {
            saveOrder = await order.save();
        } catch (saveError) {
            // Si el guardar la orden falla, se revierten los descuentos
            for (const d of decremented) {
                try {
                    await Inventory.findByIdAndUpdate(d.inventoryId, { $inc: { stock: d.quantity } });
                } catch (_) {
                    console.error('Error revertiendo stock', d);
                }
            }
            throw saveError;
        }

        res.status(201).json(saveOrder);
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

