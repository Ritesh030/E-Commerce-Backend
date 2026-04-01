// in memory

const Products = []

function createProduct(product) {
      const newProduct = {
            id : Products.length,
            ...product
      }
      Products.push(newProduct);
      return newProduct
}
function getproducts(){
      return Products
}

module.exports = {
      createProduct,
      getproducts
}