const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    splitMethod: { type: String, enum: ['equal', 'percentage', 'exact'], required: true }, // Restrict allowed split methods
    participants: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            amountPaid: { type: Number, default: 0 },  // Tracks how much the participant has paid
            amountOwed: { type: Number, default: 0 },  // Tracks how much the participant owes
            percentageShare: { type: Number, default: 0 } // Only used for percentage split
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure the expense creator is tracked
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to handle splitting logic before saving the expense
expenseSchema.pre('save', function (next) {
    const totalAmount = this.amount;

    // Split equally among participants
    if (this.splitMethod === 'equal') {
        const totalParticipants = this.participants.length;
        if (totalParticipants === 0) return next(new Error('At least one participant is required.'));
        
        const splitAmount = totalAmount / totalParticipants;
        this.participants.forEach(participant => {
            participant.amountOwed = splitAmount;
        });
    }

    // Split based on percentage shares
    if (this.splitMethod === 'percentage') {
        let totalPercentage = 0;
        this.participants.forEach(participant => {
            totalPercentage += participant.percentageShare;
            participant.amountOwed = (participant.percentageShare / 100) * totalAmount;
        });

        // Ensure the total percentage equals 100%
        if (totalPercentage !== 100) {
            return next(new Error('The total percentage must equal 100%.'));
        }
    }

    // Split based on exact amounts
    if (this.splitMethod === 'exact') {
        let totalExactAmount = 0;
        this.participants.forEach(participant => {
            totalExactAmount += participant.amountOwed;
        });

        // Ensure the total exact amounts match the expense amount
        if (totalExactAmount !== totalAmount) {
            return next(new Error('The sum of exact amounts must equal the total expense amount.'));
        }
    }

    next();
});

// Ensure timestamps are updated before each save
expenseSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
