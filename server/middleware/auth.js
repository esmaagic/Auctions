exports.isAuth = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        return res.status(401).send('Not authenticated');
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.session.user.username === "admin") {
        return next();
    } else {
        return res.status(401).send('Not authenticated');
    }
};