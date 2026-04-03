const express = require('express');
const apiRouter = require('./routes/api_router.js')
const bodyparser = require('body-parser')
const responseTime = require('response-time')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { CORS_ORIGIN } = require('./config/server_config.js')

const app = express();

// app.use(responseTime(function (req,res,time){
//       console.log(time); // the time will be in miliseconds
//       res.setHeader('x-response-time', time);
// }));
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(responseTime()) //this will add a header x-response-time to the response 

app.use(express.json({ limit: "16kb" })); 
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(bodyparser.text())
app.use(cookieParser());
app.use(express.static("public"));



app.use('/api', apiRouter)

module.exports = app