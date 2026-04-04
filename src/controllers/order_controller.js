const Cart = require("../models/cart_model");
const Order = require("../models/order_model");
const Product = require("../models/product_model");
const apiError = require("../utils/apiResponse_and_handlers/api_error");
const apiResponse = require("../utils/apiResponse_and_handlers/api_response");
const asyncHandler = require("../utils/apiResponse_and_handlers/async_handler");


const getTotal = async (userId) => {
      const cart = await Cart.findOne({ userId }).populate("items.productId", "price");

      if (!cart) {
            throw new apiError(404, "Cart not found for this user");
      }

      if (cart.items.length === 0) {
            throw new apiError(400, "Cart of this user is empty");
      }

      let totalPrice = 0;

      cart.items.forEach((item) => {
            const price = item.productId?.price || 0;
            totalPrice += price * item.quantity;
      });

      return totalPrice;
};

const createOrder = asyncHandler(async (req, res) => {
      const userId = req.user?._id

      const cart = await Cart.findOne({ userId }).populate("items.productId", "price")
      if (!cart) {
            throw new apiError(400, "Cart of this user does not exists")
      }

      if (cart.items.length === 0) {
            throw new apiError(404, "Cannot place order with empty cart")
      }

      for (const item of cart.items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                  throw new apiError(404, "Product not found")
            }

            if (product.stock < item.quantity) {
                  throw new apiError(400, `${product.name} is out of stock`)
            }

            product.stock -= item.quantity;
            await product.save({ validateBeforeSave: false })
      }

      const totalPrice = await getTotal(userId)

      const orderItems = cart.items.map((item) => ({
            productId: item.productId?._id,
            quantity: item.quantity,
            price: item.productId?.price
      }))

      const missingPriceItem = orderItems.find((item) => item.price == null)
      if (missingPriceItem) {
            throw new apiError(400, "Unable to create order because one or more cart items have no price")
      }

      const createdOrder = await Order.create({
            userId,
            items: orderItems,
            totalPrice,
            status: "pending"
      })
      if (!createdOrder) {
            throw new apiError(400, "failed to create order")
      }

      cart.items = [];
      await cart.save({ validateBeforeSave: false });

      return res
            .status(200)
            .json(new apiResponse(200, createdOrder, "Order created successfully"))
})

module.exports = {
      createOrder
}
