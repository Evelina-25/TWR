import Router from "express";
import OrderController from "./OrderController.js";
import authMiddleware from "../../Midleware/authMiddleware.js";
import roleMiddleware from "../../Midleware/roleMiddleware.js";

const router = new Router();

/**
 * @swagger
 * /api/orders/cart:
 *   get:
 *     summary: Получить текущую активную корзину для выбора товаров в заказ
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Активная корзина с товарами для выбора
 */
router.get("/cart", authMiddleware, OrderController.getCartForOrder);

/**
 * @swagger
 * /api/orders/carts/all:
 *   get:
 *     summary: Получить все корзины пользователя (активные и неактивные)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Все корзины пользователя
 */
router.get("/carts/all", authMiddleware, OrderController.getAllUserCarts);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Создать заказ из выбранных товаров корзины
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
 *               - productIds
 *               - deliveryAddress
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Массив ID товаров из корзины для заказа
 *                 example: ["67a9fb80ef47f94ced13dd5d", "67a9fb80ef47f94ced13dd5e"]
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
 *         description: Заказ создан со статусом "pending"
 *       400:
 *         description: Ошибка валидации
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
 *         description: Нет доступа
 *       404:
 *         description: Заказ не найден
 */
router.get("/:id", authMiddleware, OrderController.getOrderById);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Отменить заказ (только если статус pending или paid)
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
 *         description: Заказ нельзя отменить
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
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Оплатить заказ (изменить статус с pending на paid)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID заказа для оплаты
 *         example: "67a9fb80ef47f94ced13dd5d"
 *     responses:
 *       200:
 *         description: Заказ успешно оплачен
 *       400:
 *         description: Заказ нельзя оплатить
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет доступа
 *       404:
 *         description: Заказ не найден
 */
router.put("/:id/pay", authMiddleware, OrderController.payOrder);

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
 *         description: Нет доступа
 *       404:
 *         description: Заказ не найден
 */
router.put("/admin/:id/status", authMiddleware, roleMiddleware("ADMIN"), OrderController.updateStatus);

export default router;