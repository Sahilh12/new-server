const express = require('express')

require('dotenv').config({ path: './config/.env' })
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dbConnection = require('./database/dbConnection.js')
const { errorMiddleware } = require('./middlewares/error.js')
const messageRouter = require('./router/messageRoute.js')
const userRouter = require('./router/userRouter.js')
const timelineRouter = require('./router/timelineRoute.js')
const softwareApplicationRouter = require('./router/softwareApplicationRoute.js')
const projectRouter = require('./router/projectRoute.js')
const skillRouter = require('./router/skillRoute.js')
const path = require('path'); 
const multer = require('./utils/multer.js')
// const fileUpload = require('express-fileupload'); 


// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: '/tmp/', // Specify a temporary directory if needed
//   }));




app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/message", messageRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/timeline", timelineRouter)
app.use("/api/v1/application", softwareApplicationRouter)
app.use("/api/v1/project", projectRouter)
app.use("/api/v1/skill", skillRouter)



app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(errorMiddleware)
dbConnection()
module.exports = app