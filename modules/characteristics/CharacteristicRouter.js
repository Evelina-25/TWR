import Router from "express";
import CharacteristicController from "./CharacteristicController.js";
import authMiddleware from "../../Midleware/authMiddleware.js";
import roleMiddleware from "../../Midleware/roleMiddleware.js";

const router = new Router();

/**
 * @swagger
 * /api/characteristics:
 *   get:
 *     summary: Получить список характеристик
 *     tags: [Characteristics]
 *     responses:
 *       200:
 *         description: Список характеристик
 */
router.get("/", CharacteristicController.getAll);

/**
 * @swagger
 * /api/characteristics/{id}:
 *   get:
 *     summary: Получить характеристику по ID
 *     tags: [Characteristics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID характеристики
 *     responses:
 *       200:
 *         description: Информация о характеристике
 *       404:
 *         description: Характеристика не найдена
 */
router.get("/:id", CharacteristicController.getOne);

/**
 * @swagger
 * /api/characteristics:
 *   post:
 *     summary: Создать новую характеристику
 *     tags: [Characteristics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название характеристики
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Характеристика создана
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    CharacteristicController.create
);

/**
 * @swagger
 * /api/characteristics/{id}:
 *   put:
 *     summary: Обновить характеристику
 *     tags: [Characteristics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID характеристики
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название характеристики
 *     responses:
 *       200:
 *         description: Характеристика обновлена
 *       404:
 *         description: Характеристика не найдена
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    CharacteristicController.update
);

/**
 * @swagger
 * /api/characteristics/{id}:
 *   delete:
 *     summary: Удалить характеристику
 *     tags: [Characteristics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID характеристики
 *     responses:
 *       200:
 *         description: Характеристика удалена
 *       404:
 *         description: Характеристика не найдена
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    CharacteristicController.delete
);

export default router;