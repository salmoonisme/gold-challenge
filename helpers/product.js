const Joi = require("joi");

const productValidator = Joi.object({
    productName: Joi.string().min(5).required(),
    quantity: Joi.number().integer().required(),
    type: Joi.string().required()
})

module.exports = productValidator