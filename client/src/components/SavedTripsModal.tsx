import React from "react";
import { X, Trash2, Calendar, MapPin, ExternalLink, Bookmark } from "lucide-react";
import type { TravelPlan } from "../types/travel";

interface SavedTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTrips: TravelPlan[];
  onSelectTrip: (trip: TravelPlan) => void;
  onDeleteTrip: (id: string) => void;
}

export const SavedTripsModal: React.FC<SavedTripsModalProps> = ({
  isOpen,
  onClose,
  savedTrips,
  onSelectTrip,
  onDeleteTrip,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="glass-card bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <Bookmark className="w-5 h-5 text-sky-600" />
            <span>Saved Travel Plans ({savedTrips.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {savedTrips.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-slate-600 text-sm">No saved trips yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Generate an itinerary and click "Save Itinerary" to store it here.
              </p>
            </div>
          ) : (
            savedTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-4 rounded-xl bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 transition-all flex items-center justify-between gap-4 group"
              >
                <div
                  onClick={() => {
                    onSelectTrip(trip);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer min-w-0"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                    <h4 className="font-bold text-slate-900 text-base truncate">
                      {trip.destination}
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-medium shrink-0">
                      {trip.days} Days
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{trip.summary}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-600">
                    <span>
                      Budget: {trip.userBudget.toLocaleString()} {trip.currency}
                    </span>
                    <span>•</span>
                    <span
                      className={
                        trip.budgetAnalysis?.isOverBudget
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }
                    >
                      Est. Cost: {trip.budgetAnalysis?.estimatedTotalCost.toLocaleString()}{" "}
                      {trip.currency}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectTrip(trip);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
                    title="View Trip"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  {trip.id && (
                    <button
                      onClick={() => onDeleteTrip(trip.id!)}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
