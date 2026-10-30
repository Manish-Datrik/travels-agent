# Travels Agent
https://travels-agent.vercel.app

Full-stack travel planning application that calculates comprehensive trip budgets and retrieves real-time flight rates powered by Google Flights and SerpApi.

Migrated to a unified, production-ready Vercel single-domain architecture (static frontend edge delivery + Express serverless API backend).

---

## Overview

Travels Agent is a full-stack web application designed to help travelers plan trips by accurately calculating expenses for flights, hotels, food, and transport in real time.

### Main Features
- **Smart Airport Autocomplete**: Instant search across 40+ popular global airports and live Google Flights autocomplete via SerpApi.
- **Interactive Calendar**: Range date picker powered by Flatpickr for departure and return selection.
- **Real-Time Flight Search**: Live round-trip and one-way flight pricing via SerpApi Google Flights engine with passenger count scaling.
- **Accurate Expense Calculations**:
  - Live priced flights (or fallback route estimates)
  - Accommodations based on star rating (3-star standard: $70/night, 4-star premium: $120/night, 5-star luxury: $190/night)
  - Dining preferences (Budget: $20/day, Standard: $40/day, Fine Dining: $70/day)
  - Ground transportation based on route distance ($0.40 / km)
  - Standard tax rate (10%) on subtotal
- **Destination Discovery**: Handpicked getaways to Dubai, Singapore, Goa, and Kashmir.
- **Hotels & Restaurants**: Dedicated exploration sections linking directly to the budget calculator.

---

## Project Structure

```
Travel-Agent/
│
├── public/                     # Static frontend files served directly by Vercel / Express
│   ├── index.html              # Homepage
│   ├── expence.html            # Travel Budget Planner with live Google Flights pricing
│   ├── expense.html            # Compatibility alias for budget planner
│   ├── hotel.html              # Hotel accommodations showcase & search
│   ├── restraunts.html         # Dining and culinary experiences
│   ├── restaurants.html        # Compatibility alias for restaurants
│   ├── makeyourtrip.html       # "Where To" journey planner
│   ├── populardestinations.html# Handpicked getaways (Dubai, Singapore, Goa, Kashmir)
│   ├── airports.json           # Global commercial airport dataset for autocomplete
│   ├── style.css               # Core design and styling
│   └── *.jpg, *.png, *.webp    # High-resolution destination and UI assets
│
├── api/
│   └── index.js                # Vercel serverless function entry point
├── server.js                   # Express application (API routes + local static file server)
├── vercel.json                 # Vercel single-domain routing & rewrites configuration
├── package.json                # Project dependencies, scripts & engine specification
├── package-lock.json           # Dependency lockfile
├── .env.example                # Example environment variable template (no secrets)
├── .gitignore                  # Git ignore rules protecting secrets and local builds
└── README.md                   # Documentation and deployment guide
```

---

## Local Development

### Requirements
- Node.js 18.x or newer
- npm

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Edit `.env` and set your SerpApi API key:
```env
SERPAPI_KEY=your_serpapi_key_here
PORT=6003
ALLOWED_ORIGINS=https://manish-datrik.github.io,http://localhost:6003,http://127.0.0.1:6003
```

### 3. Run the Local Server
```bash
npm start
```
Open [http://localhost:6003](http://localhost:6003) in your browser.

---

## API Endpoints

All endpoints are available relative to the domain (e.g., `https://your-domain.vercel.app/api/...` or `http://localhost:6003/api/...`):

- `GET /api/health` - Server health check status.
- `GET /api/airports?q=delhi` - Autocomplete search for airport names and IATA codes.
- `GET /api/flight-price?origin=DEL&destination=DXB&departureDate=2026-11-15&returnDate=2026-11-20&travelers=1` - Real-time Google Flights search using SerpApi.
- `POST /api/expenses` - Accepts budget submissions.

---

## How to Use

1. Go to the **Budget Planner** page (`/expence.html`).
2. Search and select your departure airport in the **Departure Airport (From)** field.
3. Search and select your destination airport in the **Destination Airport (To)** field.
4. Select your travel dates using the interactive calendar.
5. Specify the number of travelers (1–9).
6. Choose your preferred hotel rating (3-Star, 4-Star, or 5-Star).
7. Choose your dining preference (Budget, Standard, or Fine Dining).
8. Click **Calculate Expense** to view your comprehensive itemized expense report.

---

## Deploying to Vercel

1. Push your repository to GitHub (ensure `.env` is never committed; verify `.gitignore` is active).
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New"** > **"Project"**.
3. Import your `travels-agent` repository.
4. Keep the default settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: Leave empty / none needed
   - **Output Directory**: Leave empty / default
5. Under **Environment Variables**, add:
   - `SERPAPI_KEY`: Your SerpApi API key
6. Click **Deploy**.
7. Both your frontend pages (`/`, `/expence.html`, `/hotel.html`, etc.) and backend routes (`/api/flight-price`, `/api/health`, etc.) will run under the same Vercel domain!
