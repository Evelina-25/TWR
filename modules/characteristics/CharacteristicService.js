import Characteristic from "./Characteristic.js";

class CharacteristicService {

    async create(name) {

        const candidate = await Characteristic.findOne({ name });

        if (candidate) {
            throw new Error("Такая характеристика уже существует");
        }

        return await Characteristic.create({ name });
    }

    async getAll() {
        return await Characteristic.find();
    }

    async getOne(id) {

        if (!id) {
            throw new Error("Не указан ID");
        }

        return await Characteristic.findById(id);
    }

    async update(id, name) {

        if (!id) {
            throw new Error("Не указан ID");
        }

        return await Characteristic.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );
    }

    async delete(id) {

        if (!id) {
            throw new Error("Не указан ID");
        }

        return await Characteristic.findByIdAndDelete(id);
    }
}

export default new CharacteristicService();