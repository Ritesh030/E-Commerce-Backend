const express = require('express');
const { ping } = require('../../controllers/ping_controller.js')

const pingRouter = express.Router();

pingRouter.get('/',ping)

module.exports = pingRouter;