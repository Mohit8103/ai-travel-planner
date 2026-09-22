import { Annotation } from "@langchain/langgraph";
import type { WeatherInfo } from "../services/weather.js";

/**
 * Daily Activity Structure
 */
export interface DailyPlan {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
  food: string;
  estimatedCost: number;
}

/**
 * Budget Analysis Result
 */
export interface BudgetAnalysis {
  userBudget: number;
  estimatedTotalCost: number;
  isOverBudget: boolean;
  difference: number;
  advice: string;
}

/**
 * Complete Travel Plan Output
 */
export interface TravelPlan {
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
}

/**
 * LangGraph State Annotation
 * 
 * In LangGraph, "State" is the shared data object that flows through every node.
 * Each node receives the current state, processes data, and returns updates to the state.
 */
export const TravelStateAnnotation = Annotation.Root({
  // User Inputs
  destination: Annotation<string>(),
  days: Annotation<number>(),
  budget: Annotation<number>(),
  interests: Annotation<string[]>({
    reducer: (_, next) => next ?? [],
    default: () => ["General"],
  }),
  currency: Annotation<string>({
    reducer: (_, next) => next ?? "INR",
    default: () => "INR",
  }),

  // Intermediate State
  weather: Annotation<WeatherInfo | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  rawItinerary: Annotation<any>({
    reducer: (_, next) => next,
    default: () => null,
  }),

  // Processed Output
  finalPlan: Annotation<TravelPlan | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),

  // Error handling
  error: Annotation<string | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
});

export type TravelState = typeof TravelStateAnnotation.State;
