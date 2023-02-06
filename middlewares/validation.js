const Error = require("../helpers/error");

const validation = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body)
        next()
    } catch (error) {
        const message = error.details[0].message
        next(new Error(400, message));
    }
}

module.exports = validation 