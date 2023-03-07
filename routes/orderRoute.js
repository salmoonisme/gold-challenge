const express = require('express');
const router = express.Router();
const { OrderController } = require('../controllers/orderController');
const orderController = new OrderController();
const authentication = require('../middlewares/authentication');

// router API

router.get('/order', orderController.get);
router.post('/order', authentication, orderController.create);
router.post('/order/:id', authentication ,orderController.payOrder);
router.patch('/order/:id', authentication, orderController.update);
router.delete('/order/:id', authentication, orderController.deleteByID);

module.exports = router;