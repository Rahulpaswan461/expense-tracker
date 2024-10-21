const express = require("express");
const { createUser, getUserDetails, loginUser } = require("../controllers/user");

const router = express.Router();

// Route for user registration
router.post("/register", createUser);

// Route for user login
router.post("/login", loginUser);

// Route to retrieve all user details
router.get("/get-users", getUserDetails);

module.exports = router;
