const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

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

app.post("/api/expenses", async (req, res) => {
    console.log('POST /api/expenses body:', req.body);

    try {
        const expense = await Expense.create({
            fromCity: req.body.fromCity,
            toCity: req.body.toCity,
            dateRange: req.body.dateRange,
            passengers: req.body.passengers,
            hotelType: req.body.hotelType,
            foodType: req.body.foodType
        });

        console.log('Saved expense:', expense);
        res.status(201).json({ success: true, message: "Saved", expense });
    } catch (error) {
        console.error('Failed to save expense:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

async function startServer() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not configured in .env");
    }

    // show mongoose connection events
    mongoose.connection.on('connected', () => console.log('MongoDB connected'));
    mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
    mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(port, () => {
        console.log(`Travel Agent running at http://localhost:${port}`);
    });
}

startServer().catch((error) => {
    console.error("Server startup failed:", error);
    process.exitCode = 1;
});