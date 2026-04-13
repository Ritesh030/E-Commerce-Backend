const mongoose = require('mongoose');
const { Schema } = mongoose
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = require('../config/server_config');

const userSchema = new Schema(
      {
            username: {
                  type: String,
                  required: true,
                  lowercase: true,
                  unique: true,
                  trim: true,
                  index: true
            },
            fullname: {
                  type: String,
                  required: true,
                  trim: true
            },
            email: {
                  type: String,
                  required: true,
                  unique: true,
                  index: true
            },
            password: {
                  type: String,
                  required: [true, "Password is required"]
            },
            refreshToken: {
                  type: String
            },
            role: {
                  type: String,
                  enum: ["user","admin"],
                  default: "user"
            }
      }, {timestamps: true}
)

userSchema.pre("save", async function () {
      if(this.isModified("password")){
            this.password = await bcrypt.hash(this.password, 10)
      }
})

userSchema.methods.generateAccessToken = function (){
      return jwt.sign(
            {
                  _id: this._id,
                  email: this.email,
                  username: this.username
            },
            ACCESS_TOKEN_SECRET,
            {
                  expiresIn: ACCESS_TOKEN_EXPIRY
            }
      )
}

userSchema.methods.generateRefreshToken = function () {
      return jwt.sign(
            {
                  _id: this._id,
            },
            REFRESH_TOKEN_SECRET,
            {
                  expiresIn: REFRESH_TOKEN_EXPIRY
            }
      )
}

userSchema.methods.checkPassword = async function (password){
      return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema);
module.exports = User;