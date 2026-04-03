import express from "express";
import productRouter from "./products/ProductRouter.js";
import categoryRouter from "./categories/CategoryRouter.js";
import userRouter from "./users/UserRouter.js";
import CartRouter from "./cart/CartRouter.js";
import CharacteristicRouter from "./characteristics/CharacteristicRouter.js";

const router = express.Router();

router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/users", userRouter);
router.use("/carts", CartRouter);
router.use("/characteristics", CharacteristicRouter);

export default router;