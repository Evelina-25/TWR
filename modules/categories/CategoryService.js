import Category from "./Category.js";

class CategoryService {

    async create(name, description, parentCategory = null) {

        if (!name || !description) {
            throw new Error("Название и описание обязательны");
        }

        const candidate = await Category.findOne({ name });

        if (candidate) {
            throw new Error("Категория с таким названием уже существует");
        }

        return await Category.create({
            name,
            description,
            parentCategory
        });
    }

    async getAll() {
        return await Category.find().populate("parentCategory");
    }

    async getOne(id) {
        if (!id) {
            throw new Error("Не указан ID");
        }

        return await Category.findById(id).populate("parentCategory");
    }

    async update(id, name, description, parentCategory) {

        if (!id) {
            throw new Error("Не указан ID");
        }

        const candidate = await Category.findOne({ name });

        if (candidate && candidate._id.toString() !== id) {
            throw new Error("Категория с таким названием уже существует");
        }

        return await Category.findByIdAndUpdate(
            id,
            {
                name,
                description,
                parentCategory
            },
            { new: true }
        );
    }

    async delete(id) {
        if (!id) {
            throw new Error("Не указан ID");
        }

        return await Category.findByIdAndDelete(id);
    }
}

export default new CategoryService();