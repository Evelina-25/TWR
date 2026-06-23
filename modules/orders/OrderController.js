import OrderService from "./OrderService.js";

class OrderController {

    async create(req, res) {
        try {
            const { deliveryAddress, cartNumber } = req.body; 
            const order = await OrderService.createOrderFromCart(
                req.user.id,
                cartNumber,  
                deliveryAddress
            );
            return res.status(201).json(order);
        } catch (e) {
            res.status(500).json({ error: e.message });
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
}

export default new OrderController();