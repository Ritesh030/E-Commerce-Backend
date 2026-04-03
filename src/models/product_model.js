const mongoose = require('mongoose')
const {Schema} = mongoose

const productSchema = new Schema(
      {
            name: {
                  type: String,
                  required: true,
                  trim: true,
                  index: true,
                  lowercase: true
            },
            brand: {
                  type: String,
                  required: true,
                  trim: true,
                  index: true,
                  lowercase: true
            },
            sku: {
                  type: String,
                  required: true,
                  unique: true, // BRAND-NAME-NUMBER --> "APPLE-IPHONE13-001" the number should be unique
                  uppercase: true,
                  trim: true
            },
            price: {
                  type: Number,
                  required: true,
                  min: 0,
                  default: 0
            },
            priceHistory: [
                  {
                        price: Number,
                        date: Date
                  }
            ],
            description: {
                  type: String,
                  trim: true
            },
            stock: {
                  type: Number,
                  required: true,
            },
            image: {
                  url: {
                        type: String
                  },
                  publicId: {
                        type: String
                  }
            }

      }, {timestamps: true}
)

const Product = mongoose.model("Product", productSchema);
module.exports = Product