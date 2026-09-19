const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./utils/db")
const router = require("./routes/userRoutes")
const propertyRouter = require("./routes/propertyRoutes")
const bookingRouter = require('./routes/bookingRoutes')
const tripRouter = require("./routes/tripROuter")
dotenv.config()

const app = express()

app.use(express.json({limit:"100mb"}))
app.use(express.urlencoded({limit:"100mb" , extended:true}))
app.use(cookieParser())
app.use(cors({
    origin:process.env.ORIGIN_ACCESS_URL,
    credentials:true
}))

const port = process.env.PORT

app.get("/" , (req , res)=>{
    res.send("HomelyHub server is running")
})

app.use("/api/v1/rent/user" , router)
app.use("/api/v1/rent/listing" , propertyRouter)
app.use("/api/v1/rent/user/booking" , bookingRouter)
app.use("/api/v1/rent/trip" , tripRouter)

connectDB()

app.listen(port,()=> {
    console.log(`App is running on port no: ${port}`)
})