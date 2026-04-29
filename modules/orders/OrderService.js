import Order from "./Order.js";
import CartService from "../cart/CartService.js";

class OrderService {

    async createOrderFromCart(userId, deliveryAddress) {
        
        const cart = await CartService.getCart(userId);
        
        if (!cart || cart.products.length === 0) {
            throw new Error("Cart is empty");
        }

        const productsWithPrices = [];
        let total = 0;

        for (const item of cart.products) {
            const product = await item.product.populate("category characteristic");
            
            const price = product.price || 0; 
            const name = product.name;
            
            productsWithPrices.push({
                product: item.product._id,
                quantity: item.quantity,
                priceAtTime: price,
                nameAtTime: name
            });
            
            total += price * item.quantity;
        }

        const order = await Order.create({
            user: userId,
            products: productsWithPrices,
            totalAmount: total,
            deliveryAddress: deliveryAddress,
            status: "pending"
        });

        await CartService.clearCart(userId);

        return await Order.findById(order._id)
            .populate("user")
            .populate("products.product");
    }

    async getOrdersByUser(userId) {
        return await Order.find({ user: userId })
            .populate("products.product")
            .sort({ createdAt: -1 });
    }

    async getOrderById(orderId, userId) {
        const order = await Order.findById(orderId)
            .populate("user")
            .populate("products.product");
        
        if (!order) throw new Error("Order not found");
        if (order.user._id.toString() !== userId) throw new Error("Access denied");
        
        return order;
    }

    async getAllOrders(adminOnly = false) {
        return await Order.find()
            .populate("user")
            .populate("products.product")
            .sort({ createdAt: -1 });
    }

    async updateOrderStatus(orderId, status, userId, isAdmin = false) {
        const order = await Order.findById(orderId);
        if (!order) throw new Error("Order not found");
        
        if (!isAdmin && order.user.toString() !== userId) {
            throw new Error("Access denied");
        }
        
        order.status = status;
        await order.save();
        return order;
    }

    async cancelOrder(orderId, userId) {
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) throw new Error("Order not found");
        
        if (order.status !== "pending") {
            throw new Error("Only pending orders can be cancelled");
        }
        
        order.status = "cancelled";
        await order.save();
        return order;
    }
}

export default new OrderService();