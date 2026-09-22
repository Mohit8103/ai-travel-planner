export interface WeatherInfo {
  destination: string;
  latitude: number;
  longitude: number;
  temperatureCelsius: number;
  temperatureFahrenheit: number;
  condition: string;
  windSpeedKmh: number;
}

export interface DailyPlan {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
  food: string;
  estimatedCost: number;
}

export interface BudgetAnalysis {
  userBudget: number;
  estimatedTotalCost: number;
  isOverBudget: boolean;
  difference: number;
  advice: string;
}

export interface TravelPlan {
  id?: string;
  destination: string;
  days: number;
  userBudget: number;
  currency: string;
  interests: string[];
  weather: WeatherInfo | null;
  itinerary: DailyPlan[];
  budgetAnalysis: BudgetAnalysis;
  tips: string[];
  summary: string;
  createdAt?: string;
}

export interface TripFormData {
  destination: string;
  days: number;
  budget: number;
  currency: string;
  interests: string[];
}
