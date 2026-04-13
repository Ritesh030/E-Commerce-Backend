const express = require('express');
const upload = require('../../middlewares/multer_middleware.js');
const { createProduct, getProducts, getProduct, addStock } = require('../../Controllers/product_controller.js');
const isAdmin = require('../../middlewares/isadmin_middleware.js');
const verifyjwt = require('../../middlewares/auth_middleware.js');

const productRouter = express.Router()

productRouter.post('/create', verifyjwt,isAdmin,upload.fields([
            {
                  name: "image",
                  maxCount: 1
            }
      ]) ,createProduct);

productRouter.get('/', getProducts)
productRouter.get('/:sku', getProduct)
productRouter.patch('/:sku/addstock', verifyjwt,isAdmin,addStock)

module.exports = productRouter