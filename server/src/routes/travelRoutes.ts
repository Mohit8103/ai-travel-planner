import { Router, Request, Response } from "express";
import { travelGraph } from "../graph/travelGraph.js";
import { TripStore } from "../storage/tripStore.js";

export const travelRouter = Router();

/**
 * Health check endpoint
 */
travelRouter.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "AI Travel Planner API", time: new Date().toISOString() });
});

/**
 * POST /api/plan-trip
 * Executes the LangGraph workflow to generate a personalized itinerary.
 */
travelRouter.post("/plan-trip", async (req: Request, res: Response): Promise<void> => {
  try {
    const { destination, days, budget, interests, currency } = req.body;

    if (!destination) {
      res.status(400).json({ error: "Destination is required." });
      return;
    }

    const parsedDays = Number(days);
    const parsedBudget = Number(budget);

    if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 14) {
      res.status(400).json({ error: "Trip duration must be a valid number between 1 and 14 days." });
      return;
    }

    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      res.status(400).json({ error: "Budget must be a valid positive number." });
      return;
    }

    console.log(`🚀 Starting LangGraph trip planning for ${destination} (${parsedDays} days, budget: ${parsedBudget} ${currency || "INR"})...`);

    // Execute the compiled LangGraph workflow
    const resultState = await travelGraph.invoke({
      destination: destination.trim(),
      days: parsedDays,
      budget: parsedBudget,
      interests: Array.isArray(interests) && interests.length > 0 ? interests : ["General"],
      currency: currency || "INR",
    });

    if (resultState.error) {
      res.status(400).json({ error: resultState.error });
      return;
    }

    if (!resultState.finalPlan) {
      res.status(500).json({ error: "Failed to generate travel plan. Please try again." });
      return;
    }

    res.json({
      success: true,
      data: resultState.finalPlan,
    });
  } catch (error: any) {
    console.error("Error in /api/plan-trip:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred while planning your trip.",
    });
  }
});

/**
 * POST /api/trips
 * Saves a generated itinerary
 */
travelRouter.post("/trips", async (req: Request, res: Response): Promise<void> => {
  try {
    const tripPlan = req.body;
    if (!tripPlan || !tripPlan.destination || !tripPlan.itinerary) {
      res.status(400).json({ error: "Invalid travel plan object." });
      return;
    }

    const saved = await TripStore.saveTrip(tripPlan);
    res.status(201).json({ success: true, data: saved });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to save trip." });
  }
});

/**
 * GET /api/trips
 * Retrieves all saved itineraries
 */
travelRouter.get("/trips", async (_req: Request, res: Response): Promise<void> => {
  try {
    const trips = await TripStore.getAllTrips();
    res.json({ success: true, data: trips });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch saved trips." });
  }
});

/**
 * DELETE /api/trips/:id
 * Removes a saved trip
 */
travelRouter.delete("/trips/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await TripStore.deleteTrip(req.params.id);
    if (deleted) {
      res.json({ success: true, message: "Trip deleted successfully." });
    } else {
      res.status(404).json({ error: "Trip not found." });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete trip." });
  }
});
