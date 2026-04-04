const express = require('express')
const verifyjwt = require('../../middlewares/auth_middleware')
const { createOrder, clearCart } = require('../../controllers/order_controller')

const orderRouter = express.Router()

orderRouter.post('/create', verifyjwt, createOrder)

module.exports = orderRouter