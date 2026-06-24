import Order from "./Order.js";
import Cart from "../cart/Cart.js";
import CartService from "../cart/CartService.js";

class OrderService {

    async createOrderFromCart(userId, productIds, deliveryAddress) {
        const cart = await Cart.findOne({
            user: userId,
            status: "active"
        }).populate("products.product");

        if (!cart) {
            throw new Error("Корзина не найдена");
        }

        if (!cart.products.length) {
            throw new Error("Корзина пуста");
        }

        const cartProductIds = cart.products.map(item => item.product._id.toString());
        const invalidProducts = productIds.filter(id => !cartProductIds.includes(id));

        if (invalidProducts.length) {
            throw new Error(`Товары с ID ${invalidProducts.join(', ')} не найдены в корзине`);
        }

        const allProductsSelected = cartProductIds.every(id => productIds.includes(id));

        const orderProducts = cart.products
            .filter(item => productIds.includes(item.product._id.toString()))
            .map(item => ({
                product: item.product._id,
                quantity: item.quantity
            }));

        if (!orderProducts.length) {
            throw new Error("Не выбрано ни одного товара для заказа");
        }

        let total = 0;
        for (const item of cart.products) {
            if (productIds.includes(item.product._id.toString())) {
                total += item.product.price * item.quantity;
            }
        }

        const cartNumber = cart.cartNumber;

        const order = await Order.create({
            user: userId,
            cartNumber: cartNumber,
            totalAmount: total,
            deliveryAddress,
            status: "pending",
            products: orderProducts
        });

        if (allProductsSelected) {

            const { oldCart, newCart } = await CartService.deactivateCartWithProducts(userId, cartNumber);
            
            return {
                order,
                oldCart: oldCart, 
                newCart: newCart, 
                message: "Все товары из корзины перенесены в заказ. Корзина деактивирована с сохранением товаров."
            };
        } else {

            await CartService.removeProductsFromCart(userId, productIds);
            
            const updatedCart = await CartService.getCart(userId);
            
            return {
                order,
                currentCart: updatedCart,
                message: "Выбранные товары перенесены в заказ. Остальные товары остались в корзине."
            };
        }
    }

    async getOrderWithCart(orderId) {
        const order = await Order.findById(orderId)
            .populate("user")
            .populate({
                path: "products.product",
                populate: [
                    { path: "category" },
                    { path: "characteristic" }
                ]
            });

        if (!order) {
            throw new Error("Заказ не найден");
        }

        const cart = await CartService.getCartByNumber(order.cartNumber);

        return {
            ...order.toObject(),
            cart: cart 
        };
    }

    async getOrdersByUser(userId) {
        const orders = await Order.find({ user: userId })
            .populate({
                path: "products.product",
                populate: [
                    { path: "category" },
                    { path: "characteristic" }
                ]
            })
            .sort({ createdAt: -1 });

        const ordersWithCart = await Promise.all(
            orders.map(async (order) => {
                const cart = await CartService.getCartByNumber(order.cartNumber);
                return {
                    ...order.toObject(),
                    cart: cart 
                };
            })
        );

        return ordersWithCart;
    }

    async getOrderById(orderId, userId) {
        const order = await Order.findById(orderId)
            .populate("user")
            .populate({
                path: "products.product",
                populate: [
                    { path: "category" },
                    { path: "characteristic" }
                ]
            });

        if (!order) throw new Error("Заказ не найден");
        if (order.user._id.toString() !== userId) throw new Error("Нет доступа");

        const cart = await CartService.getCartByNumber(order.cartNumber);

        return {
            ...order.toObject(),
            cart: cart 
        };
    }

    async getAllOrders() {
        const orders = await Order.find()
            .populate("user")
            .populate({
                path: "products.product",
                populate: [
                    { path: "category" },
                    { path: "characteristic" }
                ]
            })
            .sort({ createdAt: -1 });

        const ordersWithCart = await Promise.all(
            orders.map(async (order) => {
                const cart = await CartService.getCartByNumber(order.cartNumber);
                return {
                    ...order.toObject(),
                    cart: cart
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

        if (order.status !== "pending" && order.status !== "paid") {
            throw new Error(
                "Можно отменить только заказ со статусом 'pending' или 'paid'"
            );
        }

        order.status = "cancelled";
        await order.save();

        return order;
    }

    async payOrder(orderId, userId) {
        const order = await Order.findOne({
            _id: orderId,
            user: userId
        });

        if (!order) {
            throw new Error("Заказ не найден");
        }

        if (order.status !== "pending") {
            throw new Error("Можно оплатить только заказ со статусом 'pending'");
        }

        order.status = "paid";
        await order.save();

        return order;
    }
}

export default new OrderService();