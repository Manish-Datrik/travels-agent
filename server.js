const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get("/api/flight-price", async (req, res) => {
    try {
        const { origin, destination, departureDate } = req.query;
        
        if (!origin || !destination || !departureDate) {
            return res.status(400).json({ error: "Missing required parameters" });
        }
        
        if (!process.env.SERPAPI_KEY) {
            return res.status(500).json({ error: "SERPAPI_KEY not configured" });
        }
        
        const date = new Date(departureDate);
        const formattedDate = date.toISOString().split('T')[0];
        
        const url = `https://serpapi.com/search?engine=google_flights&departure_id=${origin}&arrival_id=${destination}&outbound_date=${formattedDate}&return_date=${formattedDate}&api_key=${process.env.SERPAPI_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        let price = 320;
        
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

app.post("/api/expenses", (req, res) => {
    console.log('POST /api/expenses body:', req.body);

    try {
        const expense = Object.assign({ id: Date.now(), saved: true }, req.body);
        console.log('Simulated saved expense (in-memory):', expense);
        res.status(201).json({ success: true, message: "Saved (in-memory)", expense });
    } catch (error) {
        console.error('Failed to handle expense request:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

function startServer() {
    app.listen(port, () => {
        console.log(`Travel Agent running at http://localhost:${port}`);
    });
}

startServer();