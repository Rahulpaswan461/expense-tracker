// Load environment variables from the .env file
require("dotenv").config();

// Import necessary modules
const express = require("express");
const userRoute = require("./routes/user");
const { connectMongoDB } = require("./connection");
const bodyParser = require("body-parser");
const expenseRoute = require("./routes/expense");
const cookieParser = require("cookie-parser");
const { checkForAuthenticatedUser } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000; // Set the port number from environment variables or default to 8000

// Connect to MongoDB
connectMongoDB(process.env.MONGO_URL)
  .then(() => console.log("MongoDB is connected successfully !!"))
  .catch((error) => console.log("There is some error while connecting !!", error.message));

// Define a simple route for server status
app.get("/", (req, res) => {
  return res.send("from the server");
});

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware to check for authenticated users using the provided token
app.use(checkForAuthenticatedUser("token"));

// User-related routes
app.use('/api/user', userRoute);

// Expense-related routes
app.use('/api/expense', expenseRoute);

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log("Server is running at PORT", PORT);
});
