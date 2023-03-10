const { Products } = require("../models");
const Error = require("../helpers/error");
const Response = require("../helpers/response");

class ProductController {
  async get(req, res, next) {
    try {
      const dataProduct = await Products.findAll({});
      if (dataProduct.length < 1) {
        throw new Error(400, "There is no product yet");
      }
      return new Response(res, 200, dataProduct);
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      const { productName, quantity, type } = req.body;
      const createProduct = await Products.create({
        productName,
        quantity,
        type,
      });
      return new Response(res, 200, createProduct);
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const { productName, quantity, type } = req.body;
      const { id } = req.params;
      const searchID = await Products.findOne({
        where: { id: id },
      });
      if (!searchID) {
        throw new Error(400, `There is no product with ID ${id}`);
      }
      const updateUser = await Products.update(
        {
          productName: productName,
          quantity: quantity,
          type: type,
        },
        { where: { id: id } }
      );
      const updatedProduct = await Products.findOne({
        where: { id: id },
      });
      return new Response(res, 200, updatedProduct);
    } catch (error) {
      next(error);
    }
  }
  async deleteByID(req, res, next) {
    try {
      // const token = req.header('auth-token');
      // const decode = jwtDecode(token);
      const { id } = req.params;
      const dataProduct = await Products.findAll({
        where: { id: id },
      });
      if (!dataProduct) {
        throw new Error(400, `There is no product with ID ${id}`);
      }
      const deleteProduct = await Products.destroy({
        where: { id: id },
      });
      return new Response(res, 200, "Product has been deleted");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { ProductController };
