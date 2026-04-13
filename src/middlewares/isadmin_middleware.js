const apiError = require("../utils/apiResponse_and_handlers/api_error");
const asyncHandler = require("../utils/apiResponse_and_handlers/async_handler");

const isAdmin = asyncHandler(async (req,res,next) => {
      const role = req.user.role

      if(!role){
            throw new apiError(400, "Defining Role for user is needed")
      }

      if(role !== "admin"){
            throw new apiError(401, "Only admin can do this task")
      }

      next()
})

module.exports = isAdmin