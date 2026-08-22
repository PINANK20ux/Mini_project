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
      <div className="animate-scale-in rounded-xl border border-stone-200/80 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/95">
        <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
          {label} Projection
        </p>
        <p className="mt-0.5 font-mono text-sm font-bold text-teal-600 dark:text-teal-400">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function ProjectionChart({ projectionData }) {
  return (
    <div className="group rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:border-stone-300 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Projected spend, next 6 months
          </h3>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            Includes monthly bills and upcoming annual renewals
          </p>
        </div>
      </div>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="normalBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-stone-100 dark:stroke-stone-800/80"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              stroke="currentColor"
              className="text-stone-500 dark:text-stone-400 font-medium"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              stroke="currentColor"
              className="text-stone-400 dark:text-stone-500 font-mono"
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              content={<CustomBarTooltip />}
              cursor={{ fill: "rgba(13, 148, 136, 0.06)", radius: 6 }}
            />
            <Bar
              dataKey="amount"
              fill="url(#normalBarGradient)"
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



