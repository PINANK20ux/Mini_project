import React from "react";
import { Clock, Bell } from "lucide-react";
import { daysUntil } from "../utils/date.js";
import { formatCurrency } from "../utils/format.js";

export default function UpcomingBanner({ upcoming }) {
  if (upcoming.length === 0) return null;

  return (
    <div className="animate-slide-down mb-6 flex items-start gap-3.5 rounded-2xl border border-amber-500/30 dark:border-amber-400/20 bg-amber-500/[0.05] dark:bg-amber-500/[0.06] backdrop-blur-xl p-4 shadow-glass-sm transition-all duration-300">
      <div className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-600 dark:text-amber-300 backdrop-blur-md">
        <Bell className="h-4 w-4 animate-pulse-glow" />
      </div>
      <div className="flex-1 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold text-slate-900 dark:text-slate-100">
            {upcoming.length} bill{upcoming.length > 1 ? "s" : ""} due within 7 days
          </p>
          <span className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 backdrop-blur-md">
            <Clock className="h-3 w-3" />
            <span>Action recommended</span>
          </span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {upcoming.map((s) => {
            const d = daysUntil(s.nextBilling);
            return (
              <span
                key={s.id}
                className="group/chip inline-flex items-center gap-1.5 rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md px-3 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/50"
              >
                <span>{s.name}</span>
                <span className="text-cyan-500">•</span>
                <span className="font-medium text-cyan-600 dark:text-cyan-300">
                  {d === 0 ? "Today" : d === 1 ? "Tomorrow" : `In ${d} days`}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400">
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
