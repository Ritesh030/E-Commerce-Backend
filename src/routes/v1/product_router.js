const express = require('express');
const upload = require('../../middlewares/multer_middleware.js');
const { createProduct, getProducts, getProduct, updateStock } = require('../../Controllers/product_controller.js');

const productRouter = express.Router()

productRouter.post('/create',upload.fields([
            {
                  name: "image",
                  maxCount: 1
            }
      ]) ,createProduct);

productRouter.get('/', getProducts)
productRouter.get('/:sku', getProduct)
productRouter.patch('/:sku/stock', updateStock)

module.exports = productRouter