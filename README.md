# Travels Agent

a travel planning application that helps users calculate trip expenses and find flight prices
[https://manish-datrik.github.io/travels-agent/](https://travels-agent-api.onrender.com)

## Overview

travels agent is a full-stack web application designed to help travelers plan their trips by calculating total expenses including flights, hotels, food, and transport costs. the app provides a user-friendly interface for entering trip details and displays a comprehensive budget breakdown

### Main Features

the application allows users to:
- enter their origin and destination cities using location autocomplete
- select travel dates using an interactive calendar
- specify the number of travelers
- choose hotel type (3-star, 4-star, or 5-star)
- select food preference (budget, standard, or luxury)
- get real-time flight prices from the serpapi flight search api
- view a complete expense breakdown including flights, hotels, food, and transport
- view a complete trip budget breakdown

### Frontend
html5 for structure
css3 for styling with modern gradients and responsive design
javascript (vanilla) for interactive features
flatpickr library for date range selection
airport autocomplete with verified airport data

### Backend
node.js with express framework
cors middleware for handling cross-origin requests
dotenv for private environment configuration
serpapi integration for real-time flight pricing


### Flight Price Lookup

when a user enters their travel details and clicks calculate, the app:
- sends the origin, destination, and departure date to the backend
- the backend calls the serpapi flight search api with your private api key
- parses the response to extract the best flight price
- returns the price to the frontend for display

the api key is stored securely in a .env file and never exposed to the client

### Expense Calculation

the app calculates trip costs using:
- actual flight prices from serpapi
- hotel costs based on selected star rating and trip duration
- food costs based on preference level
- transport costs estimated at 0.40 per kilometer
- a 10 percent tax on the subtotal

### Requirements
Node.js 20 or higher and npm.

### Environment setup
For local development, copy `.env.example` to `.env` and add your private SerpApi key:
```
SERPAPI_KEY=your_private_api_key_here
```

Never put API keys in HTML, frontend JavaScript, or a committed file. `.env` is ignored by Git; `.env.example` contains placeholders only.

## Deploy live flight pricing

GitHub Pages hosts the static website but cannot run the Express API. The API is configured to run separately on Render using the Blueprint in `render.yaml`.

1. In Render, create a Blueprint from this repository and deploy the branch used for the app.
2. Set `SERPAPI_KEY` in the Render service's environment settings. Do not enter it into GitHub Pages or the HTML.
3. The frontend is configured for `https://travels-agent-api.onrender.com`. If Render assigns a different service URL, update the `travel-agent-api-url` meta tag in `expence.html` to that public URL and publish the page.
4. Confirm the Render service's `/api/health` endpoint succeeds, then try a flight search on the GitHub Pages site.

The backend permits requests from the GitHub Pages origin and local development by default. Change `ALLOWED_ORIGINS` in Render if the site uses a different domain. Flight searches are limited to 10 requests per minute per client IP. The Render free service may take a short time to wake up before answering the first request.

## Features Implemented

location autocomplete using nominatim open street map data
real-time flight pricing from serpapi api
responsive design that works on mobile, tablet, and desktop
server-side flight API integration
clean navigation across all pages
budget summary cards showing trip details
professional styling with gradients and smooth transitions
form validation for all user inputs
error handling for api failures with fallback prices

## How to Use

1 go to the budget planner page
2 enter your departure city in the origin field
3 enter your destination city
4 select your travel dates using the calendar
5 enter the number of travelers
6 choose your preferred hotel type
7 select your food preference
8 click calculate to see the full expense breakdown
## Notes

the application uses real-time flight data from the serpapi api so prices reflect current market rates
the api key is kept private on the backend to ensure security
flight prices are fetched by the server, which keeps the API key out of the browser
the app is optimized for both desktop and mobile viewing
