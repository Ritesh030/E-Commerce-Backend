const express = require('express');
const { PORT } = require('./config/server_config.js');
const apiRouter = require('./routes/api_router.js')

const app = express();

app.use('/api', apiRouter)

app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`)
})