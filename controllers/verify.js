const jwt = require('jsonwebtoken');
const Error = require('../helpers/error');

const verify = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        throw new Error(400, 'Login terlebih dahulu')
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = verify;