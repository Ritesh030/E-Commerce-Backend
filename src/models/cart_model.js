const mongoose = require('mongoose')
const { Schema } = mongoose

const cartSchema = new Schema(
      {
            userId: {
                  type: Schema.Types.ObjectId,
                  ref: "User",
                  unique: true,
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
                        }
                  }
            ]
      }, {timestamps: true}
)

const Cart = mongoose.model("Cart", cartSchema)
module.exports = Cart