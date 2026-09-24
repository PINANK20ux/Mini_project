import React from "react";
import { AlertCircle, Clock, Bell } from "lucide-react";
import { daysUntil } from "../utils/date.js";
import { formatCurrency } from "../utils/format.js";

export default function UpcomingBanner({ upcoming }) {
  if (upcoming.length === 0) return null;

  return (
    <div className="animate-slide-down mb-6 flex items-start gap-3.5 rounded-2xl border border-[#8B9A6E]/40 bg-[#EAE2D6] p-4 shadow-sm transition-all duration-300 dark:border-[#8B9A6E]/30 dark:bg-[#24231F]">
      <div className="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#8B9A6E]/20 text-[#4E5C37] dark:text-[#D5E0C2]">
        <Bell className="h-4 w-4 animate-pulse-glow" />
      </div>
      <div className="flex-1 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold text-[#1F211C] dark:text-[#F7F2EB]">
            {upcoming.length} bill{upcoming.length > 1 ? "s" : ""} due within 7 days
          </p>
          <span className="flex items-center gap-1 rounded-full bg-[#8B9A6E]/20 px-2 py-0.5 text-[11px] font-bold text-[#4E5C37] dark:bg-[#8B9A6E]/30 dark:text-[#D5E0C2]">
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
                className="group/chip inline-flex items-center gap-1.5 rounded-xl border border-[#DCD5C9] bg-[#F7F2EB] px-3 py-1 text-xs font-semibold text-[#1F211C] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8B9A6E] dark:border-[#2E2D27] dark:bg-[#181916] dark:text-[#F7F2EB]"
              >
                <span>{s.name}</span>
                <span className="text-[#8B9A6E]">•</span>
                <span className="font-medium text-[#4E5C37] dark:text-[#D5E0C2]">
                  {d === 0 ? "Today" : d === 1 ? "Tomorrow" : `In ${d} days`}
                </span>
                <span className="font-mono text-[#70736A] dark:text-[#8D9087]">
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
