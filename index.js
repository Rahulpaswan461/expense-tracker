require("dotenv").config()
const express  = require("express")
const userRoute = require("./routes/user")
const {connectMongoDB} = require("./connection")
const bodyParser = require("body-parser")
const expenseRoute = require("./routes/expense")
const cookieParser = require("cookie-parser")
const {checkForAuthenticatedUser} = require("./middlewares/authentication")

const app = express()
const PORT = process.env.PORT || 8000;

connectMongoDB(process.env.MONGO_URL)
.then(()=> console.log("MongoDB is connected successfully !!"))
.catch((error) => console.log("There is some error while connecting !!",error.message))

app.get("/",(req,res)=>{
    return res.send("from the server")
})

app.use(bodyParser.json())
app.use(cookieParser())
app.use(checkForAuthenticatedUser("token"))

app.use('/api/user',userRoute)
app.use('/api/expense',expenseRoute)

app.listen(PORT,()=>{
    console.log("Server is running at PORT 8000")
})