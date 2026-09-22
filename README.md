# ✈️ AI Travel Planner

A full-stack, beginner-friendly AI travel planning application built with **React**, **Express.js**, **LangGraph.js**, and **Google Gemini (Free Tier)**.

The application takes a user's destination, duration, budget, and travel preferences, and executes a multi-node LangGraph state machine to generate a personalized, budget-verified, weather-aware day-by-day travel itinerary.

---

## 🌟 Key Features

1. **Multi-Node LangGraph Architecture**: Orchestrates input validation, live weather fetching, AI plan synthesis, budget analysis, and response formatting in an explicit state graph.
2. **Personalized Day-by-Day Itineraries**: Breaks down each day into morning, afternoon, and evening activities, plus authentic local dishes and recommended restaurants.
3. **Live Weather Integration**: Connects to the free Open-Meteo API to fetch real-time climate data (temperature, wind, conditions) and adjust travel recommendations.
4. **Intelligent Budget Checking**: Automatically calculates estimated total costs against the user's budget and provides cost-saving recommendations if the plan exceeds budget.
5. **Structured AI Generation with Zod**: Enforces typed JSON schemas for reliable, zero-hallucination structured responses from Gemini.
6. **Saved Trips**: Save favorite itineraries to revisit or modify anytime.
7. **100% Free Tier Compatible**: Powered by Gemini 2.5 Flash and free weather geocoding.

