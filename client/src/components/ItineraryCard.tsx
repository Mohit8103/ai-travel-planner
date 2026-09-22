import React, { useState } from "react";
import {
  SunMedium,
  Sun,
  Moon,
  UtensilsCrossed,
  Lightbulb,
  Bookmark,
  Check,
  CalendarDays,
  IndianRupee,
  Share2,
} from "lucide-react";
import type { TravelPlan } from "../types/travel";

interface ItineraryCardProps {
  plan: TravelPlan;
  onSave: (plan: TravelPlan) => void;
  isSaved?: boolean;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({ plan, onSave, isSaved = false }) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const currentDayPlan = plan.itinerary.find((d) => d.day === activeDay) || plan.itinerary[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview & Action Bar */}
      <div className="glass-card rounded-2xl p-6 shadow-md border border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {plan.destination}
              </h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 font-semibold">
                {plan.days} Days
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">{plan.summary}</p>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
            <button
              onClick={() => onSave(plan)}
              disabled={isSaved}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                isSaved
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20"
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved to Trips</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save Itinerary</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              title="Copy link"
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interests Tags */}
        <div className="flex items-center gap-2 pt-3.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400">Interests:</span>
          {plan.interests.map((interest, idx) => (
            <span
              key={idx}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {plan.itinerary.map((dayItem) => {
          const isActive = dayItem.day === activeDay;
          return (
            <button
              key={dayItem.day}
              onClick={() => setActiveDay(dayItem.day)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Day {dayItem.day}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-md ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                ~{dayItem.estimatedCost} {plan.currency}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Card */}
      {currentDayPlan && (
        <div className="glass-card rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-extrabold">
                {currentDayPlan.day}
              </span>
              <span>Day {currentDayPlan.day} Schedule</span>
            </h3>
            <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/60">
              Est. Daily Cost: {currentDayPlan.estimatedCost} {plan.currency}
            </span>
          </div>

          {/* Time Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Morning */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <SunMedium className="w-4 h-4 text-amber-600" />
                <span>Morning</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {currentDayPlan.morning}
              </p>
            </div>

            {/* Afternoon */}
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200/70 space-y-2">
              <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                <Sun className="w-4 h-4 text-sky-600" />
                <span>Afternoon</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {currentDayPlan.afternoon}
              </p>
            </div>

            {/* Evening */}
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/70 space-y-2">
              <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>Evening & Night</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {currentDayPlan.evening}
              </p>
            </div>
          </div>

          {/* Food Recommendations */}
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/70 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                Recommended Local Dishes & Dining
              </h4>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">{currentDayPlan.food}</p>
            </div>
          </div>
        </div>
      )}

      {/* Travel Tips Section */}
      {plan.tips && plan.tips.length > 0 && (
        <div className="glass-card rounded-2xl p-6 shadow-md border border-slate-200/80">
          <div className="flex items-center gap-2 mb-4 text-sky-700 font-bold text-base">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>Essential Travel Tips & Recommendations</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plan.tips.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs sm:text-sm text-slate-700"
              >
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
