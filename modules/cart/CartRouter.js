import Router from "express";
import CartController from "./CartController.js";
import authMiddleware from "../../Midleware/authMiddleware.js";

const router = new Router();

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Добавить продукт в корзину
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID продукта
 *               quantity:
 *                 type: number
 *                 default: 1
 *             required:
 *               - productId
 *     responses:
 *       200:
 *         description: Продукт успешно добавлен в корзину
 */
router.post("/add", authMiddleware, CartController.add);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Получить корзину пользователя
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Корзина пользователя
 */
router.get("/", authMiddleware, CartController.get);

/**
 * @swagger
 * /api/cart/remove:
 *   delete:
 *     summary: Удалить продукт из корзины
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID продукта для удаления
 *             required:
 *               - productId
 *     responses:
 *       200:
 *         description: Продукт удалён из корзины
 */
router.delete("/remove", authMiddleware, CartController.remove);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Очистить корзину
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Корзина очищена
 */
router.delete("/clear", authMiddleware, CartController.clear);

/**
 * @swagger
 * /api/cart/id:
 *   get:
 *     summary: Получить ID корзины текущего пользователя (MongoDB _id)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ID корзины
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartId:
 *                   type: string
 *                   example: "67a9fb80ef47f94ced13dd5f"
 */
router.get("/id", authMiddleware, CartController.getCartId);

/**
 * @swagger
 * /api/cart/number:
 *   get:
 *     summary: Получить номер корзины текущего пользователя (human-readable)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Номер корзины
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cartNumber:
 *                   type: string
 *                   example: "CART-A3F7D9E1"
 *                 cartId:
 *                   type: string
 *                   example: "67a9fb80ef47f94ced13dd5f"
 */
router.get("/number", authMiddleware, CartController.getCartNumber);

/**
 * @swagger
 * /api/cart/by-number/{cartNumber}:
 *   get:
 *     summary: Получить корзину по номеру
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: Номер корзины (например, CART-A3F7D9E1)
 *     responses:
 *       200:
 *         description: Корзина найдена
 *       404:
 *         description: Корзина не найдена
 */
router.get("/by-number/:cartNumber", authMiddleware, CartController.getByNumber);

export default router;