import User from "./User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {

generateToken(user) {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        "SECRET_KEY",
        { expiresIn: "24h" }
    );
}

async registration(name, lastname, midlename, email, password, role = "USER") {

    if (!email || !password) {
        throw new Error("Email и пароль обязательны");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new Error("Некорректный email");
    }

    if (password.length < 6) {
        throw new Error("Пароль должен быть минимум 6 символов");
    }

    const candidate = await User.findOne({ email });

    if (candidate) {
        throw new Error("Пользователь уже существует");
    }

    const hashPassword = await bcrypt.hash(password, 5);

    const user = await User.create({
        name,
        lastname,
        midlename,
        email,
        password: hashPassword,
        role
    });

    return this.generateToken(user);
}

    async login(email, password) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("Пользователь не найден");
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            throw new Error("Неверный пароль");
        }

        return this.generateToken(user);
    }

    async getAll() {
        return await User.find().select("-password");
    }

    async delete(id) {
    if (!id) {
        throw new Error("Не указан ID");
    }
    return await User.findByIdAndDelete(id);
}

async getOne(id) {
    if (!id) {
        throw new Error("Не указан ID");
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
        throw new Error("Пользователь не найден");
    }

    return user;
}
}

export default new UserService();