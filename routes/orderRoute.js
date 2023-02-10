const express = require('express');
const router = express.Router();
const { OrderController } = require('../controllers/orderController');
const orderController = new OrderController();
const verify = require('../controllers/verify')

// router API

router.get('/order', orderController.get);
router.post('/order', orderController.create);
router.post('/order/:id', orderController.payOrder);
router.patch('/order/:id', orderController.update);
router.delete('/order/:id', orderController.deleteByID);

module.exports = router;