const app = require('./app.js')
const { PORT } = require('./config/server_config.js');
const connectDB = require('./config/db_config.js')

connectDB()
.then(
      ()=>{
            app.listen(PORT, ()=>{
                  console.log(`Server is running on PORT: ${PORT}`)
            })
      }
)
.catch(
      (err)=>{
            console("DB connection failed");
      }
)