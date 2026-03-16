import Router from "express";
import UserController from "./UserController.js";
import authMiddleware from "../../Midleware/authMiddleware.js";
import roleMiddleware from "../../Midleware/roleMiddleware.js";
import ProductController from "../products/ProductController.js";

const router = new Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lastname:
 *                 type: string
 *               midlename:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - lastname
 *               - midlename
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 */
router.post("/register", UserController.registration);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Пользователь успешно авторизован
 */
router.post("/login", UserController.login);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создать пользователя (только для администратора)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lastname:
 *                 type: string
 *               midlename:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь создан
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    ProductController.create
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список пользователей
 */
router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    UserController.getAll
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *       404:
 *         description: Пользователь не найден
 */
router.get("/:id", authMiddleware, UserController.getOne);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удалить пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь удалён
 *       404:
 *         description: Пользователь не найден
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    UserController.delete
);

export default router;