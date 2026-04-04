const mongoose = require('mongoose');
const { Schema } = mongoose

const orderSchema = new Schema(
      {
            userId: {
                  type: Schema.Types.ObjectId,
                  ref: "User",
                  required: true
            },
            items: [
                  {
                        productId: {
                              type: Schema.Types.ObjectId,
                              ref: "Product",
                              required: true
                        },
                        quantity: {
                              type: Number,
                              required: true,
                              min: 1
                        },
                        price: {
                              type: Number,
                              required: true,
                              min: 0
                        }
                  }
            ],
            totalPrice: {
                  type: Number,
                  required: true,
                  min: 0
            },
            status: {
                  type: String,
                  enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
                  default: "pending"
            }
      }, { timestamps: true }
)

const Order = mongoose.model("Order", orderSchema)
module.exports = Order