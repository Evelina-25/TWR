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
 *             properties:
 *               deliveryAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   phone:
 *                     type: string
 *     responses:
 *       201:
 *         description: Заказ создан
 */
router.post("/", authMiddleware, OrderController.create);

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Получить мои заказы
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
 */
router.get("/:id", authMiddleware, OrderController.getOrderById);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Отменить заказ (только pending)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id/cancel", authMiddleware, OrderController.cancelOrder);

// АДМИНСКИЕ ЭНДПОИНТЫ (только для роли ADMIN)
/**
 * @swagger
 * /api/orders/admin/all:
 *   get:
 *     summary: Все заказы (админ)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.get("/admin/all", authMiddleware, roleMiddleware("ADMIN"), OrderController.getAllOrders);

/**
 * @swagger
 * /api/orders/admin/{id}/status:
 *   put:
 *     summary: Сменить статус заказа (админ)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, delivered, cancelled]
 */
router.put("/admin/:id/status", authMiddleware, roleMiddleware("ADMIN"), OrderController.updateStatus);

export default router;