import type { TravelPlan } from "../graph/state.js";

export interface SavedTrip extends TravelPlan {
  id: string;
  createdAt: string;
}

// In-memory store for instant zero-config persistence
const inMemoryTrips: SavedTrip[] = [];

export class TripStore {
  /**
   * Save a generated travel plan
   */
  static async saveTrip(plan: TravelPlan): Promise<SavedTrip> {
    const trip: SavedTrip = {
      ...plan,
      id: "trip_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };

    inMemoryTrips.unshift(trip);
    return trip;
  }

  /**
   * Get all saved trips
   */
  static async getAllTrips(): Promise<SavedTrip[]> {
    return inMemoryTrips;
  }

  /**
   * Get a saved trip by ID
   */
  static async getTripById(id: string): Promise<SavedTrip | null> {
    return inMemoryTrips.find((t) => t.id === id) || null;
  }

  /**
   * Delete a trip by ID
   */
  static async deleteTrip(id: string): Promise<boolean> {
    const idx = inMemoryTrips.findIndex((t) => t.id === id);
    if (idx !== -1) {
      inMemoryTrips.splice(idx, 1);
      return true;
    }
    return false;
  }
}
