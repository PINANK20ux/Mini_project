import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORIES } from "../constants/categories.js";
import { formatCurrency } from "../utils/format.js";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const cat = CATEGORIES[data.name] || {};
    return (
      <div className="animate-scale-in rounded-xl border border-stone-200/80 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/95">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${cat.dot || "bg-violet-500"}`} />
          <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
            {data.name}
          </span>
        </div>
        <p className="mt-1 font-mono text-sm font-bold text-stone-900 dark:text-stone-100">
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
    <div className="group rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:border-stone-300 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Spend by category
          </h3>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            Monthly-equivalent spend breakdown
          </p>
        </div>
      </div>

      {categoryData.length === 0 ? (
        <div className="mt-6 flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 text-center dark:border-stone-800">
          <p className="text-xs font-semibold text-stone-600 dark:text-stone-400">
            No category spend data yet
          </p>
          <p className="mt-1 text-[11px] text-stone-400 dark:text-stone-500">
            Add your first subscription above to view breakdown
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
                      fill={CATEGORIES[entry.name]?.hex || "#8b5cf6"}
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
                      ? "bg-stone-100 dark:bg-stone-800 scale-[1.02] shadow-sm"
                      : "hover:bg-stone-50 dark:hover:bg-stone-850"
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-stone-700 dark:text-stone-300">
                    <span
                      className={`h-2.5 w-2.5 rounded-full transition-transform duration-200 ${
                        CATEGORIES[c.name]?.dot
                      } ${isHovered ? "scale-125" : ""}`}
                    />
                    <span className={`font-medium ${isHovered ? "text-stone-900 dark:text-white" : ""}`}>
                      {c.name}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 font-mono">
                      {formatCurrency(c.value)}
                    </span>
                    <span className="rounded-md bg-stone-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
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



