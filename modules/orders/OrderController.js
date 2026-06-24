import OrderService from "./OrderService.js";
import CartService from "../cart/CartService.js";

class OrderController {

    async create(req, res) {
        try {
            const { productIds, deliveryAddress } = req.body;

            if (!productIds || !Array.isArray(productIds) || !productIds.length) {
                return res.status(400).json({ 
                    error: "Необходимо указать массив productIds с ID товаров для заказа" 
                });
            }

            if (!deliveryAddress) {
                return res.status(400).json({ 
                    error: "Необходимо указать адрес доставки" 
                });
            }

            const result = await OrderService.createOrderFromCart(
                req.user.id,
                productIds,
                deliveryAddress
            );

            return res.status(201).json(result);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async getMyOrders(req, res) {
        try {
            const orders = await OrderService.getOrdersByUser(req.user.id);
            return res.json(orders);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await OrderService.getOrderById(req.params.id, req.user.id);
            return res.json(order);
        } catch (e) {
            res.status(404).json({ error: e.message });
        }
    }

    async cancelOrder(req, res) {
        try {
            const order = await OrderService.cancelOrder(req.params.id, req.user.id);
            return res.json(order);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async getAllOrders(req, res) {
        try {
            const orders = await OrderService.getAllOrders();
            return res.json(orders);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ error: "Необходимо указать статус" });
            }

            const order = await OrderService.updateOrderStatus(
                req.params.id,
                status,
                req.user.id,
                true
            );
            return res.json(order);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async getCartForOrder(req, res) {
        try {
            const cart = await CartService.getCart(req.user.id);
            return res.json(cart);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async getAllUserCarts(req, res) {
        try {
            const carts = await CartService.getAllUserCarts(req.user.id);
            return res.json(carts);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async payOrder(req, res) {
        try {
            const order = await OrderService.payOrder(req.params.id, req.user.id);
            return res.json({ 
                message: "Заказ успешно оплачен",
                order 
            });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
}

export default new OrderController();