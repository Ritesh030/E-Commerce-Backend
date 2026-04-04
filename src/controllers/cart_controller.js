const Cart = require("../models/cart_model");
const Product = require("../models/product_model");
const User = require("../models/user_model");
const apiError = require("../utils/apiResponse_and_handlers/api_error");
const apiResponse = require("../utils/apiResponse_and_handlers/api_response");
const asyncHandler = require("../utils/apiResponse_and_handlers/async_handler");

const addItem = asyncHandler(async (req, res) => {
      const sku = req.params.sku?.toUpperCase()
      const quantity = Number(req.body?.quantity)
      const userId = req.user?._id

      if (!Number.isFinite(quantity) || quantity <= 0) {
            throw new apiError(400, "Valid Quantity of Product is Required")
      }
      if (!sku) {
            throw new apiError(404, "sku fields cannot be empty")
      }

      const product = await Product.findOne({ sku })
      if (!product) {
            throw new apiError(404, "Product with this sku not found")
      }

      let cart = await Cart.findOne({ userId })
      if (!cart) {
            cart = await Cart.create({
                  userId,
                  items: [{ productId: product._id, quantity }]
            })
      } else {
            const itemIndex = cart.items.findIndex(
                  (item) => item.productId.equals(product._id)
            )

            if (itemIndex > -1) {
                  cart.items[itemIndex].quantity += quantity;
            } else {
                  cart.items.push({ productId: product._id, quantity })
            }

            await cart.save({ validateBeforeSave: false })
      }

      const updatedCart = await Cart.findById(cart._id).populate('items.productId')

      return res
            .status(200)
            .json(new apiResponse(200, updatedCart, "Item added to cart successfully"))
})

const removeItem = asyncHandler(async (req, res) => {
      const sku = req.params.sku?.toUpperCase()
      const userId = req.user?._id

      if (!sku) {
            throw new apiError(404, "sku is required to remove an item")
      }

      const product = await Product.findOne({ sku })
      if (!product) {
            throw new apiError(404, "Product with this sku does not exist")
      }

      const cart = await Cart.findOne({ userId })
      if (!cart) {
            throw new apiError(404, "Cart not found for this user")
      }

      const itemIndex = cart.items.findIndex(
            (item) => item.productId.equals(product._id)
      )

      if (itemIndex < 0) {
            throw new apiError(400, "This product is not in your cart")
      }

      const [removedItem] = cart.items.splice(itemIndex, 1)

      await cart.save({ validateBeforeSave: false })

      return res
            .status(200)
            .json(
                  new apiResponse(
                        200,
                        {
                              product: product,
                              quantity: removedItem.quantity
                        },
                        "This Product is removed from cart"
                  )
            )
})

const updateCart = asyncHandler(async (req, res) => {
      const sku = req.params.sku
      const quantity = Number(req.body.quantity)
      const userId = req.user?._id

      if (!sku) {
            throw new apiError(400, "sku is required to update a item")
      }
      if (!quantity || quantity <= 0) {
            throw new apiError(400, "Enter valid quantity of item to update")
      }

      const product = await Product.findOne({ sku });
      if (!product) {
            throw new apiError(404, "Product with this sku does not exists")
      }

      const cart = await Cart.findOne({
            userId,
            "items.productId": product._id
      })

      if (!cart) {
            throw new apiError(404, "Cart or item not found to update")
      }

      const itemIndex = cart.items.findIndex(
            (item) => item.productId.equals(product._id)
      )

      if (itemIndex < 0) {
            throw new apiError(400, "Product not found in your cart")
      }

      cart.items[itemIndex].quantity = quantity
      await cart.save({ validateBeforeSave: false })

      return res.status(200).json(new apiResponse(200, cart.items[itemIndex], "Quantity updated successfully"))
})

const getCart = asyncHandler(async (req, res) => {
      const userId = req.user?._id

      const cart = await Cart.findOne({ userId }).populate("items.productId")

      return res.status(200).json(new apiResponse(200, cart, "Cart fetched successfully"))
})

module.exports = {
      addItem,
      removeItem,
      updateCart,
      getCart
}
