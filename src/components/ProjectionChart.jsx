import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCurrency } from "../utils/format.js";

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="animate-scale-in rounded-xl border border-white/60 dark:border-white/15 bg-white/85 dark:bg-slate-900/85 px-3.5 py-2 shadow-glass backdrop-blur-xl">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {label} Projection
        </p>
        <p className="mt-0.5 font-mono text-sm font-extrabold text-cyan-600 dark:text-cyan-400">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function ProjectionChart({ projectionData }) {
  return (
    <div className="glass-panel glass-specular p-5 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Projected Spend, Next 6 Months
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Includes monthly charges and upcoming annual renewals
          </p>
        </div>
      </div>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="glassBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.45} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-slate-300/40 dark:text-slate-700/40"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              stroke="#64748b"
              className="font-semibold"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              stroke="#64748b"
              className="font-mono"
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              content={<CustomBarTooltip />}
              cursor={{ fill: "rgba(56, 189, 248, 0.08)", radius: 6 }}
            />
            <Bar
              dataKey="amount"
              fill="url(#glassBarGradient)"
              radius={[6, 6, 2, 2]}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
