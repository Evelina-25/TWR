import Router from "express";
import ProductController from "./ProductController.js";
import authMiddleware from "../../Midleware/authMiddleware.js";
import roleMiddleware from "../../Midleware/roleMiddleware.js";

const router = new Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 */
router.get("/", ProductController.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить один товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Информация о товаре
 *       404:
 *         description: Товар не найден
 */
router.get("/:id", ProductController.getOne);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               quantity:
 *                 type: number
 *               categoryId:
 *                 type: string
 *                 description: ID категории товара
 *               characteristicId:
 *                 type: string
 *                 description: ID характеристики товара
 *             required:
 *               - name
 *               - price
 *               - description
 *               - quantity
 *               - categoryId
 *     responses:
 *       201:
 *         description: Товар создан
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    ProductController.create
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Обновить существующий товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               quantity:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               characteristicId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Товар обновлён
 *       404:
 *         description: Товар не найден
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    ProductController.update
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Товар удалён
 *       404:
 *         description: Товар не найден
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    ProductController.delete
);

export default router;