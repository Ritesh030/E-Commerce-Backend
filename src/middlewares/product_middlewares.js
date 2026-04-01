const {errorResponse} = require('../utils/error_response.js')
const badreq = require('../errors/bad_req_error.js')

function productValidator(req, res, next) {
      // if (!req.body.title) {
      //       return res.status(400).json({
      //             success: false,
      //             error: {
      //                   message: "title is required"
      //             },
      //             data: {}
      //       })
      // }
      //since this code is so much mess therefore we will write a util fuction for the error message
      if(!req.body.title){
            return res.status(400).json(errorResponse("title is required", new badreq('something went wrong')))
      }

      next()
}

module.exports = { productValidator }