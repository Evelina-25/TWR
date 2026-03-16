import Cart from "./Cart.js";

class CartService {

    async addToCart(userId, productId) {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                products: []
            });
        }

        const productIndex = cart.products.findIndex(
            item => item.product.toString() === productId
        );

        if (productIndex > -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        await cart.save();
        return cart;
    }

async getCart(userId) {
    return await Cart.findOne({ user: userId })
        .populate({
            path: "products.product",
            populate: [
                { path: "category" },
                { path: "characteristic" }
            ]
        });
}

    async removeFromCart(userId, productId) {
        const cart = await Cart.findOne({ user: userId });

        cart.products = cart.products.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        return cart;
    }

    async clearCart(userId) {
        const cart = await Cart.findOne({ user: userId });

        cart.products = [];

        await cart.save();
        return cart;
    }
}

export default new CartService();