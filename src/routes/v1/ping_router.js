const express = require('express');
const { ping } = require('../../controllers/ping_controller.js')

const pingRouter = express.Router();

function m1(req,res,next){
      console.log("m1");
      next();
      console.log("m1endded");
}

function m2(req,res,next){
      console.log("m2");
      next();
      console.log("endded m2");
}

pingRouter.get('/',[m1,m2] ,ping)

module.exports = pingRouter;