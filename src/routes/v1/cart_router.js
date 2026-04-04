const express = require('express')
const verifyjwt = require('../../middlewares/auth_middleware')
const { addItem, removeItem, updateCart, getCart } = require('../../controllers/cart_controller')

const cartRouter = express.Router()

cartRouter.post('/:sku/add', verifyjwt, addItem)
cartRouter.delete('/:sku/remove', verifyjwt, removeItem)
cartRouter.patch('/:sku/update',verifyjwt, updateCart)
cartRouter.get('/', verifyjwt, getCart)

module.exports = cartRouter