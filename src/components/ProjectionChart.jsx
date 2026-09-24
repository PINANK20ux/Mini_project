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
      <div className="animate-scale-in rounded-xl border border-[#DCD5C9] bg-[#F7F2EB] px-3.5 py-2 shadow-lg backdrop-blur-sm dark:border-[#2E2D27] dark:bg-[#181916]">
        <p className="text-xs font-semibold text-[#70736A] dark:text-[#8D9087]">
          {label} Projection
        </p>
        <p className="mt-0.5 font-mono text-sm font-extrabold text-[#4E5C37] dark:text-[#D5E0C2]">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function ProjectionChart({ projectionData }) {
  return (
    <div className="group rounded-2xl border border-[#DCD5C9] bg-[#EAE2D6] p-5 shadow-sm transition-all duration-300 hover:border-[#8B9A6E]/50 hover:shadow-md dark:border-[#2E2D27] dark:bg-[#24231F] dark:hover:border-[#8B9A6E]/50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-[#1F211C] dark:text-[#F7F2EB]">
            Projected Spend, Next 6 Months
          </h3>
          <p className="mt-0.5 text-xs text-[#70736A] dark:text-[#8D9087]">
            Includes monthly charges and upcoming annual renewals
          </p>
        </div>
      </div>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sageBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B9A6E" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#8B9A6E" stopOpacity={0.45} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#DCD5C9"
              className="dark:opacity-20"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              stroke="#70736A"
              className="font-semibold"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              stroke="#70736A"
              className="font-mono"
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              content={<CustomBarTooltip />}
              cursor={{ fill: "rgba(139, 154, 110, 0.08)", radius: 6 }}
            />
            <Bar
              dataKey="amount"
              fill="url(#sageBarGradient)"
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
