import Order from "./Order.js";
import Cart from "../cart/Cart.js";
import CartService from "../cart/CartService.js";

class OrderService {

async createOrderFromCart(userId, cartNumber, deliveryAddress) {

    const cart = await Cart.findOne({
        user: userId,
        cartNumber,
        status: "unpaid"
    }).populate("products.product");

    if (!cart) {
        throw new Error("Корзина не найдена");
    }

    if (!cart.products.length) {
        throw new Error("Корзина пуста");
    }

    let total = 0;

    for (const item of cart.products) {
        total += item.product.price * item.quantity;
    }

    const order = await Order.create({
        user: userId,
        cartNumber,
        totalAmount: total,
        deliveryAddress,
        status: "paid"
    });

    await CartService.markAsPaid(userId, cartNumber);

    return this.getOrderWithCart(order._id);
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
    const order = await Order.findOne({
        _id: orderId,
        user: userId
    });

    if (!order) {
        throw new Error("Заказ не найден");
    }

    if (order.status !== "paid") {
        throw new Error(
            "Можно отменить только заказ со статусом 'paid'"
        );
    }

    order.status = "cancelled";

    await order.save();

    return order;
}
}

export default new OrderService();