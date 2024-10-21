const express = require("express");
const { addExpenses, getUserExpense, getAllexpenses, downloadBalanceSheet } = require("../controllers/expense");

const router = express.Router();

// Route to add a new expense
router.post("/add", addExpenses);

// Route to get expenses for a specific user by userId
router.get("/get/:userId", getUserExpense);

// Route to retrieve all expenses for all users
router.get("/get-all", getAllexpenses);

// Route to download the balance sheet for a specific user by userId
router.get("/balance-sheet/:userId", downloadBalanceSheet);

module.exports = router;
