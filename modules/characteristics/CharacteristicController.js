import CharacteristicService from "./CharacteristicService.js";

class CharacteristicController {

    async create(req, res) {
        try {
            const { name } = req.body;

            const characteristic = await CharacteristicService.create(name);

            return res.json(characteristic);
        } catch (e) {
            return res.status(400).json(e.message);
        }
    }

    async getAll(req, res) {
        try {
            const characteristics = await CharacteristicService.getAll();
            return res.json(characteristics);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async getOne(req, res) {
        try {
            const characteristic = await CharacteristicService.getOne(req.params.id);
            return res.json(characteristic);
        } catch (e) {
            return res.status(404).json(e.message);
        }
    }

    async update(req, res) {
        try {
            const { name } = req.body;

            const characteristic = await CharacteristicService.update(
                req.params.id,
                name
            );

            return res.json(characteristic);
        } catch (e) {
            return res.status(400).json(e.message);
        }
    }

    async delete(req, res) {
        try {
            const characteristic = await CharacteristicService.delete(req.params.id);
            return res.json(characteristic);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
}

export default new CharacteristicController();