import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "../config/env.js";

/**
 * Initializes and returns the Google Gemini Chat Model instance.
 * 
 * Why Gemini 2.5 Flash?
 * - Included in Google's generous free tier.
 * - Extremely fast response times.
 * - Native support for JSON structured outputs.
 */
export function getGeminiModel(temperature: number = 0.7) {
  if (!config.geminiApiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured! Please set it in your .env file."
    );
  }

  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: config.geminiApiKey,
    temperature,
  });
}
