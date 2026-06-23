import Cart from "./Cart.js";
import { v4 as uuidv4 } from "uuid";

export const CART_STATUSES = {
    UNPAID: "unpaid",
    PAID: "paid"
};

class CartService {

    generateCartNumber() {
        return `CART-${uuidv4()}`;
    }

    async createCart(userId) {
        return await Cart.create({
            cartNumber: this.generateCartNumber(),
            user: userId,
            status: CART_STATUSES.UNPAID,
            products: []
        });
    }

    async getOrCreateCart(userId) {
        let cart = await Cart.findOne({
            user: userId,
            status: CART_STATUSES.UNPAID
        });

        if (!cart) {
            cart = await this.createCart(userId);
        }

        return cart;
    }

    async addToCart(userId, productId) {
        const cart = await this.getOrCreateCart(userId);

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

        return this.getCart(userId);
    }

    async getCart(userId) {
        return await Cart.findOne({
            user: userId,
            status: CART_STATUSES.UNPAID
        }).populate({
            path: "products.product",
            populate: [
                { path: "category" },
                { path: "characteristic" }
            ]
        });
    }

    async removeFromCart(userId, productId) {
        const cart = await Cart.findOne({
            user: userId,
            status: CART_STATUSES.UNPAID
        });

        if (!cart) {
            throw new Error("Корзина не найдена");
        }

        cart.products = cart.products.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        return this.getCart(userId);
    }

    async clearCart(userId) {
        const cart = await Cart.findOne({
            user: userId,
            status: CART_STATUSES.UNPAID
        });

        if (!cart) {
            throw new Error("Корзина не найдена");
        }

        cart.products = [];

        await cart.save();

        return cart;
    }

    async markAsPaid(userId, cartNumber) {
        const cart = await Cart.findOne({
            user: userId,
            cartNumber,
            status: CART_STATUSES.UNPAID
        });

        if (!cart) {
            throw new Error("Корзина не найдена");
        }

        cart.status = CART_STATUSES.PAID;

        await cart.save();

        await this.createCart(userId);

        return cart;
    }
}

export default new CartService();