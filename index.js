const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./config/db')
require("colors")
const cors = require("cors")
// connect to database
connectDB()

// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/uploads', express.static("public/uploads"));
app.use(cors())

// Routers
app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/pizzas", require("./routes/pizza.routes"))

// listen server 
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.bgBlue)
})