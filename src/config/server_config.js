const dotenv = require('dotenv');
dotenv.config();

module.exports = {
      PORT: process.env.PORT || 3000,
      MONGODB_URL: process.env.MONGODB_URL,
      ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
      REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY
}