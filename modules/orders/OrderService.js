import Order from "./Order.js";
import Cart from "../cart/Cart.js";
import CartService from "../cart/CartService.js";

class OrderService {

    async createOrderFromCart(userId, cartNumber, deliveryAddress) {
        if (!cartNumber) {
            throw new Error("Номер корзины обязателен");
        }

        const cart = await Cart.findOne({ 
            cartNumber: cartNumber,  
            user: userId 
        }).populate("products.product");
        
        if (!cart) {
            throw new Error("Корзина не найдена или не принадлежит пользователю");
        }

        if (cart.products.length === 0) {
            throw new Error("Корзина пуста");
        }

        let total = 0;
        for (const item of cart.products) {
            const product = item.product;
            if (!product) {
                throw new Error(`Товар с ID ${item.product} не найден`);
            }
            total += (product.price || 0) * item.quantity;
        }

        const order = await Order.create({
            user: userId,
            cartNumber: cartNumber,  
            totalAmount: total,
            deliveryAddress: deliveryAddress,
            status: "pending"
        });

        cart.products = [];
        await cart.save();

        return await this.getOrderWithCart(order._id);
    }

    async getOrderWithCart(orderId) {
        const order = await Order.findById(orderId)
            .populate("user");
        
        if (!order) {
            throw new Error("Заказ не найден");
        }

        const cart = await Cart.findOne({ 
            cartNumber: order.cartNumber 
        }).populate({
            path: "products.product",
            populate: [
                { path: "category" },
                { path: "characteristic" }
            ]
        });

        return {
            ...order.toObject(),
            products: cart ? cart.products : []
        };
    }

    async getOrdersByUser(userId) {
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 });
        
        const ordersWithCart = await Promise.all(
            orders.map(async (order) => {
                const cart = await Cart.findOne({ 
                    cartNumber: order.cartNumber 
                }).populate("products.product");
                
                return {
                    ...order.toObject(),
                    products: cart ? cart.products : []
                };
            })
        );
        
        return ordersWithCart;
    }

    async getOrderById(orderId, userId) {
        const order = await Order.findById(orderId)
            .populate("user");
        
        if (!order) throw new Error("Заказ не найден");
        if (order.user._id.toString() !== userId) throw new Error("Нет доступа");
        
        const cart = await Cart.findOne({ 
            cartNumber: order.cartNumber 
        }).populate("products.product");
        
        return {
            ...order.toObject(),
            products: cart ? cart.products : []
        };
    }

    async getAllOrders(adminOnly = false) {
        const orders = await Order.find()
            .populate("user")
            .sort({ createdAt: -1 });
        
        const ordersWithCart = await Promise.all(
            orders.map(async (order) => {
                const cart = await Cart.findOne({ 
                    cartNumber: order.cartNumber 
                }).populate("products.product");
                
                return {
                    ...order.toObject(),
                    products: cart ? cart.products : []
                };
            })
        );
        
        return ordersWithCart;
    }

    async updateOrderStatus(orderId, status, userId, isAdmin = false) {
        const order = await Order.findById(orderId);
        if (!order) throw new Error("Заказ не найден");
        
        if (!isAdmin && order.user.toString() !== userId) {
            throw new Error("Нет доступа");
        }
        
        const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            throw new Error("Некорректный статус");
        }
        
        order.status = status;
        await order.save();
        return order;
    }

    async cancelOrder(orderId, userId) {
        const order = await Order.findOne({ _id: orderId, user: userId });
        if (!order) throw new Error("Заказ не найден");
        
        if (order.status !== "pending") {
            throw new Error("Можно отменить только заказ в статусе 'pending'");
        }
        
        order.status = "cancelled";
        await order.save();
        return order;
    }
}

export default new OrderService();