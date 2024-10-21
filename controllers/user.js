const User = require("../models/user");

// Controller to create a new user
async function createUser(req, res) {
    try {
        // Destructure the request body
        const { name, email, phone, password } = req.body;

        // Validate the required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ error: "Incomplete Information !!!" });
        }

        // Create a new user instance
        let user = new User({
            name,
            email,
            phone,
            password // Password will be hashed in the pre-save hook
        });

        // Save the user to the database
        user = await user.save();

        // Check if the user was created successfully
        if (!user) {
            return res.status(400).json({ error: "No user created !!" });
        }

        // Respond with the created user
        return res.status(201).json(user);
    } catch (error) {
        console.log("There is some error", error.message);
        return res.status(500).json({ error: "Internal server error !!" });
    }
}

// Controller for user login
async function loginUser(req, res) {
    try {
        // Destructure the request body
        const { email, password } = req.body;

        // Validate the required fields
        if (!email || !password) {
            return res.status(400).json({ error: "Incomplete Information !!" });
        }

        // Generate token using email and password
        const token = await User.matchPasswordAndGenerateToken(email, password);

        // Respond with the token in a cookie
        return res.cookie("token", token).status(200).json({ token });
    } catch (error) {
        console.log("There is some error", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Controller to get details of all users
async function getUserDetails(req, res) {
    try {
        const users = await User.find({}); // Find all users

        // Check if any users are available
        if (!users.length) {
            return res.status(400).json({ error: "No users available !!" });
        }

        // Respond with the list of users
        return res.status(200).json(users);
    } catch (error) {
        console.log("There is some error", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    createUser,
    getUserDetails,
    loginUser
};
