import Router from "express";
import CategoryController from "./CategoryController.js";
import authMiddleware from "../../Midleware/authMiddleware.js";
import roleMiddleware from "../../Midleware/roleMiddleware.js";

const router = new Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Получить список категорий
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список категорий
 */
router.get("/", CategoryController.getAll);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Получить категорию по ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID категории
 *     responses:
 *       200:
 *         description: Информация о категории
 *       404:
 *         description: Категория не найдена
 */
router.get("/:id", CategoryController.getOne);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Создать новую категорию
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название категории
 *               description:
 *                 type: string
 *                 description: Описание категории
 *               parentCategory:
 *                 type: string
 *                 description: ID родительской категории
 *             required:
 *               - name
 *               - description
 *     responses:
 *       201:
 *         description: Категория создана
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    CategoryController.create
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Обновить категорию
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID категории
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               parentCategory:
 *                 type: string
 *                 description: ID родительской категории
 *     responses:
 *       200:
 *         description: Категория обновлена
 *       404:
 *         description: Категория не найдена
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    CategoryController.update
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Удалить категорию
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID категории
 *     responses:
 *       200:
 *         description: Категория удалена
 *       404:
 *         description: Категория не найдена
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    CategoryController.delete
);

export default router;