import ProductService from "./ProductService.js";

class ProductController {

    async create(req, res){
        try {
            const { name, description, price, quantity, category, characteristic } = req.body;
            const picture = req.files?.picture;

            const product = await ProductService.create(
                name,
                description,
                price,
                quantity,
                picture,
                category,
                characteristic
            );

            res.json(product);
        } catch (e) {
            res.status(500).json(e.message);
        }
    }

    async getAll(req, res){
        try{
            const products = await ProductService.getAll();
            return res.json(products);
        }catch(e){
            res.status(500).json(e.message);
        }
    }

    async getOne(req, res){
        try{
            const product = await ProductService.getOne(req.params.id);
            return res.json(product);
        }catch(e){
            res.status(500).json(e.message);
        }
    }

    async update(req, res){
        try{
            const updatedProduct = await ProductService.update(
                req.params.id,
                req.body
            );
            return res.json(updatedProduct);
        }catch(e){
            res.status(500).json(e.message);
        }
    }

    async delete(req, res){
        try{
            const product = await ProductService.delete(req.params.id);
            return res.json(product);
        }catch(e){
            res.status(500).json(e.message);
        }
    }
}

export default new ProductController();