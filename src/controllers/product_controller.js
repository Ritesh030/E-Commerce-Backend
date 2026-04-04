const Product = require('../models/product_model.js')
const apiError = require('../utils/apiResponse_and_handlers/api_error.js')
const apiResponse = require('../utils/apiResponse_and_handlers/api_response.js')
const asyncHandler = require('../utils/apiResponse_and_handlers/async_handler.js')
const { uploadOnCloudinary } = require('../utils/cloudinary.js')
const generateSKU = require('../utils/usefull_functions/generate_product_sku.js')

const createProduct = asyncHandler(async (req, res) => {
      const { brand, name, price, description, stock } = req.body

      if (!name || !brand || price == null || stock == null) {
            throw new apiError(400, "All fields are required");
      }

      const generatedsku = generateSKU(name, brand)

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
            name,
            brand,
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

const getProducts = asyncHandler(async (req, res) => {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const skip = (page - 1) * limit;

      const products = await Product.find()
            .select("-priceHistory")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

      const totalProducts = await Product.countDocuments();

      return res.status(200).json(
            new apiResponse(200, {
                  products,
                  page,
                  totalPages: Math.ceil(totalProducts / limit),
                  totalProducts,
            }, "Products fetched successfully")
      );
});

const getProduct = asyncHandler(async (req, res) => {
  let incomingSku = req.params.sku;

  if (!incomingSku) {
    throw new apiError(400, "SKU is required");
  }

  incomingSku = incomingSku.toUpperCase();

  const product = await Product.findOne({ sku: incomingSku }).select("-priceHistory");

  if (!product) {
    throw new apiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, product, "Product fetched successfully"));
});

const addStock = asyncHandler(async (req, res) => {
      const { stock }= req.body;

      const incomingsku = req.params.sku?.toUpperCase()

      const product = await Product.findOne({ sku: incomingsku });

      if (!product) {
            throw new apiError(404, "Product not found");
      }

      product.stock += Number(stock);
      await product.save({validateBeforeSave:false});

      res.status(200).json(new apiResponse(200, product, "Stock updated"));
});

module.exports = {
      createProduct,
      getProducts,
      getProduct,
      addStock
}