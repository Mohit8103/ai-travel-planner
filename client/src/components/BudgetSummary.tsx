import React from "react";
import { CheckCircle2, AlertTriangle, TrendingUp, PiggyBank } from "lucide-react";
import type { BudgetAnalysis } from "../types/travel";

interface BudgetSummaryProps {
  budgetAnalysis: BudgetAnalysis;
  currency: string;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ budgetAnalysis, currency }) => {
  const { userBudget, estimatedTotalCost, isOverBudget, difference, advice } = budgetAnalysis;

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isOverBudget
          ? "bg-amber-50/70 border-amber-200/90 text-amber-950"
          : "bg-emerald-50/70 border-emerald-200/90 text-emerald-950"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isOverBudget
                ? "bg-amber-500/15 text-amber-600"
                : "bg-emerald-500/15 text-emerald-600"
            }`}
          >
            {isOverBudget ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-base flex items-center gap-2">
              <span>{isOverBudget ? "Budget Alert: Plan Exceeds Budget" : "Within Your Budget"}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  isOverBudget
                    ? "bg-amber-200/80 text-amber-800"
                    : "bg-emerald-200/80 text-emerald-800"
                }`}
              >
                {isOverBudget ? `+${difference} ${currency} over` : `✓ ${difference} ${currency} saved`}
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Verified by LangGraph Budget Analysis Node
            </p>
          </div>
        </div>

        {/* Cost stats */}
        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-xs text-slate-500 block">Your Budget</span>
            <span className="font-bold text-slate-800">
              {userBudget.toLocaleString()} {currency}
            </span>
          </div>
          <div className="h-7 w-px bg-slate-300/60" />
          <div>
            <span className="text-xs text-slate-500 block">Estimated Cost</span>
            <span
              className={`font-bold ${
                isOverBudget ? "text-amber-700 font-extrabold" : "text-emerald-700"
              }`}
            >
              {estimatedTotalCost.toLocaleString()} {currency}
            </span>
          </div>
        </div>
      </div>

      {/* Advice note */}
      <div className="mt-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-white/70 rounded-xl p-3 border border-black/5">
        <PiggyBank className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{advice}</p>
      </div>
    </div>
  );
};
