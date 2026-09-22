import React from "react";
import { Compass, BookmarkCheck, Sparkles } from "lucide-react";

interface NavbarProps {
  onOpenSaved: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSaved, savedCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20 text-white">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">AI Travel Planner</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">LangGraph</span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Intelligent Itineraries powered by Gemini & LangGraph.js</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSaved}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <BookmarkCheck className="w-4 h-4 text-sky-600" />
            <span>Saved Trips</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 text-xs font-semibold bg-sky-500 text-white rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
