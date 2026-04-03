const { ACCESS_TOKEN_SECRET } = require("../config/server_config");
const { User } = require("../models/user_model");
const apiError = require("../utils/apiResponse_and_handlers/api_error");
const asyncHandler = require("../utils/apiResponse_and_handlers/async_handler");
const jwt =  require('jsonwebtoken')
const cookie = require('cookie')

const verifyjwt = asyncHandler(async(req,res,next) => {
      try {
            const parsedCookies = cookie.parse(req.headers.cookie || "")
            const authorizationHeader = req.header("Authorization")
            const bearerToken = authorizationHeader?.match(/^Bearer\s+(.+)$/i)?.[1]
            const token = parsedCookies.accessToken || bearerToken
      
            if(!token){
                  throw new apiError(401, "Unauthorized request");
            }
      
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      
            const user = await User.findById(decoded?._id).select("-password -refreshToken")
      
            if(!user){
                  throw new apiError(401, "Invalid access token")
            }
      
            req.user = user;
            next();
      } catch (error) {
            throw new apiError(401, error?.message || "Invalid access token")
      }
})

module.exports = verifyjwt