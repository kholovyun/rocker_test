const accessChecker = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const userId = req.params.userId;
            if (allowedRoles.includes(userId)) {
                next();
            } else {
                throw new Error("Access denied");
            }
        } catch (err) {
            const error = err;
            res.status(403).send(error.message);
        }
    };
};