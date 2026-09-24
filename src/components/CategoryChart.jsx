import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORIES } from "../constants/categories.js";
import { formatCurrency } from "../utils/format.js";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const cat = CATEGORIES[data.name] || {};
    return (
      <div className="animate-scale-in rounded-xl border border-[#DCD5C9] bg-[#F7F2EB] px-3.5 py-2 shadow-lg backdrop-blur-sm dark:border-[#2E2D27] dark:bg-[#181916]">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${cat.dot || "bg-[#8B9A6E]"}`} />
          <span className="text-xs font-bold text-[#1F211C] dark:text-[#F7F2EB]">
            {data.name}
          </span>
        </div>
        <p className="mt-1 font-mono text-sm font-extrabold text-[#1F211C] dark:text-[#F7F2EB]">
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
    <div className="group rounded-2xl border border-[#DCD5C9] bg-[#EAE2D6] p-5 shadow-sm transition-all duration-300 hover:border-[#8B9A6E]/50 hover:shadow-md dark:border-[#2E2D27] dark:bg-[#24231F] dark:hover:border-[#8B9A6E]/50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-[#1F211C] dark:text-[#F7F2EB]">
            Spend by Category
          </h3>
          <p className="mt-0.5 text-xs text-[#70736A] dark:text-[#8D9087]">
            Monthly distribution breakdown
          </p>
        </div>
      </div>

      {categoryData.length === 0 ? (
        <div className="mt-6 flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[#DCD5C9] text-center dark:border-[#2E2D27]">
          <p className="text-xs font-semibold text-[#70736A] dark:text-[#8D9087]">
            No category spend data yet
          </p>
          <p className="mt-1 text-[11px] text-[#70736A] dark:text-[#8D9087]">
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
                      fill={CATEGORIES[entry.name]?.hex || "#8B9A6E"}
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
                      ? "bg-[#F7F2EB] dark:bg-[#181916] scale-[1.02] shadow-sm"
                      : "hover:bg-[#F7F2EB]/60 dark:hover:bg-[#181916]/60"
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-[#1F211C] dark:text-[#F7F2EB]">
                    <span
                      className={`h-2.5 w-2.5 rounded-full transition-transform duration-200 ${
                        CATEGORIES[c.name]?.dot || "bg-[#8B9A6E]"
                      } ${isHovered ? "scale-125" : ""}`}
                    />
                    <span className="font-semibold text-xs">
                      {c.name}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#70736A] dark:text-[#8D9087] font-mono">
                      {formatCurrency(c.value)}
                    </span>
                    <span className="rounded-md bg-[#F7F2EB] px-1.5 py-0.5 font-mono text-xs font-bold text-[#4E5C37] dark:bg-[#181916] dark:text-[#D5E0C2]">
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
