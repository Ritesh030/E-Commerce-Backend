const express = require('express');
const productRouter = require('./product_router.js')
const userRouter = require('./user_router.js');
const cartRouter = require('./cart_router.js');
const orderRouter = require('./order_router.js');

const v1Router = express.Router();

v1Router.use('/product', productRouter);
v1Router.use('/user', userRouter)
v1Router.use('/cart', cartRouter)
v1Router.use('/order', orderRouter)

module.exports = v1Router