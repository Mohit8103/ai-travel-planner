import { StateGraph, START, END } from "@langchain/langgraph";
import { TravelStateAnnotation } from "./state.js";
import {
  validateInputNode,
  fetchWeatherNode,
  generatePlanNode,
  checkBudgetNode,
  formatResponseNode,
} from "./nodes.js";

/**
 * Builds and compiles the LangGraph Travel Planner Workflow
 * 
 * Workflow Topology:
 * START
 *   │
 *   ▼
 * validateInput (Checks destination, days, budget validity)
 *   │
 *   ▼
 * fetchWeather (Fetches real-time temperature from Open-Meteo)
 *   │
 *   ▼
 * generatePlan (Gemini creates structured itinerary)
 *   │
 *   ▼
 * checkBudget (Calculates costs and gives budget advice)
 *   │
 *   ▼
 * formatResponse (Packages final clean object)
 *   │
 *   ▼
 *  END
 */
export function buildTravelGraph() {
  const workflow = new StateGraph(TravelStateAnnotation)
    .addNode("validateInput", validateInputNode)
    .addNode("fetchWeather", fetchWeatherNode)
    .addNode("generatePlan", generatePlanNode)
    .addNode("checkBudget", checkBudgetNode)
    .addNode("formatResponse", formatResponseNode)
    // Connect linear flow with sequential edges
    .addEdge(START, "validateInput")
    .addEdge("validateInput", "fetchWeather")
    .addEdge("fetchWeather", "generatePlan")
    .addEdge("generatePlan", "checkBudget")
    .addEdge("checkBudget", "formatResponse")
    .addEdge("formatResponse", END);

  return workflow.compile();
}

// Singleton compiled graph instance ready for execution
export const travelGraph = buildTravelGraph();
