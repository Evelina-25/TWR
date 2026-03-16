import CategoryService from "./CategoryService.js";

class CategoryController {

    async create(req, res) {
        try {
            const { name, description, parentCategory } = req.body;

            const category = await CategoryService.create(
                name,
                description,
                parentCategory
            );

            return res.json(category);

        } catch (e) {
            if (e.code === 11000) {
                return res.status(400).json("Такая категория уже существует");
            }

            return res.status(500).json(e.message);
        }
    }

    async getAll(req, res) {
        try {
            const categories = await CategoryService.getAll();
            return res.json(categories);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async getOne(req, res) {
        try {
            const category = await CategoryService.getOne(req.params.id);
            return res.json(category);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async update(req, res) {
        try {
            const { name, description, parentCategory } = req.body;

            const updatedCategory = await CategoryService.update(
                req.params.id,
                name,
                description,
                parentCategory
            );

            return res.json(updatedCategory);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async delete(req, res) {
        try {
            const category = await CategoryService.delete(req.params.id);
            return res.json(category);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
}

export default new CategoryController();