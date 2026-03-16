
import Product from "./Product.js";
import Category from "../categories/Category.js";
import Characteristic from "../characteristics/Characteristic.js";

class ProductService {

    async create(name, description, price, quantity, picture, categoryId, characteristicId) {

        const candidate = await Product.findOne({ name });
        if (candidate) {
            throw new Error("Товар с таким названием уже существует");
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            throw new Error("Указанная категория не найдена");
        }

        const characteristic = await Characteristic.findById(characteristicId);
        if (!characteristic) {
            throw new Error("Указанная характеристика не найдена");
        }

        const fileName = picture ? await FileService.saveFile(picture) : null;

        const createdProduct = await Product.create({
            name,
            description,
            price,
            quantity,
            picture: fileName,
            category: category._id,
            characteristic: characteristic._id
        });

        return createdProduct;
    }

    async getAll() {
        return await Product.find()
            .populate("category")
            .populate("characteristic");
    }

    async getOne(id) {
        if (!id) throw new Error("не указан ID");

        return await Product.findById(id)
            .populate("category")
            .populate("characteristic");
    }

    async update(id, product) {
        if (!id) throw new Error("не указан ID");

        if (product.category) {
            const category = await Category.findById(product.category);
            if (!category) throw new Error("Указанная категория не найдена");
        }

        if (product.characteristic) {
            const characteristic = await Characteristic.findById(product.characteristic);
            if (!characteristic) throw new Error("Указанная характеристика не найдена");
        }

        return await Product.findByIdAndUpdate(id, product, { new: true })
            .populate("category")
            .populate("characteristic");
    }

    async delete(id) {
        if (!id) throw new Error("не указан ID");
        return await Product.findByIdAndDelete(id);
    }
}

export default new ProductService();
