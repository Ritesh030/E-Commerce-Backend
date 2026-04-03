const express = require('express');
const pingRouter = require('./ping_router.js')
const productRouter = require('./product_router.js')
const userRouter = require('./user_router.js')

const v1Router = express.Router();


v1Router.use('/ping', pingRouter);
v1Router.use('/product', productRouter);
v1Router.use('/user', userRouter)

module.exports = v1Router