import UserService from "./UserService.js";

class UserController {

   async registration(req, res) {
    try {
        const { name, lastname, midlename, email, password, role } = req.body;

        const token = await UserService.registration(
            name,
            lastname,
            midlename,
            email,
            password,
            role
        );

        return res.json({ token });
    } catch (e) {
        return res.status(400).json(e.message);
    }
}

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const token = await UserService.login(email, password);

            return res.json({ token });
        } catch (e) {
            return res.status(400).json(e.message);
        }
    }

    async getAll(req, res) {
        try {
            const users = await UserService.getAll();
            return res.json(users);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async delete(req, res) {
    try {
        const user = await UserService.delete(req.params.id);
        return res.json(user);
    } catch (e) {
        return res.status(500).json(e.message);
    }
}

async getOne(req, res) {
    try {
        const user = await UserService.getOne(req.params.id);
        return res.json(user);
    } catch (e) {
        return res.status(404).json(e.message);
    }
}
}

export default new UserController();