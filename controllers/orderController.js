const { Users, Orders, Products } = require('../models');
const { Response, Error } = require('../helpers/response');
const authentication = require('../middlewares/authentication');

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
      const { productID, productName, toStreet, toCity, status } = req.body;
      const searchUser = await Users.findOne({
        where: { id: req.user.id },
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
      const { id } = req.params;
      const searchOrder = await Orders.findOne({
        where: { id: id },
      });
      if (!searchOrder) {
        throw new Error(400, `There is no order with ID ${id}`);
      }
      if (searchOrder.userID !== req.user.id) {
        throw new Error(401, 'Unauthorized to make changes')
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
      const { productID, productName, toStreet, toCity } = req.body;
      const { id } = req.user;
      const searchID = await Orders.findOne({
        where: { userID: id },
      });
      
      if (id !== searchID.userID) {
        throw new Error(401, 'Unauthorized to make changes')
      }

      const searchProduct = await Products.findOne({
        where: { id: productID },
      });
      if (!searchProduct) {
        throw new Error(400, 'Product is not available');
      }
      if (!searchID) {
        throw new Error(400, `There is no order with ID ${id}`);
      }
      const updateOrder = await Orders.update(
        {
          productID: productID,
          productName: searchProduct.productName,
          toStreet: toStreet,
          toCity: toCity,
        },
        { where: { id: req.params.id } }
      );
      const updatedOrder = await Orders.findOne({
        where: { id: req.params.id },
      });
      return new Response(res, 200, updatedOrder);
    } catch (error) {
      next(error);
    }
  }
  async deleteByID(req, res, next) {
    try {
      const { id } = req.user;
      const dataOrder = await Orders.findOne({
        where: { id: req.params.id },
      });
      if (!dataOrder) {
        throw new Error(400, `There is no order with ID ${id}`);
      }
      if (dataOrder.userID !== id) {
        throw new Error(400, `Unauthorized to make changes`);
      }
      const deleteOrder = await Orders.destroy({
        where: { id: req.params.id },
      });
      return new Response(res, 200, 'Order has been deleted');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { OrderController };
