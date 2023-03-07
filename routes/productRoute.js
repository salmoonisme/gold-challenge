const express = require('express');
const router = express.Router();
const { ProductController } = require('../controllers/productController');
const productController = new ProductController();
const validation  = require('../middlewares/validation');
const { productValidator } = require ('../helpers/validator')

//   router API

router.get('/product', productController.get);
router.post('/product', validation(productValidator), productController.create);
router.patch('/product/:id', productController.update);
router.delete('/product/:id', productController.deleteByID);

module.exports = router;