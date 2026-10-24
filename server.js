
const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = Number(process.env.PORT) || 6001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const SERPAPI_URL = "https://serpapi.com/search.json";

function formatDate(value) {
    if (!value || typeof value !== "string") return null;

    let year, month, day;
    let match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (match) {
        [, year, month, day] = match;
    } else {
        match = value.trim().match(/^([A-Za-z]{3})\s+(\d{1,2}),\s*(\d{4})$/);

        if (!match) return null;

        const months = {
            jan: "01", feb: "02", mar: "03", apr: "04",
            may: "05", jun: "06", jul: "07", aug: "08",
            sep: "09", oct: "10", nov: "11", dec: "12"
        };

        month = months[match[1].toLowerCase()];
        day = match[2].padStart(2, "0");
        year = match[3];

        if (!month) return null;
    }

    const formatted = `${year}-${month}-${day}`;
    const parsed = new Date(`${formatted}T00:00:00Z`);

    if (
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== formatted
    ) {
        return null;
    }

    return formatted;
}

async function fetchSerpApi(params) {
    const url = new URL(SERPAPI_URL);

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
    }

    const response = await fetch(url, {
        signal: AbortSignal.timeout(30000)
    });

    const data = await response.json();

    if (!response.ok || data.error) {
        throw new Error(
            data.error || `SerpApi request failed: ${response.status}`
        );
    }

    return data;
}

async function resolveLocation(input) {
    const searchTerm = input.trim();
    const searchTerms = [
        searchTerm,
        searchTerm.split(",")[0].trim()
    ].filter((term, index, terms) => terms.indexOf(term) === index);

    let suggestions = [];

    for (const term of searchTerms) {
        const data = await fetchSerpApi({
            engine: "google_flights_autocomplete",
            q: term,
            gl: "in",
            hl: "en",
            api_key: process.env.SERPAPI_KEY
        });

        suggestions = data.suggestions || [];

        if (suggestions.length) break;
    }

    if (!suggestions.length) {
        throw new Error(`No matching city or airport found for "${input}".`);
    }

    const normalize = value =>
        String(value || "").trim().toLowerCase();

    const searchName = searchTerm.split(",")[0].trim();

    const selected =
        suggestions.find(item => normalize(item.name) === normalize(searchName)) ||
        suggestions.find(item => item.type === "city" && item.id) ||
        suggestions.find(item => item.airports?.length > 0) ||
        suggestions.find(item => item.id);

    if (!selected) {
        throw new Error(`Could not resolve "${input}".`);
    }

    if (selected.id) return selected.id;

    if (selected.airports?.[0]?.id) {
        return selected.airports[0].id;
    }

    throw new Error(`No usable flight-search location found for "${input}".`);
}

app.get("/api/flight-price", async (req, res) => {
    try {
        const {
            origin,
            destination,
            departureDate,
            returnDate,
            travelers = "1"
        } = req.query;

        if (
            typeof origin !== "string" ||
            typeof destination !== "string" ||
            typeof departureDate !== "string" ||
            !origin.trim() ||
            !destination.trim() ||
            !departureDate.trim()
        ) {
            return res.status(400).json({
                success: false,
                error: "Origin, destination and departure date are required."
            });
        }

        if (!process.env.SERPAPI_KEY) {
            return res.status(500).json({
                success: false,
                error: "SERPAPI_KEY is missing from the .env file."
            });
        }

        const passengerCount = Number(travelers);

        if (
            !Number.isInteger(passengerCount) ||
            passengerCount < 1 ||
            passengerCount > 9
        ) {
            return res.status(400).json({
                success: false,
                error: "Travelers must be between 1 and 9."
            });
        }

        const outboundDate = formatDate(departureDate);
        const inboundDate = returnDate ? formatDate(returnDate) : null;

        if (!outboundDate) {
            return res.status(400).json({
                success: false,
                error: "Invalid departure date."
            });
        }

        if (returnDate && !inboundDate) {
            return res.status(400).json({
                success: false,
                error: "Invalid return date."
            });
        }

        if (inboundDate && inboundDate < outboundDate) {
            return res.status(400).json({
                success: false,
                error: "Return date cannot be before departure date."
            });
        }

        const [departureId, arrivalId] = await Promise.all([
            resolveLocation(origin),
            resolveLocation(destination)
        ]);

        if (departureId === arrivalId) {
            return res.status(400).json({
                success: false,
                error: "Origin and destination must be different."
            });
        }

        const flightParams = {
            engine: "google_flights",
            departure_id: departureId,
            arrival_id: arrivalId,
            outbound_date: outboundDate,
            type: inboundDate ? "1" : "2",
            adults: passengerCount,
            currency: "USD",
            hl: "en",
            gl: "in",
            sort_by: "2",
            api_key: process.env.SERPAPI_KEY
        };

        if (inboundDate) {
            flightParams.return_date = inboundDate;
        }

        const flightData = await fetchSerpApi(flightParams);

        const flights = [
            ...(flightData.best_flights || []),
            ...(flightData.other_flights || [])
        ];

        const availableFlights = flights
            .filter(flight =>
                typeof flight.price === "number" &&
                Number.isFinite(flight.price) &&
                flight.price > 0
            )
            .sort((a, b) => a.price - b.price);

        if (!availableFlights.length) {
            return res.status(404).json({
                success: false,
                error: "No priced flights were found for this route and date."
            });
        }

        const cheapestFlight = availableFlights[0];

        return res.json({
            success: true,
            source: "SerpApi",
            currency: "USD",
            price: cheapestFlight.price,
            origin: departureId,
            destination: arrivalId,
            departureDate: outboundDate,
            returnDate: inboundDate,
            travelers: passengerCount,
            flight: cheapestFlight
        });
    } catch (error) {
        console.error("Flight search failed:", error.message);

        return res.status(502).json({
            success: false,
            error: error.message || "Unable to retrieve flight prices."
        });
    }
});

app.post("/api/expenses", (req, res) => {
    try {
        const expense = {
            id: Date.now(),
            ...req.body
        };

        console.log("Expense received:", expense);

        return res.status(201).json({
            success: true,
            message: "Expense received but not permanently stored.",
            expense
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Travel Agent server is running."
    });
});

app.listen(port, () => {
    console.log(`Travel Agent running at http://localhost:${port}`);
});
