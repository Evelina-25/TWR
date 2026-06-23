import Cart from "./Cart.js";
import { v4 as uuidv4 } from 'uuid'; 

class CartService {

    generateCartNumber() {
        return `CART-${uuidv4()}`;
    }

    async createCart(userId) {
        const cartNumber = this.generateCartNumber();
        console.log("Создание корзины с номером:", cartNumber); 
        
        return await Cart.create({
            cartNumber: cartNumber,
            user: userId,
            products: []
        });
    }

    async addToCart(userId, productId) {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await this.createCart(userId); 
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

    async getCartByNumber(cartNumber) {
        return await Cart.findOne({ cartNumber })
            .populate({
                path: "products.product",
                populate: [
                    { path: "category" },
                    { path: "characteristic" }
                ]
            });
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

        if (!cart) {
            throw new Error("Корзина не найдена");
        }

        cart.products = cart.products.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        return cart;
    }

    async clearCart(userId) {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            throw new Error("Корзина не найдена");
        }

        cart.products = [];
        await cart.save();
        return cart;
    }
}

export default new CartService();