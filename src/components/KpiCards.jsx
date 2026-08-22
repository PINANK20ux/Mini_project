import React from "react";
import { Wallet, CalendarClock, Layers } from "lucide-react";
import { formatCurrency } from "../utils/format.js";

function KpiCard({ icon: Icon, label, value, accent, sub, iconBg, iconColor, hoverColor }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-stone-300 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700">
      <span
        className={`absolute left-0 top-0 h-full w-1.5 transition-all duration-300 group-hover:w-2.5 ${accent}`}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          {label}
        </p>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconBg} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
        >
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <p className={`mt-3 font-mono text-2xl font-bold tracking-tight tabular-nums text-stone-900 transition-colors ${hoverColor} dark:text-stone-50`}>
        {value}
      </p>
      {sub && (
        <p className="mt-1.5 text-xs text-stone-500 transition-colors dark:text-stone-400">
          {sub}
        </p>
      )}
    </div>
  );
}

export default function KpiCards({
  totalMonthly,
  totalAnnual,
  activeCount,
  upcomingCount,
}) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiCard
        icon={Wallet}
        label="Total monthly spend"
        value={formatCurrency(totalMonthly)}
        accent="bg-teal-500"
        iconBg="bg-teal-50 dark:bg-teal-950/50"
        iconColor="text-teal-600 dark:text-teal-400"
        hoverColor="group-hover:text-teal-600 dark:group-hover:text-teal-400"
        sub="Across all active subscriptions"
      />
      <KpiCard
        icon={CalendarClock}
        label="Estimated annual spend"
        value={formatCurrency(totalAnnual)}
        accent="bg-indigo-500"
        iconBg="bg-indigo-50 dark:bg-indigo-950/50"
        iconColor="text-indigo-600 dark:text-indigo-400"
        hoverColor="group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
        sub="Projected over 12 months"
      />
      <KpiCard
        icon={Layers}
        label="Active subscriptions"
        value={activeCount}
        accent="bg-amber-500"
        iconBg="bg-amber-50 dark:bg-amber-950/50"
        iconColor="text-amber-600 dark:text-amber-400"
        hoverColor="group-hover:text-amber-600 dark:group-hover:text-amber-400"
        sub={
          upcomingCount > 0 ? (
            <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
              {upcomingCount} renewing soon
            </span>
          ) : (
            "All renewals on track"
          )
        }
      />
    </div>
  );
}



