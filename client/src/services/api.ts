import type { TravelPlan, TripFormData } from "../types/travel";

const API_BASE = "/api";

export async function generateItinerary(formData: TripFormData): Promise<TravelPlan> {
  const response = await fetch(`${API_BASE}/plan-trip`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate itinerary");
  }

  return data.data;
}

export async function saveTrip(plan: TravelPlan): Promise<TravelPlan> {
  const response = await fetch(`${API_BASE}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(plan),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to save trip");
  }

  return data.data;
}

export async function getSavedTrips(): Promise<TravelPlan[]> {
  const response = await fetch(`${API_BASE}/trips`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to load saved trips");
  }
  return data.data || [];
}

export async function deleteSavedTrip(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/trips/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to delete trip");
  }
}
