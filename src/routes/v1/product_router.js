const express = require('express');
const { productController } = require('../../controllers/product_controller.js')
const { productValidator } = require('../../middlewares/product_middlewares.js')

const productRouter = express.Router()

productRouter.post('/',productValidator ,productController)

module.exports = productRouter