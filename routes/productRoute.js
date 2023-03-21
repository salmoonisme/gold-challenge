const express = require('express');
const router = express.Router();
const { ProductController } = require('../controllers/productController');
const productController = new ProductController();
const validation  = require('../middlewares/validation');
const { productValidator } = require ('../helpers/validator')
const { authAdmin } = require('../middlewares/authentication');

//   router API

router.get('/product', productController.get);
router.post('/product', authAdmin, validation(productValidator), productController.create);
router.patch('/product/:id', authAdmin, productController.update);
router.delete('/product/:id', authAdmin, productController.deleteByID);

module.exports = router;