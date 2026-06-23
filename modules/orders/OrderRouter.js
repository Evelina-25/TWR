import Router from "express";
import OrderController from "./OrderController.js";
import authMiddleware from "../../Midleware/authMiddleware.js";
import roleMiddleware from "../../Midleware/roleMiddleware.js";

const router = new Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Создать заказ из корзины
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryAddress
 *               - cartNumber
 *             properties:
 *               cartNumber:
 *                 type: string
 *                 description: Номер корзины (например, CART-A3F7D9E1)
 *                 example: "CART-A3F7D9E1"
 *               deliveryAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "ул. Пушкина 10"
 *                   city:
 *                     type: string
 *                     example: "Москва"
 *                   postalCode:
 *                     type: string
 *                     example: "101000"
 *                   phone:
 *                     type: string
 *                     example: "+79001234567"
 *     responses:
 *       201:
 *         description: Заказ создан
 *       400:
 *         description: Ошибка валидации (не передан cartNumber или корзина пуста)
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Корзина не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.post("/", authMiddleware, OrderController.create);

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Получить мои заказы (текущего пользователя)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список заказов пользователя
 *       401:
 *         description: Не авторизован
 */
router.get("/my", authMiddleware, OrderController.getMyOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Получить заказ по ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID заказа
 *         example: "67a9fb80ef47f94ced13dd5d"
 *     responses:
 *       200:
 *         description: Информация о заказе
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет доступа (заказ принадлежит другому пользователю)
 *       404:
 *         description: Заказ не найден
 */
router.get("/:id", authMiddleware, OrderController.getOrderById);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Отменить заказ (только если статус pending)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID заказа для отмены
 *         example: "67a9fb80ef47f94ced13dd5d"
 *     responses:
 *       200:
 *         description: Заказ отменен
 *       400:
 *         description: Заказ нельзя отменить (статус не pending)
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Заказ не найден
 */
router.put("/:id/cancel", authMiddleware, OrderController.cancelOrder);

/**
 * @swagger
 * /api/orders/admin/all:
 *   get:
 *     summary: Получить все заказы всех пользователей (только ADMIN)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список всех заказов
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет доступа (требуется роль ADMIN)
 */
router.get("/admin/all", authMiddleware, roleMiddleware("ADMIN"), OrderController.getAllOrders);

/**
 * @swagger
 * /api/orders/admin/{id}/status:
 *   put:
 *     summary: Изменить статус заказа (только ADMIN)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID заказа
 *         example: "67a9fb80ef47f94ced13dd5d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, delivered, cancelled]
 *                 example: "shipped"
 *                 description: Новый статус заказа
 *     responses:
 *       200:
 *         description: Статус обновлен
 *       400:
 *         description: Некорректный статус
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет доступа (требуется роль ADMIN)
 *       404:
 *         description: Заказ не найден
 */
router.put("/admin/:id/status", authMiddleware, roleMiddleware("ADMIN"), OrderController.updateStatus);

export default router;