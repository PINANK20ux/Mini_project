import React, { useState, useEffect, useMemo } from "react";
import CategoryChart from "./CategoryChart.jsx";
import ProjectionChart from "./ProjectionChart.jsx";
import {
  TrendingUp,
  Sliders,
  Banknote,
  Wand2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { CATEGORIES, CATEGORY_KEYS } from "../constants/categories.js";
import { formatCurrency, monthlyEquivalent, round2 } from "../utils/format.js";

const BUDGET_CAPS_KEY = "subzero_budget_caps_v1";

const DEFAULT_BUDGETS = {
  Entertainment: 2000,
  Fitness: 2500,
  Utilities: 3000,
  Housing: 18000,
  Work: 4500,
};

export default function AnalyticsSection({
  subs,
  totalMonthly,
  categoryData,
  projectionData,
  salary,
  onUpdateSalary,
}) {
  const [budgetCaps, setBudgetCaps] = useState(() => {
    try {
      const raw = localStorage.getItem(BUDGET_CAPS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_BUDGETS;
    } catch (e) {
      return DEFAULT_BUDGETS;
    }
  });

  const [salaryInput, setSalaryInput] = useState(String(salary || 60000));
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(BUDGET_CAPS_KEY, JSON.stringify(budgetCaps));
    } catch (e) { }
  }, [budgetCaps]);

  const handleBudgetChange = (cat, val) => {
    setBudgetCaps((prev) => ({
      ...prev,
      [cat]: Math.max(0, Number(val)),
    }));
  };

  const handleSaveSalary = (e) => {
    e?.preventDefault();
    const num = parseFloat(salaryInput);
    if (!isNaN(num) && num > 0) {
      onUpdateSalary(num);
      setIsEditingSalary(false);
    }
  };

  // Auto-calculate smart recommended limits based on monthly income
  const applySmartSalaryLimits = () => {
    const s = Number(salary || 60000);
    const recommended = {
      Housing: Math.round(s * 0.30),
      Work: Math.max(1500, Math.round(s * 0.06)),
      Utilities: Math.max(1500, Math.round(s * 0.05)),
      Fitness: Math.max(1000, Math.round(s * 0.04)),
      Entertainment: Math.max(800, Math.round(s * 0.03)),
    };
    setBudgetCaps(recommended);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 3000);
  };

  const categorySpendMap = useMemo(() => {
    const map = {};
    CATEGORY_KEYS.forEach((c) => (map[c] = 0));
    subs.forEach((s) => {
      map[s.category] = (map[s.category] || 0) + monthlyEquivalent(s);
    });
    return map;
  }, [subs]);

  const totalBudgetCap = useMemo(() => {
    return Object.values(budgetCaps).reduce((sum, v) => sum + (v || 0), 0);
  }, [budgetCaps]);

  const isUnderBudget = totalBudgetCap >= totalMonthly;
  const currentSalary = Number(salary || 60000);
  const subscriptionToIncomePct = currentSalary > 0
    ? Math.round((totalMonthly / currentSalary) * 100 * 10) / 10
    : 0;
  const remainingIncome = Math.max(0, currentSalary - totalMonthly);

  let healthGrade = {
    label: "Safe & Healthy",
    desc: "Under 10% of income. Great financial breathing room.",
    color: "text-[#4E5C37] bg-[#8B9A6E]/20 dark:text-[#D5E0C2]",
  };

  if (subscriptionToIncomePct > 20) {
    healthGrade = {
      label: "High Bill Load",
      desc: "Over 20% of income. Consider canceling unused apps.",
      color: "text-rose-800 bg-rose-100 dark:text-rose-300 dark:bg-rose-950/40",
    };
  } else if (subscriptionToIncomePct > 10) {
    healthGrade = {
      label: "Moderate",
      desc: "10%–20% of income. Keep an eye on automatic renewals.",
      color: "text-[#6D5322] bg-[#B89758]/20 dark:text-[#EBD6A7]",
    };
  }

  return (
    <section id="analytics" className="pt-12 scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8B9A6E]/20 text-[#4E5C37] dark:text-[#D5E0C2]">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-[#1F211C] dark:text-[#F7F2EB] sm:text-2xl">
              Smart Budget &amp; Spending
            </h2>
          </div>
          <p className="text-xs text-[#70736A] dark:text-[#8D9087]">
            Track your income-to-bill ratio and 6-month projected spending.
          </p>
        </div>

        {/* Total Target Pill */}
        <div className="flex items-center gap-2 rounded-xl border border-[#DCD5C9] bg-[#EAE2D6] px-3.5 py-1.5 shadow-sm dark:border-[#2E2D27] dark:bg-[#24231F]">
          <span className="text-xs font-semibold text-[#4D5047] dark:text-[#A6A89F]">Monthly Limit:</span>
          <span className="font-mono text-xs font-extrabold text-[#1F211C] dark:text-[#F7F2EB]">
            {formatCurrency(totalBudgetCap)}/mo
          </span>
          <span
            className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${isUnderBudget
                ? "bg-[#8B9A6E]/20 text-[#4E5C37] dark:bg-[#8B9A6E]/30 dark:text-[#D5E0C2]"
                : "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
              }`}
          >
            {isUnderBudget ? "✓ Under Limit" : "! Over Limit"}
          </span>
        </div>
      </div>

      {/* Salary & Income Card */}
      <div className="rounded-3xl border border-[#DCD5C9] bg-[#EAE2D6] p-6 shadow-sm dark:border-[#2E2D27] dark:bg-[#24231F]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-[#DCD5C9] dark:border-[#2E2D27]">
          {/* Salary Settings */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8B9A6E] text-white">
                <Banknote className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1F211C] dark:text-[#F7F2EB]">
                  Your Monthly Take-Home Income
                </h3>
                <p className="text-xs text-[#70736A] dark:text-[#8D9087]">
                  Used to calculate how much you should safely spend on subscriptions.
                </p>
              </div>
            </div>

            {isEditingSalary ? (
              <form onSubmit={handleSaveSalary} className="flex items-center gap-2 pt-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-[#70736A]">₹</span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={salaryInput}
                    onChange={(e) => setSalaryInput(e.target.value)}
                    className="w-36 rounded-xl border border-[#8B9A6E] bg-white py-1.5 pl-7 pr-3 font-mono text-sm font-bold text-[#1F211C] outline-none dark:bg-[#181916] dark:text-[#F7F2EB]"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-[#8B9A6E] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#78875C]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingSalary(false)}
                  className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#70736A] hover:bg-[#DCD5C9]"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3 pt-1">
                <span className="font-mono text-2xl font-extrabold text-[#1F211C] dark:text-[#F7F2EB]">
                  {formatCurrency(currentSalary)}
                </span>
                <button
                  onClick={() => {
                    setSalaryInput(String(currentSalary));
                    setIsEditingSalary(true);
                  }}
                  className="rounded-lg border border-[#DCD5C9] bg-[#F7F2EB] px-2.5 py-1 text-xs font-semibold text-[#4D5047] hover:border-[#8B9A6E] hover:text-[#1F211C] dark:border-[#2E2D27] dark:bg-[#181916] dark:text-[#F7F2EB]"
                >
                  Change Income
                </button>
              </div>
            )}
          </div>

          {/* Quick Auto-Calculate Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={applySmartSalaryLimits}
              className="group flex items-center gap-2 rounded-2xl bg-[#8B9A6E] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#78875C] hover:shadow active:scale-95"
              title="Automatically calculate healthy limits for each category based on your income"
            >
              <Wand2 className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              <span>Calculate Recommended limits</span>
            </button>

            {appliedNotice && (
              <span className="animate-fade-in text-xs font-bold text-[#4E5C37] dark:text-[#D5E0C2]">
                ✓ Recommended limits applied!
              </span>
            )}
          </div>
        </div>

        {/* 3 Summary Cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#DCD5C9] bg-[#F7F2EB] p-4 dark:border-[#2E2D27] dark:bg-[#181916]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#70736A] dark:text-[#8D9087]">
              Bill to Income Ratio
            </p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="font-mono text-xl font-extrabold text-[#1F211C] dark:text-[#F7F2EB]">
                {subscriptionToIncomePct}%
              </p>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${healthGrade.color}`}>
                {healthGrade.label}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#70736A] dark:text-[#8D9087]">
              {healthGrade.desc}
            </p>
          </div>

          <div className="rounded-2xl border border-[#DCD5C9] bg-[#F7F2EB] p-4 dark:border-[#2E2D27] dark:bg-[#181916]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#70736A] dark:text-[#8D9087]">
              Total Monthly Subscriptions
            </p>
            <p className="mt-2 font-mono text-xl font-extrabold text-[#1F211C] dark:text-[#F7F2EB]">
              {formatCurrency(totalMonthly)}
            </p>
            <p className="mt-1 text-[11px] text-[#70736A] dark:text-[#8D9087]">
              Budget limit: {formatCurrency(totalBudgetCap)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#DCD5C9] bg-[#F7F2EB] p-4 dark:border-[#2E2D27] dark:bg-[#181916]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#70736A] dark:text-[#8D9087]">
              Money Left for You
            </p>
            <p className="mt-2 font-mono text-xl font-extrabold text-[#4E5C37] dark:text-[#D5E0C2]">
              {formatCurrency(remainingIncome)}
            </p>
            <p className="mt-1 text-[11px] text-[#70736A] dark:text-[#8D9087]">
              After all recurring bills are covered
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryChart categoryData={categoryData} totalMonthly={totalMonthly} />
        <ProjectionChart projectionData={projectionData} />
      </div>

      {/* Category Budget Limits */}
      <div className="rounded-2xl border border-[#DCD5C9] bg-[#EAE2D6] p-5 shadow-sm dark:border-[#2E2D27] dark:bg-[#24231F]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-[#DCD5C9] dark:border-[#2E2D27]">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#8B9A6E]" />
            <h3 className="text-sm font-bold text-[#1F211C] dark:text-[#F7F2EB]">
              Set Monthly Limits per Category
            </h3>
          </div>
          <span className="text-[11px] text-[#70736A] dark:text-[#8D9087] font-medium">
            Drag sliders to adjust spending limits
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_KEYS.map((catKey) => {
            const actualSpend = round2(categorySpendMap[catKey] || 0);
            const cap = budgetCaps[catKey] || 2500;
            const pct = cap > 0 ? Math.round((actualSpend / cap) * 100) : 0;
            const isExceeded = actualSpend > cap;
            const isApproaching = pct >= 75 && !isExceeded;

            let color = "bg-[#8B9A6E]";
            if (isExceeded) color = "bg-rose-500";
            else if (isApproaching) color = "bg-[#B89758]";

            return (
              <div
                key={catKey}
                className="rounded-xl border border-[#DCD5C9] bg-[#F7F2EB] p-3.5 dark:border-[#2E2D27] dark:bg-[#181916]"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-[#1F211C] dark:text-[#F7F2EB]">
                    <span className={`h-2.5 w-2.5 rounded-full ${CATEGORIES[catKey]?.dot || "bg-[#8B9A6E]"}`} />
                    {catKey}
                  </span>
                  <span className="font-mono text-[#70736A] dark:text-[#8D9087]">
                    <strong className="text-[#1F211C] dark:text-[#F7F2EB]">{formatCurrency(actualSpend)}</strong> / {formatCurrency(cap)}
                  </span>
                </div>

                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#EAE2D6] dark:bg-[#24231F]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${color}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <input
                    type="range"
                    min="500"
                    max={Math.max(30000, Math.round(currentSalary * 0.5))}
                    step="250"
                    value={cap}
                    onChange={(e) => handleBudgetChange(catKey, e.target.value)}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#EAE2D6] accent-[#8B9A6E] dark:bg-[#24231F]"
                  />
                  <span className="shrink-0 font-mono text-[10px] font-bold text-[#4E5C37] dark:text-[#D5E0C2]">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
