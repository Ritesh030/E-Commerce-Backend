function productController(req,res) {

      //some db calls 

      res.json({
            success: true,
            error: "",
            data:{
                  title:"",
                  price:"",
                  description:"",
                  image:""
            }
      })
}

module.exports = {
      productController
}