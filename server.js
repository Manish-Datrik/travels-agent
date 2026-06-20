const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
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

app.get("/api/flight-price", async (req, res) => {
    try {
        const { origin, destination, departureDate } = req.query;
        
        if (!origin || !destination || !departureDate) {
            return res.status(400).json({ error: "Missing required parameters" });
        }
        
        if (!process.env.SERPAPI_KEY) {
            return res.status(500).json({ error: "SERPAPI_KEY not configured" });
        }
        
        // Parse the date to YYYY-MM-DD format
        const date = new Date(departureDate);
        const formattedDate = date.toISOString().split('T')[0];
        
        const url = `https://serpapi.com/search?engine=google_flights&departure_id=${origin}&arrival_id=${destination}&outbound_date=${formattedDate}&return_date=${formattedDate}&api_key=${process.env.SERPAPI_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Extract the lowest price from the results
        let price = 320; // Default fallback price
        
        if (data.best_flights && data.best_flights.length > 0) {
            const bestFlight = data.best_flights[0];
            if (bestFlight.price) {
                price = bestFlight.price;
            }
        } else if (data.other_flights && data.other_flights.length > 0) {
            const otherFlight = data.other_flights[0];
            if (otherFlight.price) {
                price = otherFlight.price;
            }
        }
        
        res.json({ price, source: "SerpApi" });
    } catch (error) {
        console.error('Flight price fetch failed:', error);
        res.status(400).json({ error: error.message });
    }
});

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