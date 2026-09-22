import React, { useState, useEffect } from "react";
import { Compass, CheckCircle, Loader2 } from "lucide-react";

const GRAPH_STEPS = [
  { id: 1, label: "Validating trip parameters & constraints..." },
  { id: 2, label: "Fetching live weather from Open-Meteo API..." },
  { id: 3, label: "Synthesizing personalized itinerary with Gemini..." },
  { id: 4, label: "Running budget feasibility & cost calculation node..." },
  { id: 5, label: "Formatting final structured itinerary..." },
];

export const LoadingSkeleton: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < GRAPH_STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card rounded-2xl p-8 sm:p-10 shadow-xl text-center space-y-6 max-w-lg mx-auto border border-sky-200">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-sky-500/25 animate-bounce">
        <Compass className="w-8 h-8 animate-spin" />
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-slate-900">
          Crafting Your AI Travel Plan
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          LangGraph state machine is processing your request
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-3 text-left bg-slate-50/80 rounded-xl p-4 border border-slate-200/60">
        {GRAPH_STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 text-xs font-medium transition-all ${
                isCurrent
                  ? "text-sky-700 font-bold"
                  : isDone
                  ? "text-emerald-700"
                  : "text-slate-400"
              }`}
            >
              {isDone ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
