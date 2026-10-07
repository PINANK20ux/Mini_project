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
    color: "text-emerald-700 bg-emerald-500/15 border-emerald-500/30 dark:text-emerald-300 dark:bg-emerald-500/20",
  };

  if (subscriptionToIncomePct > 20) {
    healthGrade = {
      label: "High Bill Load",
      desc: "Over 20% of income. Consider canceling unused apps.",
      color: "text-rose-700 bg-rose-500/15 border-rose-500/30 dark:text-rose-300 dark:bg-rose-500/20",
    };
  } else if (subscriptionToIncomePct > 10) {
    healthGrade = {
      label: "Moderate",
      desc: "10%–20% of income. Keep an eye on automatic renewals.",
      color: "text-amber-700 bg-amber-500/15 border-amber-500/30 dark:text-amber-300 dark:bg-amber-500/20",
    };
  }

  return (
    <section id="analytics" className="pt-12 scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25 backdrop-blur-md">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h2 className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Smart Budget &amp; Spending
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track your income-to-bill ratio and 6-month projected spending.
          </p>
        </div>

        {/* Total Target Pill */}
        <div className="glass-card flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-white/60 dark:border-white/10">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Monthly Limit:</span>
          <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(totalBudgetCap)}/mo
          </span>
          <span
            className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold border backdrop-blur-md ${isUnderBudget
                ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-300"
                : "bg-rose-500/15 text-rose-700 border-rose-500/25 dark:text-rose-300"
              }`}
          >
            {isUnderBudget ? "✓ Under Limit" : "! Over Limit"}
          </span>
        </div>
      </div>

      {/* Salary & Income Card */}
      <div className="glass-panel glass-specular p-6 rounded-3xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-white/60 dark:border-white/10">
          {/* Salary Settings */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
                <Banknote className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Your Monthly Take-Home Income
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Used to calculate how much you should safely spend on subscriptions.
                </p>
              </div>
            </div>

            {isEditingSalary ? (
              <form onSubmit={handleSaveSalary} className="flex items-center gap-2 pt-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">₹</span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={salaryInput}
                    onChange={(e) => setSalaryInput(e.target.value)}
                    className="glass-input w-36 rounded-xl py-1.5 pl-7 pr-3 font-mono text-sm font-bold"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="glass-button-primary px-3.5 py-1.5 text-xs"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingSalary(false)}
                  className="glass-button-secondary px-2.5 py-1.5 text-xs"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3 pt-1">
                <span className="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(currentSalary)}
                </span>
                <button
                  onClick={() => {
                    setSalaryInput(String(currentSalary));
                    setIsEditingSalary(true);
                  }}
                  className="glass-button-secondary px-2.5 py-1 text-xs"
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
              className="glass-button-primary group flex items-center gap-2 px-4 py-2.5 text-xs"
              title="Automatically calculate healthy limits for each category based on your income"
            >
              <Wand2 className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              <span>Calculate Recommended limits</span>
            </button>

            {appliedNotice && (
              <span className="animate-fade-in text-xs font-bold text-cyan-600 dark:text-cyan-300">
                ✓ Recommended limits applied!
              </span>
            )}
          </div>
        </div>

        {/* 3 Summary Cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="glass-card-interactive glass-specular p-4 rounded-2xl">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Bill to Income Ratio
            </p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="font-mono text-xl font-extrabold text-slate-900 dark:text-white">
                {subscriptionToIncomePct}%
              </p>
              <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold backdrop-blur-md ${healthGrade.color}`}>
                {healthGrade.label}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              {healthGrade.desc}
            </p>
          </div>

          <div className="glass-card-interactive glass-specular p-4 rounded-2xl">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Monthly Subscriptions
            </p>
            <p className="mt-2 font-mono text-xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(totalMonthly)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Budget limit: {formatCurrency(totalBudgetCap)}
            </p>
          </div>

          <div className="glass-card-interactive glass-specular p-4 rounded-2xl">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Money Left for You
            </p>
            <p className="mt-2 font-mono text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(remainingIncome)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
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
      <div className="glass-panel glass-specular p-5 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-white/60 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-cyan-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Set Monthly Limits per Category
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
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

            let color = "bg-gradient-to-r from-cyan-500 to-blue-500";
            if (isExceeded) color = "bg-gradient-to-r from-rose-500 to-red-600";
            else if (isApproaching) color = "bg-gradient-to-r from-amber-400 to-orange-500";

            return (
              <div
                key={catKey}
                className="glass-card-interactive glass-specular p-3.5 rounded-xl"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <span className={`h-2.5 w-2.5 rounded-full ${CATEGORIES[catKey]?.dot || "bg-cyan-500"}`} />
                    {catKey}
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-900 dark:text-white">{formatCurrency(actualSpend)}</strong> / {formatCurrency(cap)}
                  </span>
                </div>

                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200/60 dark:bg-slate-800/60 backdrop-blur-sm">
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
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-700 accent-cyan-500"
                  />
                  <span className="shrink-0 font-mono text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
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
