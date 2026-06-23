import CartService from "./CartService.js";

class CartController {

    async add(req, res) {
        try {
            const { productId } = req.body;
            
            if (!productId) {
                return res.status(400).json({ error: "productId обязателен" });
            }
            
            const cart = await CartService.addToCart(
                req.user.id,
                productId
            );
            return res.json(cart);
        } catch (e) {
            console.error("Ошибка при добавлении в корзину:", e); 
            res.status(500).json({ error: e.message });
        }
    }

    async get(req, res) {
        try {
            const cart = await CartService.getCart(req.user.id);
            return res.json(cart);
        } catch (e) {
            res.status(500).json(e.message);
        }
    }

    async remove(req, res) {
        try {
            const { productId } = req.body;
            const cart = await CartService.removeFromCart(
                req.user.id,
                productId
            );
            return res.json(cart);
        } catch (e) {
            res.status(500).json(e.message);
        }
    }

    async clear(req, res) {
        try {
            const cart = await CartService.clearCart(req.user.id);
            return res.json(cart);
        } catch (e) {
            res.status(500).json(e.message);
        }
    }

    async getCartId(req, res) {
        try {
            const cart = await CartService.getCart(req.user.id);
            if (!cart) {
                
                const newCart = await CartService.createCart(req.user.id);
                return res.json({ cartId: newCart._id });
            }
            return res.json({ cartId: cart._id });
        } catch (e) {
            res.status(500).json(e.message);
        }
    }

    async getByNumber(req, res) {
        try {
            const { cartNumber } = req.params;
            const cart = await CartService.getCartByNumber(cartNumber);
            
            if (!cart) {
                return res.status(404).json({ error: "Корзина не найдена" });
            }
            
            return res.json(cart);
        } catch (e) {
            res.status(500).json(e.message);
        }
    }

    
    async getCartNumber(req, res) {
        try {
            const cart = await CartService.getCart(req.user.id);
            
            if (!cart) {
                const newCart = await CartService.createCart(req.user.id);
                return res.json({ cartNumber: newCart.cartNumber });
            }
            
            return res.json({ 
                cartNumber: cart.cartNumber,
                cartId: cart._id 
            });
        } catch (e) {
            res.status(500).json(e.message);
        }
    }
}



export default new CartController();