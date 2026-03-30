const express = require('express');
const pingRouter = require('./ping_router')
const productRouter = require('./product_router')

const v1Router = express.Router();


v1Router.use('/ping', pingRouter);
v1Router.use('/product', productRouter);

module.exports = v1Router