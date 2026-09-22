import { z } from "zod";
import { getGeminiModel } from "../services/gemini.js";
import { fetchDestinationWeather } from "../services/weather.js";
import type { TravelState, DailyPlan, TravelPlan } from "./state.js";

// ============================================================================
// Zod Schema for Structured AI Itinerary Generation
// ============================================================================
const ItinerarySchema = z.object({
  summary: z.string().describe("A 2-3 sentence overview of the trip"),
  itinerary: z.array(
    z.object({
      day: z.number().describe("Day number (1, 2, ...)"),
      morning: z.string().describe("Morning activity with specific location"),
      afternoon: z.string().describe("Afternoon activity with specific location"),
      evening: z.string().describe("Evening activity or nightlife"),
      food: z.string().describe("Recommended local dishes and restaurants"),
      estimatedCost: z.number().describe("Estimated cost for this day in user currency (activities + food + local transport)"),
    })
  ),
  tips: z.array(z.string()).describe("3-5 essential travel tips, packing advice, or local etiquette"),
});

// ============================================================================
// NODE 1: Validate User Input
// ============================================================================
export async function validateInputNode(state: TravelState): Promise<Partial<TravelState>> {
  console.log("📍 [Node 1] Validating user inputs for:", state.destination);

  if (!state.destination || state.destination.trim().length === 0) {
    return { error: "Destination is required. Please provide a city or location." };
  }

  if (!state.days || state.days < 1 || state.days > 14) {
    return { error: "Trip duration must be between 1 and 14 days." };
  }

  if (!state.budget || state.budget <= 0) {
    return { error: "Please enter a valid positive budget amount." };
  }

  return { error: null };
}

// ============================================================================
// NODE 2: Fetch Live Weather (Free Open-Meteo API)
// ============================================================================
export async function fetchWeatherNode(state: TravelState): Promise<Partial<TravelState>> {
  if (state.error) return {};

  console.log("⛅ [Node 2] Fetching live weather for:", state.destination);
  const weather = await fetchDestinationWeather(state.destination);
  return { weather };
}

// ============================================================================
// NODE 3: Generate Travel Plan with Gemini Structured Output
// ============================================================================
export async function generatePlanNode(state: TravelState): Promise<Partial<TravelState>> {
  if (state.error) return {};

  console.log("🤖 [Node 3] Generating personalized itinerary with Gemini...");

  const model = getGeminiModel(0.7);
  const structuredModel = model.withStructuredOutput(ItinerarySchema);

  const weatherContext = state.weather
    ? `Current weather in ${state.weather.destination}: ${state.weather.temperatureCelsius}°C (${state.weather.temperatureFahrenheit}°F), ${state.weather.condition}. Please tailor recommendations to fit this climate.`
    : "No live weather data available.";

  const prompt = `You are an expert AI Travel Guide. Create a realistic, personalized ${state.days}-day travel itinerary for ${state.destination}.

Trip Details:
- Destination: ${state.destination}
- Duration: ${state.days} days
- Total User Budget: ${state.budget} ${state.currency} (Target daily average: ~${Math.round(state.budget / state.days)} ${state.currency}/day)
- Preferred Interests: ${state.interests.join(", ")}
- Live Weather: ${weatherContext}

Requirements:
1. Provide a detailed morning, afternoon, and evening activity for each day.
2. Recommend authentic local dishes and popular eateries for each day.
3. Keep the estimated daily cost realistic to the location and target budget.
4. Include 3-5 practical, actionable travel tips.`;

  try {
    const aiOutput = await structuredModel.invoke(prompt);
    return { rawItinerary: aiOutput };
  } catch (err: any) {
    console.error("Gemini invocation error:", err);
    return { error: `AI generation failed: ${err.message || "Unknown error"}` };
  }
}

// ============================================================================
// NODE 4: Check Budget & Generate Cost Advice
// ============================================================================
export async function checkBudgetNode(state: TravelState): Promise<Partial<TravelState>> {
  if (state.error || !state.rawItinerary) return {};

  console.log("💰 [Node 4] Analyzing budget feasibility...");

  const dailyPlans: DailyPlan[] = state.rawItinerary.itinerary || [];
  const estimatedTotalCost = dailyPlans.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const userBudget = state.budget;
  const isOverBudget = estimatedTotalCost > userBudget;
  const difference = Math.abs(estimatedTotalCost - userBudget);

  let advice = "";
  if (isOverBudget) {
    advice = `The estimated total cost (${estimatedTotalCost} ${state.currency}) exceeds your budget (${userBudget} ${state.currency}) by ${difference} ${state.currency}. Consider opting for budget homestays, public transportation, or street food to reduce expenses.`;
  } else {
    advice = `Great news! The estimated total cost (${estimatedTotalCost} ${state.currency}) is within your budget (${userBudget} ${state.currency}), leaving you with a buffer of ${difference} ${state.currency} for souvenirs or emergencies.`;
  }

  // Attach budget analysis to the intermediate raw itinerary
  return {
    rawItinerary: {
      ...state.rawItinerary,
      budgetAnalysis: {
        userBudget,
        estimatedTotalCost,
        isOverBudget,
        difference,
        advice,
      },
    },
  };
}

// ============================================================================
// NODE 5: Format Final Response
// ============================================================================
export async function formatResponseNode(state: TravelState): Promise<Partial<TravelState>> {
  if (state.error || !state.rawItinerary) return {};

  console.log("✨ [Node 5] Formatting final itinerary response...");

  const raw = state.rawItinerary;

  const finalPlan: TravelPlan = {
    destination: state.destination,
    days: state.days,
    userBudget: state.budget,
    currency: state.currency,
    interests: state.interests,
    weather: state.weather,
    itinerary: raw.itinerary || [],
    budgetAnalysis: raw.budgetAnalysis,
    tips: raw.tips || [],
    summary: raw.summary || `Personalized ${state.days}-day trip to ${state.destination}`,
  };

  return { finalPlan };
}
