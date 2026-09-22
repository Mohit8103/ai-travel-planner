import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { TripForm } from "./components/TripForm";
import { WeatherBadge } from "./components/WeatherBadge";
import { BudgetSummary } from "./components/BudgetSummary";
import { ItineraryCard } from "./components/ItineraryCard";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { SavedTripsModal } from "./components/SavedTripsModal";
import {
  generateItinerary,
  saveTrip,
  getSavedTrips,
  deleteSavedTrip,
} from "./services/api";
import type { TravelPlan, TripFormData } from "./types/travel";
import { AlertCircle, ArrowLeft, Sparkles, Compass } from "lucide-react";

export const App: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<TravelPlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<TravelPlan[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCurrentPlanSaved, setIsCurrentPlanSaved] = useState(false);

  // Load saved trips on mount
  useEffect(() => {
    loadSavedTrips();
  }, []);

  const loadSavedTrips = async () => {
    try {
      const trips = await getSavedTrips();
      setSavedTrips(trips);
    } catch (err) {
      console.warn("Could not load saved trips:", err);
    }
  };

  const handleFormSubmit = async (formData: TripFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsCurrentPlanSaved(false);

    try {
      const plan = await generateItinerary(formData);
      setCurrentPlan(plan);
      // Smooth scroll down to the results
      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Something went wrong while planning your trip. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = async (plan: TravelPlan) => {
    try {
      const saved = await saveTrip(plan);
      setIsCurrentPlanSaved(true);
      setSavedTrips((prev) => [saved, ...prev]);
    } catch (err: any) {
      alert("Failed to save trip: " + err.message);
    }
  };

  const handleDeleteTrip = async (id: string) => {
    try {
      await deleteSavedTrip(id);
      setSavedTrips((prev) => prev.filter((t) => t.id !== id));
      if (currentPlan?.id === id) {
        setIsCurrentPlanSaved(false);
      }
    } catch (err: any) {
      alert("Failed to delete trip: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onOpenSaved={() => setIsSavedModalOpen(true)}
        savedCount={savedTrips.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LangGraph Multi-Node Workflow</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Plan Your Next Adventure in Seconds
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Enter your destination, duration, budget, and interests. Our LangGraph state machine orchestrates real-time weather, Gemini AI itinerary synthesis, and budget verification.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm shadow-sm max-w-3xl mx-auto">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Error: </span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Form or Plan View */}
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Trip Configuration Form */}
          <TripForm onSubmit={handleFormSubmit} isLoading={isLoading} />

          {/* Loading Skeleton during LangGraph Execution */}
          {isLoading && <LoadingSkeleton />}

          {/* Results Section */}
          {!isLoading && currentPlan && (
            <div className="space-y-6 animate-fade-in pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-sky-600" />
                  <span>Generated Travel Plan</span>
                </h2>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Modify Plan</span>
                </button>
              </div>

              {/* Weather Info */}
              {currentPlan.weather && <WeatherBadge weather={currentPlan.weather} />}

              {/* Budget Analysis */}
              {currentPlan.budgetAnalysis && (
                <BudgetSummary
                  budgetAnalysis={currentPlan.budgetAnalysis}
                  currency={currentPlan.currency}
                />
              )}

              {/* Day by Day Plan */}
              <ItineraryCard
                plan={currentPlan}
                onSave={handleSavePlan}
                isSaved={isCurrentPlanSaved}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI Travel Planner • Built with React, Express, LangGraph.js & Google Gemini</span>
          <span className="font-semibold text-slate-700">100% Free Tier Compatible</span>
        </div>
      </footer>

      {/* Saved Trips Modal */}
      <SavedTripsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedTrips={savedTrips}
        onSelectTrip={(trip) => {
          setCurrentPlan(trip);
          setIsCurrentPlanSaved(true);
        }}
        onDeleteTrip={handleDeleteTrip}
      />
    </div>
  );
};
