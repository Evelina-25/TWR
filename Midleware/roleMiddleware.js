export default function (role) {
    return function (req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Пользователь не авторизован"
                });
            }

            if (req.user.role !== role) {
                return res.status(403).json({
                    message: "Нет доступа"
                });
            }

            next();
        } catch (e) {
            return res.status(403).json({
                message: "Нет доступа"
            });
        }
    };
}