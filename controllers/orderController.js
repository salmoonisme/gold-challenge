const { Users, Orders, Products } = require('../models');
const Error = require('../helpers/error');
const Response = require('../helpers/response');
const authentication = require('../middlewares/authentication')

class OrderController {
  async get(req, res, next) {
    try {
      const dataOrder = await Orders.findAll({});
      if (dataOrder.length < 1) {
        throw new Error(400, 'There is no order yet');
      }
      return new Response(res, 200, dataOrder);
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
        where: { id: req.user.id },
        attributes: ['street', 'city', 'id'],
      });
      if (!searchUser) {
        throw new Error(400, `User with ID ${req.user.id} is not registered`);
      }
      const searchProduct = await Products.findOne({
        where: { id: productID },
        attributes: ['productName', 'id'],
      });
      if (!searchProduct) {
        throw new Error(400, 'Product is not available');
      }
      const createOrder = await Orders.create({
        productID: searchProduct.id,
        productName: searchProduct.productName,
        userID: req.user.id,
        toStreet: searchUser.street,
        toCity: searchUser.city,
        status: 'Pending',
      });
      return new Response(res, 200, createOrder);
    } catch (error) {
      next(error);
    }
  }
  async payOrder(req, res, next) {
    try {
      // const token = req.header('auth-token');
      // const decode = jwtDecode(token);
      const { id } = req.user;
      const searchOrder = await Orders.findOne({
        where: { id: id },
      });
      if (!searchOrder) {
        throw new Error(400, `There is no order with ID ${id}`);
      }
      const payOrder = await Orders.update(
        {
          status: 'Paid',
        },
        {
          where: {
            id: id,
          },
        }
      );
      const paidOrder = await Orders.findOne({
        where: { id: id },
      });
      return new Response(res, 200, paidOrder);
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const { productID, productName, userID, toStreet, toCity } = req.body;
      const { id } = req.user;
      const searchID = await Orders.findOne({
        where: { id: id },
      });
      if (!searchID) {
        throw new Error(400, `There is no order with ID ${id}`);
      }
      const updateOrder = await Orders.update(
        {
          productID: productID,
          productName: productName,
          userID: userID,
          toStreet: toStreet,
          toCity: toCity,
        },
        { where: { id: id } }
      );
      const updatedOrder = await Orders.findOne({
        where: { id: id },
      });
      return new Response(res, 200, updatedOrder);
    } catch (error) {
      next(error);
    }
  }
  async deleteByID(req, res, next) {
    try {
      // const token = req.header('auth-token');
      // const decode = decode(token);
      const { id } = req.user;
      const dataOrder = await Orders.findOne({
        where: { id: id },
      });
      if (!dataOrder) {
        throw new Error(400, `There is no order with ID ${id}`);
      }
      const deleteOrder = await Orders.destroy({
        where: { id: id },
      });
      return new Response(res, 200, 'Order has been deleted');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { OrderController };