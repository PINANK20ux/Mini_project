import React from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { daysUntil } from "../utils/date.js";
import { formatCurrency } from "../utils/format.js";

export default function UpcomingBanner({ upcoming }) {
  if (upcoming.length === 0) return null;

  return (
    <div className="animate-slide-down mb-6 flex items-start gap-3.5 rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/40 p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-amber-300 dark:border-amber-500/25 dark:bg-gradient-to-r dark:from-amber-500/10 dark:via-orange-500/10 dark:to-amber-500/5 dark:hover:border-amber-500/40">
      <div className="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 animate-pulse-glow" />
      </div>
      <div className="flex-1 text-sm">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-amber-950 dark:text-amber-200">
            {upcoming.length} bill{upcoming.length > 1 ? "s" : ""} renewing within
            7 days
          </p>
          <span className="flex items-center gap-1 rounded-full bg-amber-200/70 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-500/25 dark:text-amber-300">
            <Clock className="h-3 w-3" />
            Action recommended
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {upcoming.map((s) => {
            const d = daysUntil(s.nextBilling);
            return (
              <span
                key={s.id}
                className="group/chip inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-white/90 px-3 py-1 text-xs text-amber-950 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400 hover:bg-white hover:shadow dark:border-amber-500/30 dark:bg-stone-900/90 dark:text-amber-200 dark:hover:border-amber-400 dark:hover:bg-stone-900"
              >
                <span className="font-semibold">{s.name}</span>
                <span className="text-amber-500 dark:text-amber-400">•</span>
                <span className="font-medium text-amber-800 dark:text-amber-300">
                  {d === 0 ? "Today" : d === 1 ? "Tomorrow" : `In ${d} days`}
                </span>
                <span className="font-mono text-stone-500 dark:text-stone-400">
                  ({formatCurrency(s.cost)})
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}


