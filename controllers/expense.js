const { default: mongoose } = require("mongoose");
const Expense = require("../models/expense");

// Controller to add a new expense
async function addExpenses(req, res) {
    try {
        // Destructure the request body
        const { amount, description, participants, splitMethod, createdBy } = req.body;

        // Update participants to set the amount paid by the creator
        const updatedParticipants = participants.map(participant => {
            if (participant.userId === createdBy) {
                participant.amountPaid = amount; // Creator pays the full amount
            }
            return participant;
        });

        // Create a new expense instance
        const expense = new Expense({
            amount,
            description,
            participants: updatedParticipants,
            splitMethod,
            createdBy: req.user._id // Assuming user ID comes from the authenticated user
        });

        // Save the expense to the database
        await expense.save();

        // Check if the expense was created successfully
        if (!expense) {
            return res.status(400).json({ error: "No expense is created ::" });
        }

        // Respond with the created expense
        return res.status(200).json(expense);
    } catch (error) {
        console.log("There is some error", error.message);
        return res.status(500).json({ error: "Internal Server Error : " });
    }
}

// Controller to get expenses for a specific user
async function getUserExpense(req, res) {
    try {
        // Validate the user ID parameter
        if (!mongoose.isValidObjectId(req.params.userId)) {
            return res.status(400).json({ error: "Invalid user id : " });
        }

        // Find expenses related to the user
        const expense = await Expense.find({ 'participants.userId': req.params.userId });

        // Check if any expenses are found
        if (!expense || expense.length === 0) {
            return res.status(400).json({ error: "No expenses are present for the current user !!" });
        }

        // Respond with the user's expenses
        return res.status(200).json(expense);
    } catch (error) {
        console.log("There is some error", error.message);
        return res.status(500).json({ error: "Internal Server Error : " });
    }
}

// Controller to get all expenses
async function getAllexpenses(req, res) {
    try {
        const expenseDetails = await Expense.find({}); // Retrieve all expenses

        // Check if any expenses are found
        if (!expenseDetails || expenseDetails.length === 0) {
            return res.status(400).json({ error: "No expenses are present !!" });
        }

        let allExpensesSummary = []; // To store detailed expense summary for each expense

        // Loop through each expense
        expenseDetails.forEach(expense => {
            let expenseSummary = {
                expenseId: expense._id,
                description: expense.description,
                totalAmount: expense.amount,
                splitMethod: expense.splitMethod,
                participants: []
            };

            // Calculate and store participant details for each expense
            expense.participants.forEach(participant => {
                let participantSummary = {
                    userId: participant.userId,
                    name: participant.name,  // Assuming participant has a name field
                    amountPaid: participant.amountPaid || 0,
                    amountOwed: participant.amountOwed || 0,
                    percentageShare: participant.percentageShare || null  // If split by percentage
                };

                // Calculate owed amount for percentage-based splits
                if (expense.splitMethod === 'percentage' && participant.percentageShare) {
                    participantSummary.amountOwed = (expense.amount * (participant.percentageShare / 100)).toFixed(2);
                }

                // Add participant summary to expense summary
                expenseSummary.participants.push(participantSummary);
            });

            // Add this expense summary to the overall summary
            allExpensesSummary.push(expenseSummary);
        });

        // Respond with the detailed summary of all expenses
        return res.status(200).json(allExpensesSummary);
        
    } catch (error) {
        console.log("There is some error", error.message);
        return res.status(500).json({ error: "Internal Server Error : " });
    }
}

// Controller to download the balance sheet for a user
async function downloadBalanceSheet(req, res) {
    try {
        const userId = req.params.userId;

        // Fetch all expenses the user is involved in
        const userExpenses = await Expense.find({ 'participants.userId': userId });

        if (!userExpenses || userExpenses.length === 0) {
            return res.status(404).json({ message: 'No expenses found for this user' });
        }

        let balanceSheet = `Balance Sheet for User ID: ${userId}\n\n`;

        // Loop through each expense
        userExpenses.forEach(expense => {
            let totalGroupExpense = expense.amount; // Overall group expense
            balanceSheet += `Expense: ${expense.description}\n`;
            balanceSheet += `Total Group Expense: ${totalGroupExpense.toFixed(2)}\n`;
            balanceSheet += `Split Method: ${expense.splitMethod}\n`;

            // Loop through all participants in the expense
            balanceSheet += `\nParticipants:\n`;
            expense.participants.forEach(participant => {
                const amountPaid = participant.amountPaid || 0;
                let amountOwed = 0;

                // Calculate how much the participant owes based on the split method
                if (expense.splitMethod === 'percentage') {
                    amountOwed = (expense.amount * (participant.percentageShare / 100)).toFixed(2);
                } else {
                    amountOwed = participant.amountOwed || 0;
                }

                // Append individual participant's details to the balance sheet
                balanceSheet += `Participant ID: ${participant.userId}\n`;
                balanceSheet += `Amount Paid: ${parseFloat(amountPaid).toFixed(2)}\n`;
                balanceSheet += `Amount Owed: ${parseFloat(amountOwed).toFixed(2)}\n`;
                balanceSheet += `--------------------------------------\n`;
            });

            balanceSheet += `\n--------------------------------------\n`;
        });

        // Generate a downloadable file
        res.setHeader('Content-disposition', 'attachment; filename=balance-sheet.txt');
        res.set('Content-Type', 'text/plain');
        res.status(200).send(balanceSheet);

    } catch (error) {
        console.log("Error generating balance sheet:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    addExpenses,
    getUserExpense,
    getAllexpenses,
    downloadBalanceSheet
};
