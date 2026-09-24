import React from "react";
import { Wallet, CalendarClock, Layers, Sparkles } from "lucide-react";
import { formatCurrency } from "../utils/format.js";

function KpiCard({ icon: Icon, label, value, sub, accentColor, iconBg, iconColor }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#DCD5C9] bg-[#EAE2D6] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#8B9A6E]/50 hover:shadow-md dark:border-[#2E2D27] dark:bg-[#24231F] dark:hover:border-[#8B9A6E]/50">
      {/* Accent Indicator Bar */}
      <span
        className={`absolute left-0 top-0 h-full w-1.5 transition-all duration-300 group-hover:w-2 ${accentColor}`}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-[#4D5047] dark:text-[#A6A89F]">
          {label}
        </p>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <p className="mt-3 font-mono text-2xl font-extrabold tracking-tight tabular-nums text-[#1F211C] dark:text-[#F7F2EB]">
        {value}
      </p>
      {sub && (
        <p className="mt-1.5 text-xs text-[#70736A] dark:text-[#8D9087]">
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
        accentColor="bg-[#8B9A6E]"
        iconBg="bg-[#8B9A6E]/20"
        iconColor="text-[#4E5C37] dark:text-[#D5E0C2]"
        sub="Across all active subscriptions"
      />

      {/* Annual Projection */}
      <KpiCard
        icon={CalendarClock}
        label="Annual Projection"
        value={formatCurrency(totalAnnual)}
        accentColor="bg-[#6E859A]"
        iconBg="bg-[#6E859A]/20"
        iconColor="text-[#3D5265] dark:text-[#C5D9EB]"
        sub="Projected 12-month commitment"
      />

      {/* Active Subscriptions Count */}
      <KpiCard
        icon={Layers}
        label="Active Subscriptions"
        value={activeCount}
        accentColor="bg-[#B89758]"
        iconBg="bg-[#B89758]/20"
        iconColor="text-[#6D5322] dark:text-[#EBD6A7]"
        sub={
          upcomingCount > 0 ? (
            <span className="inline-flex items-center gap-1 font-semibold text-[#8B9A6E] dark:text-[#A4B585]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B9A6E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#8B9A6E]"></span>
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
