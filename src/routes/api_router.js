const express = require('express');
const v1Router = require('./v1/a.index.js')

const apiRouter = express.Router();

apiRouter.use('/v1', v1Router)

module.exports = apiRouter