import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORIES } from "../constants/categories.js";
import { formatCurrency } from "../utils/format.js";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const cat = CATEGORIES[data.name] || {};
    return (
      <div className="animate-scale-in rounded-xl border border-white/60 dark:border-white/15 bg-white/80 dark:bg-slate-900/85 px-3.5 py-2 shadow-glass backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${cat.dot || "bg-cyan-500"}`} />
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {data.name}
          </span>
        </div>
        <p className="mt-1 font-mono text-sm font-extrabold text-slate-900 dark:text-slate-100">
          {formatCurrency(data.value)}/mo
        </p>
      </div>
    );
  }
  return null;
};

export default function CategoryChart({ categoryData, totalMonthly }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="glass-panel glass-specular p-5 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Spend by Category
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Monthly distribution breakdown
          </p>
        </div>
      </div>

      {categoryData.length === 0 ? (
        <div className="mt-6 flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/60 dark:border-white/10 bg-white/20 dark:bg-white/[0.02] text-center">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            No category spend data yet
          </p>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Add a subscription to view distribution breakdown
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
          <div className="h-56 w-full sm:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORIES[entry.name]?.hex || "#06b6d4"}
                      stroke="transparent"
                      className="transition-all duration-300 cursor-pointer"
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                      style={{
                        transform:
                          activeIndex === index ? "scale(1.04)" : "scale(1)",
                        transformOrigin: "center center",
                        transition: "transform 0.25s ease-out, opacity 0.25s ease-out",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full space-y-1.5 sm:w-1/2">
            {categoryData.map((c, index) => {
              const isHovered = activeIndex === index;
              const pct = totalMonthly > 0 ? Math.round((c.value / totalMonthly) * 100) : 0;
              return (
                <div
                  key={c.name}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-sm transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? "bg-white/80 dark:bg-white/10 scale-[1.02] shadow-sm border border-white/60 dark:border-white/15"
                      : "hover:bg-white/50 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
                    <span
                      className={`h-2.5 w-2.5 rounded-full transition-transform duration-200 ${
                        CATEGORIES[c.name]?.dot || "bg-cyan-500"
                      } ${isHovered ? "scale-125" : ""}`}
                    />
                    <span className="font-semibold text-xs">
                      {c.name}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {formatCurrency(c.value)}
                    </span>
                    <span className="rounded-md bg-white/70 dark:bg-white/10 border border-white/50 dark:border-white/10 px-1.5 py-0.5 font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
