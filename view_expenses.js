const mongoose = require('mongoose');
require('dotenv').config();

const expenseSchema = new mongoose.Schema(
    {
        fromCity: { type: String, required: true, trim: true },
        toCity: { type: String, required: true, trim: true },
        dateRange: { type: String, required: true },
        passengers: { type: Number, required: true, min: 1 },
        hotelType: { type: String, required: true },
        foodType: { type: Number, required: true, min: 0 }
    },
    { collection: "expenses", timestamps: true, strict: "throw" }
);

const Expense = mongoose.model("Expense", expenseSchema);

async function viewExpenses() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const expenses = await Expense.find();
        console.log('\n=== ALL SAVED EXPENSES ===\n');
        console.log(JSON.stringify(expenses, null, 2));
        console.log(`\nTotal expenses: ${expenses.length}`);

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
        process.exitCode = 1;
    }
}

viewExpenses();
