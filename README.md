# Travels Agent

a travel planning application that helps users calculate trip expenses and find flight prices

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
- save expense data to a mongodb database

### Frontend
html5 for structure
css3 for styling with modern gradients and responsive design
javascript (vanilla) for interactive features
flatpickr library for date range selection
nominatim api for location autocomplete

### Backend
node.js with express framework
mongodb with mongoose for data persistence
cors middleware for handling cross-origin requests
dotenv for environment configuration
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
node.js (version 24 or higher)
mongodb instance running locally or remotely
npm or yarn package manager

### Environment setup
create a .env file in the project root and add:
```
SERPAPI_KEY=your_private_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
PORT=6001
```

if you are using a local mongodb instance, the uri may look like:
```
MONGODB_URI=mongodb://127.0.0.1:27017/travelagent
```

## Features Implemented

location autocomplete using nominatim open street map data
real-time flight pricing from serpapi api
responsive design that works on mobile, tablet, and desktop
expense data persistence with mongodb
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
9 your trip will be saved automatically to the database

## Notes

the application uses real-time flight data from the serpapi api so prices reflect current market rates
the api key is kept private on the backend to ensure security
all expense data is stored permanently in the database for future reference
the app is optimized for both desktop and mobile viewing
