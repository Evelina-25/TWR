import Cart from "./Cart.js";
import { v4 as uuidv4 } from "uuid";

export const CART_STATUSES = {
    active: "active",
    inactive: "inactive"
};

class CartService {

    generateCartNumber() {
        return `CART-${uuidv4()}`;
    }

    async createCart(userId) {
        return await Cart.create({
            cartNumber: this.generateCartNumber(),
            user: userId,
            status: CART_STATUSES.active,
            products: []
        });
    }

    async getOrCreateCart(userId) {
        let cart = await Cart.findOne({
            user: userId,
            status: CART_STATUSES.active
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
            status: CART_STATUSES.active
        }).populate({
            path: "products.product",
            populate: [
                { path: "category" },
                { path: "characteristic" }
            ]
        });
    }

    async getCartWithProducts(userId) {
        return await Cart.findOne({
            user: userId,
            status: CART_STATUSES.active
        }).populate({
            path: "products.product",
            populate: [
                { path: "category" },
                { path: "characteristic" }
            ]
        });
    }

    async getCartByNumber(cartNumber) {
        return await Cart.findOne({
            cartNumber
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
            status: CART_STATUSES.active
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
            status: CART_STATUSES.active
        });

        if (!cart) {
            throw new Error("Корзина не найдена");
        }

        cart.products = [];

        await cart.save();

        return cart;
    }

    async markAsInactive(userId, cartNumber) {
        const cart = await Cart.findOne({
            user: userId,
            cartNumber,
            status: CART_STATUSES.active
        });

        if (!cart) {
            throw new Error("Корзина не найдена");
        }

        cart.status = CART_STATUSES.inactive;

        await cart.save();

        const newCart = await this.createCart(userId);

        return { oldCart: cart, newCart };
    }

    async deactivateCartWithProducts(userId, cartNumber) {
        const cart = await Cart.findOne({
            user: userId,
            cartNumber,
            status: CART_STATUSES.active
        });

        if (!cart) {
            throw new Error("Корзина не найдена");
        }

        cart.status = CART_STATUSES.inactive;
        await cart.save();

        const newCart = await this.createCart(userId);

        return { oldCart: cart, newCart };
    }

    async removeProductsFromCart(userId, productIds) {
        const cart = await Cart.findOne({
            user: userId,
            status: CART_STATUSES.active
        });

        if (!cart) {
            throw new Error("Корзина не найдена");
        }

        cart.products = cart.products.filter(
            item => !productIds.includes(item.product.toString())
        );

        await cart.save();

        if (cart.products.length === 0) {
            await this.deactivateCartWithProducts(userId, cart.cartNumber);
        }

        return cart;
    }

    async getAllUserCarts(userId) {
        return await Cart.find({
            user: userId
        }).sort({ createdAt: -1 }).populate({
            path: "products.product",
            populate: [
                { path: "category" },
                { path: "characteristic" }
            ]
        });
    }
}

export default new CartService();