const express = require('express');
const { productController } = require('../../controllers/product_controller.js')

const productRouter = express.Router()

productRouter.get('/', productController)

module.exports = productRouter