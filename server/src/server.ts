import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { travelRouter } from "./routes/travelRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", travelRouter);

// Root route
app.get("/", (_req, res) => {
  res.send(`
    <html>
      <body style="font-family: system-ui; text-align: center; padding: 40px; background: #f8fafc;">
        <h1 style="color: #0284c7;">✈️ AI Travel Planner API</h1>
        <p style="color: #475569;">Backend server running with LangGraph.js and Google Gemini</p>
        <p><a href="/api/health" style="color: #2563eb;">Check API Health</a></p>
      </body>
    </html>
  `);
});

// Start listening
app.listen(config.port, () => {
  console.log(`\n==============================================`);
  console.log(`✈️  AI Travel Planner Server is running!`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🔑 Gemini Key: ${config.geminiApiKey ? "Configured ✅" : "Missing ❌"}`);
  console.log(`==============================================\n`);
});
