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

export default router;