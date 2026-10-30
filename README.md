# Travels Agent

Full-stack travel planning application that calculates comprehensive trip budgets and retrieves real-time flight rates powered by Google Flights and SerpApi.

Migrated to a unified, production-ready Vercel single-domain architecture (static frontend edge delivery + Express serverless API backend).

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
├── package.json                # Project dependencies and npm start script
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
