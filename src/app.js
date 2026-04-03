const express = require('express');
const apiRouter = require('./routes/api_router.js')
const bodyparser = require('body-parser')
const responseTime = require('response-time')

const app = express();

// app.use(responseTime(function (req,res,time){
//       console.log(time); // the time will be in miliseconds
//       res.setHeader('x-response-time', time);
// }));
app.use(responseTime()) //this will add a header x-response-time to the response 

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.text())


app.use('/api', apiRouter)

module.exports = app