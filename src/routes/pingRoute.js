const express = require('express');
const { ping } = require('../Controllers/pingFnx.js')

const router = express.Router();
router.get('/ping', ping)

module.exports = router;