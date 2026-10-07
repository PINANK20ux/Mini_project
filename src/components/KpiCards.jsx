import React from "react";
import { Wallet, CalendarClock, Layers } from "lucide-react";
import { formatCurrency } from "../utils/format.js";

function KpiCard({ icon: Icon, label, value, sub, accentGradient, iconBg, iconColor, glowColor }) {
  return (
    <div className={`group glass-card-interactive glass-specular p-5 rounded-2xl ${glowColor}`}>
      {/* Left Glowing Accent Bar */}
      <span
        className={`absolute left-0 top-0 h-full w-1.5 transition-all duration-300 group-hover:w-2 bg-gradient-to-b ${accentGradient}`}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} backdrop-blur-md transition-transform duration-300 group-hover:scale-110 shadow-sm`}
        >
          <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
        </div>
      </div>
      <p className="mt-3 font-mono text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-slate-900 dark:text-white">
        {value}
      </p>
      {sub && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Monthly Spend */}
      <KpiCard
        icon={Wallet}
        label="Monthly Spend"
        value={formatCurrency(totalMonthly)}
        accentGradient="from-cyan-400 to-blue-500"
        iconBg="bg-cyan-500/15 border border-cyan-500/25"
        iconColor="text-cyan-600 dark:text-cyan-300"
        glowColor="hover:border-cyan-400/50"
        sub="Across all active subscriptions"
      />

      {/* Annual Projection */}
      <KpiCard
        icon={CalendarClock}
        label="Annual Projection"
        value={formatCurrency(totalAnnual)}
        accentGradient="from-indigo-400 to-purple-500"
        iconBg="bg-indigo-500/15 border border-indigo-500/25"
        iconColor="text-indigo-600 dark:text-indigo-300"
        glowColor="hover:border-indigo-400/50"
        sub="Projected 12-month commitment"
      />

      {/* Active Subscriptions Count */}
      <KpiCard
        icon={Layers}
        label="Active Subscriptions"
        value={activeCount}
        accentGradient="from-amber-400 to-orange-500"
        iconBg="bg-amber-500/15 border border-amber-500/25"
        iconColor="text-amber-600 dark:text-amber-300"
        glowColor="hover:border-amber-400/50"
        sub={
          upcomingCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-cyan-600 dark:text-cyan-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              {upcomingCount} renewing soon
            </span>
          ) : (
            "All renewals on schedule"
          )
        }
      />
    </div>
  );
}
