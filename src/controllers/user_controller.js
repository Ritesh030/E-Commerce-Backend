const asyncHandler = require('../utils/apiResponse_and_handlers/async_handler.js')
const apiError = require('../utils/apiResponse_and_handlers/api_error.js')
const { User } = require('../models/user_model.js')
const apiResponse = require('../utils/apiResponse_and_handlers/api_response.js')
const jwt = require('jsonwebtoken')
const { REFRESH_TOKEN_SECRET } = require('../config/server_config.js')

const getCookieOptions = () => ({
      httpOnly: true,
      secure: true,
})

const registerUser = asyncHandler(async (req, res) => {
      const { username, fullname, email, password } = req.body

      if ([username, fullname, email, password].some((x) => x?.trim() === "")) {
            throw new apiError(400, "All fields are required")
      }

      const existeduser = await User.findOne({
            $or: [{ username }, { email }]
      })

      if (existeduser) {
            throw new apiError(400, "User already exists")
      }

      if (!(/^[^@]+@gmail\.com$/.test(email))) {
            throw new apiError(400, "Enter correct email")
      }

      const userInstance = await User.create({
            username: username.toLowerCase(),
            fullname,
            email,
            password
      })

      const createdUser = await User.findById(userInstance._id).select("-password -refreshToken")

      if (!createdUser) {
            throw new apiError(400, "Something went wrong while creating a user")
      }

      return res.status(200).json(
            new apiResponse(200, createdUser, "User registered successfully")
      )
})

const generateAccessAndRefreshToken = async (userId) => {
      try {
            const user = await User.findById(userId);

            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            return { accessToken, refreshToken }
      } catch (err) {
            throw new apiError(400, "Something went wrong while generating tokens")
      }
}

const loginUser = asyncHandler(async (req, res) => {
      const { username, email, password } = req.body;

      if (!(email || username)) {
            throw new apiError(400, "username or email is required")
      }

      const user = await User.findOne({
            $or: [{ username }, { email }]
      })

      if (!user) {
            throw new apiError(400, "No User found with this username or email")
      }

      const isPasswordValid = await user.checkPassword(password)

      if (!isPasswordValid) {
            throw new apiError(400, "Enter correct password")
      }

      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)


      const loggedInUser = user.toObject();
      delete loggedInUser.password;
      delete loggedInUser.refreshToken;

      const options = getCookieOptions()
      return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                  new apiResponse(
                        200,
                        {
                              user: loggedInUser, accessToken, refreshToken
                        },
                        "User loggedIn successfully"
                  )
            )

})

const logoutUser = asyncHandler(async (req, res) => {
      await User.findByIdAndUpdate(
            req.user._id,
            {
                  $set: {
                        refreshToken: undefined
                  }
            },
            {
                  new: true
            }
      )

      const options = getCookieOptions()

      return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new apiResponse(200, {}, "User loggedOut"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
      const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (!incomingRefreshToken) {
            throw new apiError(401, "Anuthorized request")
      }

      try {
            const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET)

            const user = await User.findById(decodedToken?._id)

            if (!user) {
                  throw new apiError(401, "Invalid refresh token")
            }

            if (incomingRefreshToken !== user.refreshToken) {
                  throw new apiError(401, "Refresh Token expired or used")
            }

            const options = getCookieOptions();

            const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

            return res
                  .status(200)
                  .cookie("accessToken", accessToken, options)
                  .cookie("refreshToken", refreshToken, options)
                  .json(
                        new apiResponse(
                              200,
                              { accessToken, refreshToken: refreshToken },
                              "Access Token refreshed"
                        )
                  )
      } catch (error) {
            throw new apiError(400, error?.message || "Invalid Refresh Token")
      }
})

module.exports = {
      registerUser,
      loginUser,
      logoutUser,
      refreshAccessToken
}