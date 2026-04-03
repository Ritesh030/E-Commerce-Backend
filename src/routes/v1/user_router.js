const express = require('express');
const { registerUser, loginUser, logoutUser, refreshAccessToken } = require('../../controllers/user_controller');
const verifyjwt = require('../../middlewares/auth_middleware');
const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/logout',verifyjwt ,logoutUser)
userRouter.post('/refresh-token', refreshAccessToken)

module.exports = userRouter