const Product = require('../models/product_model.js')
const apiError = require('../utils/apiResponse_and_handlers/api_error.js')
const apiResponse = require('../utils/apiResponse_and_handlers/api_response.js')
const asyncHandler = require('../utils/apiResponse_and_handlers/async_handler.js')
const { uploadOnCloudinary } = require('../utils/cloudinary.js')
const generateSKU = require('../utils/usefull_functions/generate_product_sku.js')

const createProduct = asyncHandler(async (req, res) => {
      const { brand, name, price, description, stock } = req.body

      if ([name, brand, price, stock].some((field) => field?.trim() === "")) {
            throw new apiError(400, "All feilds are required")
      }

      const cleanName = name.trim().toLowerCase();
      const cleanBrand = brand.trim().toLowerCase();

      const existingProduct = await Product.findOne({
            name: cleanName,
            brand: cleanBrand
      })

      if (existingProduct) {
            const stockToAdd = Number(stock);
            existingProduct.stock += stockToAdd

            if (existingProduct.price !== price) {
                  existingProduct.priceHistory.push({
                        price: existingProduct.price,
                        date: new Date()
                  });
                  existingProduct.price = price;
            }

            await existingProduct.save();

            return res
                  .status(200)
                  .json(new apiResponse(200, existingProduct, "Stock of existing product increased"))
      }

      const count = await Product.countDocuments()
      const generatedsku = generateSKU(name, brand, count)

      const imageLocalPath = req.files?.image?.[0]?.path;
      console.log(imageLocalPath)

      if (!imageLocalPath) {
            throw new apiError(400, "image is required")
      }

      const image = await uploadOnCloudinary(imageLocalPath);

      if (!image) {
            throw new apiError(500, "Image not uploaded to cloudinary")
      }

      const createdProduct = await Product.create({
            name: cleanName,
            brand: cleanBrand,
            sku: generatedsku,
            description,
            price,
            stock,
            image: {
                  url: image.url,
                  publicId: image.publicId
            },
            priceHistory: [
                  {
                        price: price,
                        date: new Date()
                  }
            ]
      })

      const product = await Product.findById(createdProduct._id).select("-priceHistory")

      return res
            .status(200)
            .json(new apiResponse(200, product, "New Product is Created"))
})

const getProducts = asyncHandler(async (req,res) => {
      try {
            const products = await Product.find()
            if(!products){
                  throw new apiError(400,"anable to get all products")
            }
            return res.status(200).json(new apiResponse(200, products, "Success"))
      } catch (error) {
            throw new apiError(500, "Unable to get all the products")
      }
})

const getProduct = asyncHandler(async (req,res) => {
      const incommingsku = req.params.sku;

      if(!incommingsku){
            throw new apiError(400, "Invalid request")
      }

      const product = await Product.findOne({sku: incommingsku})

      if(!product){
            throw new apiError(400, "Product does not exists")
      }
      return res.status(200).json(new apiResponse(200, product, "success"))
})

module.exports = {
      createProduct,
      getProducts,
      getProduct
}