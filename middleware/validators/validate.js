const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(errors.array().map(err => err.msg).join(', '));
        error.statusCode = 400; // Bad Request
        return next(error);
    }
    next();
};