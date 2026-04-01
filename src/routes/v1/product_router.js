const express = require('express');
const { productController, getProducts, getProduct } = require('../../controllers/product_controller.js')
const { productValidator } = require('../../middlewares/product_middlewares.js')

const productRouter = express.Router()

productRouter.post('/',productValidator ,productController);

productRouter.get('/', getProducts)

productRouter.get('/:id', getProduct)

module.exports = productRouter