const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware: CORS
const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ||
    "https://manish-datrik.github.io,http://localhost:6003,http://127.0.0.1:6003"
).split(",").map(origin => origin.trim()).filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (such as mobile apps, curl, same-origin)
        if (!origin) return callback(null, true);
        // Allow Vercel preview & production domains, GitHub Pages, and localhost
        if (
            origin.endsWith(".vercel.app") ||
            origin.includes("localhost") ||
            origin.includes("127.0.0.1") ||
            allowedOrigins.length === 0 ||
            allowedOrigins.includes(origin)
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets from public directory
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Fallback route for root homepage
app.get("/", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), err => {
        if (err) next();
    });
});

const SERPAPI_URL = "https://serpapi.com/search.json";

const POPULAR_AIRPORTS = [
    { code: "DEL", name: "Indira Gandhi International Airport", city: "Delhi", country: "India" },
    { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", country: "India" },
    { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India" },
    { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore", country: "India" },
    { code: "MAA", name: "Chennai International Airport", city: "Chennai", country: "India" },
    { code: "CCU", name: "Netaji Subhash Chandra Bose International Airport", city: "Kolkata", country: "India" },
    { code: "GOI", name: "Dabolim Airport", city: "Goa", country: "India" },
    { code: "GOX", name: "Manohar International Airport (Mopa)", city: "Goa", country: "India" },
    { code: "COK", name: "Cochin International Airport", city: "Kochi", country: "India" },
    { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", country: "India" },
    { code: "PNQ", name: "Pune International Airport", city: "Pune", country: "India" },
    { code: "JAI", name: "Jaipur International Airport", city: "Jaipur", country: "India" },
    { code: "SXR", name: "Sheikh ul-Alam International Airport", city: "Srinagar (Kashmir)", country: "India" },
    { code: "LKO", name: "Chaudhary Charan Singh International Airport", city: "Lucknow", country: "India" },
    { code: "IXC", name: "Shaheed Bhagat Singh International Airport", city: "Chandigarh", country: "India" },
    { code: "TRV", name: "Trivandrum International Airport", city: "Thiruvananthapuram", country: "India" },
    { code: "GAU", name: "Lokpriya Gopinath Bordoloi International Airport", city: "Guwahati", country: "India" },
    { code: "ATQ", name: "Sri Guru Ram Dass Jee International Airport", city: "Amritsar", country: "India" },
    { code: "VNS", name: "Lal Bahadur Shastri International Airport", city: "Varanasi", country: "India" },
    { code: "IXE", name: "Mangalore International Airport", city: "Mangalore", country: "India" },
    { code: "CJB", name: "Coimbatore International Airport", city: "Coimbatore", country: "India" },
    { code: "BBI", name: "Biju Patnaik International Airport", city: "Bhubaneswar", country: "India" },
    { code: "IDR", name: "Devi Ahilyabai Holkar Airport", city: "Indore", country: "India" },
    { code: "VTZ", name: "Visakhapatnam International Airport", city: "Visakhapatnam", country: "India" },
    { code: "PAT", name: "Jay Prakash Narayan Airport", city: "Patna", country: "India" },
    { code: "IXB", name: "Bagdogra International Airport", city: "Siliguri / Darjeeling", country: "India" },
    { code: "NAG", name: "Dr. Babasaheb Ambedkar International Airport", city: "Nagpur", country: "India" },
    { code: "TRZ", name: "Tiruchirappalli International Airport", city: "Tiruchirappalli", country: "India" },
    { code: "VGA", name: "Vijayawada International Airport", city: "Vijayawada", country: "India" },
    { code: "IXR", name: "Birsa Munda Airport", city: "Ranchi", country: "India" },
    { code: "BDQ", name: "Vadodara Airport", city: "Vadodara", country: "India" },
    { code: "UDR", name: "Maharana Pratap Airport", city: "Udaipur", country: "India" },
    { code: "IXZ", name: "Veer Savarkar International Airport", city: "Port Blair (Andaman)", country: "India" },
    { code: "DED", name: "Jolly Grant Airport", city: "Dehradun", country: "India" },
    { code: "IXJ", name: "Jammu Airport", city: "Jammu", country: "India" },
    { code: "IXL", name: "Kushok Bakula Rimpochee Airport", city: "Leh (Ladakh)", country: "India" },

    { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "United Arab Emirates" },
    { code: "DWC", name: "Al Maktoum International Airport", city: "Dubai", country: "United Arab Emirates" },
    { code: "AUH", name: "Zayed International Airport", city: "Abu Dhabi", country: "United Arab Emirates" },
    { code: "SHJ", name: "Sharjah International Airport", city: "Sharjah", country: "United Arab Emirates" },
    { code: "SIN", name: "Singapore Changi Airport", city: "Singapore", country: "Singapore" },
    { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand" },
    { code: "DMK", name: "Don Mueang International Airport", city: "Bangkok", country: "Thailand" },
    { code: "HKT", name: "Phuket International Airport", city: "Phuket", country: "Thailand" },
    { code: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia" },
    { code: "DPS", name: "Ngurah Rai International Airport", city: "Bali", country: "Indonesia" },
    { code: "MLE", name: "Velana International Airport", city: "Male", country: "Maldives" },
    { code: "CMB", name: "Bandaranaike International Airport", city: "Colombo", country: "Sri Lanka" },
    { code: "KTM", name: "Tribhuvan International Airport", city: "Kathmandu", country: "Nepal" },
    { code: "LHR", name: "London Heathrow Airport", city: "London", country: "United Kingdom" },
    { code: "LGW", name: "London Gatwick Airport", city: "London", country: "United Kingdom" },
    { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
    { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
    { code: "AMS", name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "Netherlands" },
    { code: "ZRH", name: "Zurich Airport", city: "Zurich", country: "Switzerland" },
    { code: "FCO", name: "Leonardo da Vinci–Fiumicino Airport", city: "Rome", country: "Italy" },
    { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey" },
    { code: "DOH", name: "Hamad International Airport", city: "Doha", country: "Qatar" },
    { code: "JED", name: "King Abdulaziz International Airport", city: "Jeddah", country: "Saudi Arabia" },
    { code: "RUH", name: "King Khalid International Airport", city: "Riyadh", country: "Saudi Arabia" },
    { code: "MCT", name: "Muscat International Airport", city: "Muscat", country: "Oman" },
    { code: "KWI", name: "Kuwait International Airport", city: "Kuwait City", country: "Kuwait" },
    { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "United States" },
    { code: "EWR", name: "Newark Liberty International Airport", city: "New York / Newark", country: "United States" },
    { code: "SFO", name: "San Francisco International Airport", city: "San Francisco", country: "United States" },
    { code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "United States" },
    { code: "ORD", name: "O'Hare International Airport", city: "Chicago", country: "United States" },
    { code: "YYZ", name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada" },
    { code: "SYD", name: "Sydney Kingsford Smith Airport", city: "Sydney", country: "Australia" },
    { code: "MEL", name: "Melbourne Airport", city: "Melbourne", country: "Australia" },
    { code: "HND", name: "Tokyo Haneda Airport", city: "Tokyo", country: "Japan" },
    { code: "NRT", name: "Narita International Airport", city: "Tokyo", country: "Japan" },
    { code: "ICN", name: "Incheon International Airport", city: "Seoul", country: "South Korea" },
    { code: "HKG", name: "Hong Kong International Airport", city: "Hong Kong", country: "Hong Kong" }
];

function formatDate(value) {
    if (!value || typeof value !== "string") return null;

    let year, month, day;
    let match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (match) {
        [, year, month, day] = match;
    } else {
        match = value.trim().match(/^([A-Za-z]{3})\s+(\d{1,2}),?\s*(\d{4})$/);

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
    const raw = String(input || "").trim();
    if (!raw) {
        throw new Error("Location cannot be empty.");
    }

    if (/^[A-Za-z]{3}$/.test(raw)) {
        return raw.toUpperCase();
    }

    const parenMatch = raw.match(/\(([A-Za-z]{3})\)/);
    if (parenMatch) {
        return parenMatch[1].toUpperCase();
    }

    const rawLower = raw.toLowerCase();
    const localMatch = POPULAR_AIRPORTS.find(a => 
        a.code.toLowerCase() === rawLower ||
        a.name.toLowerCase() === rawLower ||
        a.city.toLowerCase() === rawLower ||
        rawLower.includes(a.name.toLowerCase()) ||
        rawLower.includes(a.city.toLowerCase())
    );

    if (localMatch) {
        return localMatch.code;
    }

    const parts = raw.split(",").map(p => p.trim()).filter(Boolean);
    const candidates = [];

    if (parts[0]) {
        candidates.push(parts[0]);
        const stripped = parts[0].replace(/\b(international|airport|city|station)\b/gi, "").trim();
        if (stripped && stripped !== parts[0]) candidates.push(stripped);
    }

    if (parts.length > 1) {
        candidates.push(parts[1]);
    }

    candidates.push(raw);

    const uniqueCandidates = [...new Set(candidates.filter(c => c && c.length >= 2))];

    let suggestions = [];

    for (const term of uniqueCandidates) {
        try {
            const data = await fetchSerpApi({
                engine: "google_flights_autocomplete",
                q: term,
                gl: "in",
                hl: "en",
                api_key: process.env.SERPAPI_KEY
            });

            if (data && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
                suggestions = data.suggestions;
                break;
            }
        } catch (err) {
            continue;
        }
    }

    if (!suggestions.length) {
        throw new Error(`No matching airport or flight destination found for "${raw}".`);
    }

    const selected =
        suggestions.find(item => item.airports && item.airports.length > 0) ||
        suggestions.find(item => item.id && item.type === "city") ||
        suggestions.find(item => item.id);

    if (!selected) {
        throw new Error(`Could not resolve location code for "${raw}".`);
    }

    if (selected.airports && selected.airports[0]?.id && /^[A-Za-z]{3}$/.test(selected.airports[0].id)) {
        return selected.airports[0].id.toUpperCase();
    }

    if (selected.id) return selected.id;

    throw new Error(`No usable flight location found for "${raw}".`);
}

// Router containing all API routes
const apiRouter = express.Router();

apiRouter.get("/airports", async (req, res) => {
    try {
        const query = String(req.query.q || "").trim().toLowerCase();
        
        if (!query) {
            return res.json({ success: true, airports: POPULAR_AIRPORTS.slice(0, 8) });
        }

        const matches = POPULAR_AIRPORTS.filter(airport => 
            airport.code.toLowerCase().includes(query) ||
            airport.name.toLowerCase().includes(query) ||
            airport.city.toLowerCase().includes(query) ||
            airport.country.toLowerCase().includes(query)
        );

        if (matches.length >= 5) {
            return res.json({ success: true, airports: matches.slice(0, 8) });
        }

        try {
            const data = await fetchSerpApi({
                engine: "google_flights_autocomplete",
                q: query,
                gl: "in",
                hl: "en",
                api_key: process.env.SERPAPI_KEY
            });

            const liveAirports = [];
            const seenCodes = new Set(matches.map(m => m.code.toUpperCase()));

            if (data && Array.isArray(data.suggestions)) {
                for (const item of data.suggestions) {
                    if (Array.isArray(item.airports)) {
                        for (const ap of item.airports) {
                            if (ap.id && /^[A-Za-z]{3}$/.test(ap.id) && !seenCodes.has(ap.id.toUpperCase())) {
                                seenCodes.add(ap.id.toUpperCase());
                                liveAirports.push({
                                    code: ap.id.toUpperCase(),
                                    name: ap.name,
                                    city: ap.city || item.name?.split("-")[0]?.trim() || "",
                                    country: item.name?.split("-")[1]?.trim() || ""
                                });
                            }
                        }
                    } else if (item.type === "airport" && item.id && /^[A-Za-z]{3}$/.test(item.id)) {
                        if (!seenCodes.has(item.id.toUpperCase())) {
                            seenCodes.add(item.id.toUpperCase());
                            liveAirports.push({
                                code: item.id.toUpperCase(),
                                name: item.name,
                                city: item.description || "",
                                country: ""
                            });
                        }
                    }
                }
            }

            const combined = [...matches, ...liveAirports].slice(0, 8);
            return res.json({ success: true, airports: combined });
        } catch (apiErr) {
            return res.json({ success: true, airports: matches });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

apiRouter.get("/flight-price", async (req, res) => {
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
                error: "SERPAPI_KEY is missing from environment variables."
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

apiRouter.post("/expenses", (req, res) => {
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

apiRouter.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Travel Agent server is running."
    });
});

// Mount router on both /api and root to support Vercel serverless and local routes
app.use("/api", apiRouter);
app.use(apiRouter);

// Local development server listener
if (require.main === module) {
    const port = Number(process.env.PORT) || 6003;
    app.listen(port, () => {
        console.log(`Travel Agent running at http://localhost:${port}`);
    });
}

module.exports = app;
