const mongoose = require('mongoose');
const { MONGODB_URL } = require('./server_config.js')

const connectDB = async () => {
      try {
            await mongoose.connect(MONGODB_URL);
            console.log("Database connected successfully")
      } catch (err) {
            console("Failed to connect to database: ", err);
      }
}

module.exports = connectDB