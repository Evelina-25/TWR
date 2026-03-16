import express from "express";
import mongoose from "mongoose";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import productRouter from "./modules/products/ProductRouter.js";
import categoryRouter from "./modules/categories/CategoryRouter.js";
import userRouter from "./modules/users/UserRouter.js";
import fileUpload from "express-fileupload";
import CartRouter from "./modules/cart/CartRouter.js";
import CharacteristicRouter from "./modules/characteristics/CharacteristicRouter.js";

const PORT = 5000;
//const uri = mongodb://admin:mongo721887@192.168.0.62/cosmetica?authSource=admin;
const uri = "mongodb://localhost:27017/cosmetica";

const app = express();

app.use(express.json());
app.use(express.static("static"));
app.use(fileUpload());

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/carts", CartRouter)
app.use("/api/characteristics", CharacteristicRouter);

async function startApp() {
    try {
        await mongoose.connect(uri);
        app.listen(PORT, () =>
            console.log("SERVER STARTED ON PORT " + PORT)
        );
    } catch (e) {
        console.log(e);
    }
}

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cosmetics API",
      version: "1.0.0",
      description: "API интернет-магазина косметики"
    },
    servers: [
      { url: "http://localhost:5000" }
    ]
  },
  apis: ["./modules/**/*.js"]
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

startApp();