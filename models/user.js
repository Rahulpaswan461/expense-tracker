const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { createTokenForAuthenticateUser } = require("../services/authJWT");

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is required
    },
    email: {
        type: String,
        required: true,
        unique: true, // Email must be unique
    },
    password: {
        type: String,
        required: true, // Password is required
    },
    phone: {
        type: String,
        required: true, // Phone number is required
    }
}, { timestamps: true }); 

// Pre-save hook to hash the password before saving to the database
userSchema.pre("save", async function (next) {
    const user = this; // Reference to the current user document
    if (!user.isModified("password")) return next(); // If the password hasn't changed, skip hashing

    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(user.password, salt); // Hash the password

        user.password = hashedPassword; // Set the hashed password
        next(); // Proceed to save the user
    } catch (error) {
        return next(error); // Pass any errors to the next middleware
    }
});

// Static method to match password and generate JWT token
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email }); // Find user by email

    if (!user) {
        throw new Error("Invalid username or password"); // User not found
    }

    const hashedPassword = user.password; // Get hashed password

    const isMatch = await bcrypt.compare(password, hashedPassword); // Compare input password with hashed password

    if (isMatch) {
        const token = createTokenForAuthenticateUser(user); // Generate a token for authenticated user
        return token; // Return the generated token
    } else {
        throw new Error("Invalid username or password"); // Password mismatch
    }
});

// Create User model
const User = mongoose.model("User", userSchema); // Use "User" as the model name for better clarity

module.exports = User; // Export the User model
