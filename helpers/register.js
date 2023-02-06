const Joi = require("joi");

const registerValidator = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    street: Joi.string().required(),
    city: Joi.string().required(),

})

module.exports = registerValidator