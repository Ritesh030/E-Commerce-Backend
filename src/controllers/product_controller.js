const { createProduct, getproducts } = require('../service/product_service.js')

function productController(req,res) {

      try {
            const response = createProduct(req.body)
      
            return res.json({
                  success: true,
                  error: "",
                  data: response
            })
      } catch (error) {
            console.log("error", error)
      }
}

function getProducts(req,res){
      try {
            const allProducts = getproducts()
            return res.json({
                  success: true,
                  error: "",
                  data: allProducts
            })
      } catch (error) {
            console.log("Error: ", error)
      }
}

function getProduct(req,res){
      try {
            const allProducts = getproducts();
            const prod = allProducts.filter(product => product.id == req.params.id)
            return res.json({
                  success: true,
                  error: "",
                  data: prod
            })
      } catch (error) {
            console.log("Error: ", error)
      }
}

module.exports = {
      productController,
      getProducts,
      getProduct
}