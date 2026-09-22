import React, { useState } from "react";
import { MapPin, Calendar, IndianRupee, Sparkles, Compass, Check } from "lucide-react";
import type { TripFormData } from "../types/travel";

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading: boolean;
}

const AVAILABLE_INTERESTS = [
  { id: "Nature", label: "🌲 Nature & Scenic", icon: "🌲" },
  { id: "Food", label: "🍲 Food & Cuisine", icon: "🍲" },
  { id: "Adventure", label: "🧗 Adventure & Treks", icon: "🧗" },
  { id: "Culture", label: "🏛️ Culture & Heritage", icon: "🏛️" },
  { id: "Shopping", label: "🛍️ Shopping & Bazaars", icon: "🛍️" },
  { id: "Relaxation", label: "🏖️ Relaxation & Beaches", icon: "🏖️" },
  { id: "Photography", label: "📸 Photography Spots", icon: "📸" },
  { id: "Nightlife", label: "🎉 Nightlife & Cafes", icon: "🎉" },
];

export const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [destination, setDestination] = useState("Manali");
  const [days, setDays] = useState<number>(4);
  const [budget, setBudget] = useState<number>(15000);
  const [currency, setCurrency] = useState("INR");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Nature",
    "Food",
    "Adventure",
  ]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || days < 1 || budget <= 0) return;

    onSubmit({
      destination: destination.trim(),
      days,
      budget,
      currency,
      interests: selectedInterests,
    });
  };

  return (
    <div className="glass-card rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6 text-sky-600 font-semibold text-sm">
        <Sparkles className="w-4 h-4" />
        <span>Plan Your Dream Vacation with AI</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Where do you want to go?
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Manali, Goa, Tokyo, Paris, Jaipur"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-900 bg-white shadow-sm placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Days & Budget Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Days */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Trip Duration (Days)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                type="number"
                min={1}
                max={14}
                value={days}
                onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-900 bg-white shadow-sm font-medium"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">Recommended: 2 to 7 days</p>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Estimated Total Budget
            </label>
            <div className="relative flex">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-5 h-5" />
              </div>
              <input
                type="number"
                min={100}
                step={500}
                value={budget}
                onChange={(e) => setBudget(Math.max(100, parseInt(e.target.value) || 0))}
                required
                className="w-full pl-11 pr-20 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-900 bg-white shadow-sm font-medium"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="absolute right-2 top-2 bottom-2 px-2.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 border-0 focus:ring-1 focus:ring-sky-500 cursor-pointer"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              ~{Math.round(budget / (days || 1))} {currency} / day
            </p>
          </div>
        </div>

        {/* Interests Multi-Select */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2.5">
            What are your interests? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {AVAILABLE_INTERESTS.map((item) => {
              const isSelected = selectedInterests.includes(item.id);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleInterest(item.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all border text-left ${
                    isSelected
                      ? "bg-sky-50 border-sky-400 text-sky-800 shadow-sm ring-1 ring-sky-400"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2.5 text-base ${
            isLoading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 shadow-sky-500/25 active:scale-[0.99]"
          }`}
        >
          {isLoading ? (
            <>
              <Compass className="w-5 h-5 animate-spin" />
              <span>Orchestrating Itinerary with LangGraph...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate My Travel Itinerary</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
