const express = require('express');
const { PORT } = require('./config/serverConfig.js');
// const { ping } = require('./Controllers/pingFnx.js')
const router  = require('./routes/pingRoute.js')

const app = express();

app.use('/api/v1', router)

app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`)
})