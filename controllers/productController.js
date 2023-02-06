const { Products } = require("../models");
const Error = require("../helpers/error");
const decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const verify = require("./verify");
const { default: jwtDecode } = require('jwt-decode');

class ProductController{
   async get (req, res, next) {
    try {
        const dataProduct = await Products.findAll({});
        if (dataProduct.length < 1) {
            throw new Error(400, "There is no product yet")
        }
        res.status(200).json(dataProduct);
    } 
    catch (error) {
        next(error);
    }
    }
    async create (req, res, next) {
    try {
        const {productName, quantity, type} = req.body
        const createProduct = await Products.create({productName, quantity, type});        
        res.status(200).json(createProduct)
    }
    catch (error) {
        next(error)
    }
    }
    async update (req, res, next) {
        try {
          const { productName, quantity, type } = req.body
          const { id } = req.params
          const searchID = await Products.findOne({
            where : {id : id}
          })
          if (!searchID) {
            throw new Error (400, `There is no product with ID ${id}`)
          }
          const updateUser = await Products.update({
            productName: productName,
            quantity: quantity,
            type: type
          }, { where : {id: id}} )
          res.status(200).json({
            message: "Successfully update product"
        });
        }
        catch (error) {
          next(error)
        }
      }
    async deleteByID (req, res, next) {
        try {
            // const token = req.header("auth-token");
            // const decode = jwtDecode(token);
            const { id } = req.params
            const dataProduct = await Products.findAll({
                where: {id: id}
            });
            if (!dataProduct) {
                throw new Error(400, `There is no product with ID ${id}`)
            }
            const deleteProduct = await Products.destroy({
                where: { id: id }
            })
            res.status(200).json({
                message: "Successfully delete product"
            });
        } 
        catch (error) {
            next(error);
        }
    }
    
}


module.exports = { ProductController };