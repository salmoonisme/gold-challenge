const { Users, Orders, Products } = require("../models");
const Error = require("../helpers/error");
const decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const verify = require("./verify");
const { default: jwtDecode } = require("jwt-decode");
const { search } = require("../routes/orderRoute");

class OrderController {
  async get(req, res, next) {
    try {
      const dataOrder = await Orders.findAll({});
      if (dataOrder.length < 1) {
        throw new Error(400, "There is no order yet");
      }
      res.status(200).json(dataOrder);
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      // const token = req.header('auth-token');
      // const decode = jwtDecode(token);
      const { productID, productName, userID, toStreet, toCity, status } =
        req.body;
      const searchUser = await Users.findOne({
        where: { id: userID },
        attributes: ["street", "city", "id"],
      });
      if (!searchUser) {
        throw new Error(400, `User with ID ${userID} is not registered`);
      }
      const searchProduct = await Products.findOne({
        where: { id: productID },
        attributes: ["productName", "id"],
      });
      if (!searchProduct) {
        throw new Error(400, "Product is not available");
      }
      const createOrder = await Orders.create({
        productID: searchProduct.id,
        productName: searchProduct.productName,
        userID: searchUser.id,
        toStreet: searchUser.street,
        toCity: searchUser.city,
        status: "Pending",
      });
      res.status(200).json({
        message: "Successfully create order",
        data: createOrder,
      });
    } catch (error) {
      next(error);
    }
  }
  async payOrder(req, res, next) {
    try {
      // const token = req.header('auth-token');
      // const decode = jwtDecode(token);
      const { id } = req.params;
      const searchOrder = await Orders.findOne({
        where: { id: id },
      });
      if (!searchOrder) {
        throw new Error(400, `There is no order with ID ${id}`);
      }
      const updateOrder = await Orders.update(
        {
          status: "Paid",
        },
        {
          where: {
            id: id,
          },
        }
      );
      res.status(302).json({
        message: "Successfully paid order",
      });
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const { productID, productName, userID, toStreet, toCity } = req.body;
      const { id } = req.params;
      const searchID = await Orders.findOne({
        where: { id: id },
      });
      if (!searchID) {
        throw new Error(400, `There is no order with ID ${id}`);
      }
      const updateUser = await Orders.update(
        {
          productID: productID,
          productName: productName,
          userID: userID,
          toStreet: toStreet,
          toCity: toCity,
        },
        { where: { id: id } }
      );
      res.status(200).json({
        message: "Berhasil update order",
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteByID(req, res, next) {
    try {
      // const token = req.header('auth-token');
      // const decode = decode(token);
      const { id } = req.params;
      const dataOrder = await Orders.findOne({
        where: { id: id },
      });
      if (!dataOrder) {
        throw new Error(400, `There is no order with ID ${id}`);
      }
      const deleteOrder = await Orders.destroy({
        where: { id: id },
      });
      res.status(200).json({
        message: "Successfully delete order",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { OrderController };