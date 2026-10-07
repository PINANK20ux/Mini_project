import React, { useState, useMemo } from "react";
import {
  Search,
  ArrowUpDown,
  Pencil,
  Trash2,
  Inbox,
  X,
  Plus,
  Check,
  Download,
  Receipt,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import Badge from "./Badge.jsx";
import { CATEGORIES, CATEGORY_KEYS } from "../constants/categories.js";
import { daysUntil, formatDate, parseISO, toISO, todayDate } from "../utils/date.js";
import { formatCurrency, monthlyEquivalent, round2 } from "../utils/format.js";

export default function SubscriptionsSection({
  subs,
  onEdit,
  onDelete,
  onSaveInline,
  onOpenAdd,
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [cycleFilter, setCycleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-asc");

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [inlineForm, setInlineForm] = useState({
    name: "",
    cost: "",
    category: "",
    cycle: "monthly",
    nextBilling: "",
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const startInlineEdit = (sub) => {
    setEditingId(sub.id);
    setInlineForm({
      name: sub.name,
      cost: String(sub.cost),
      category: sub.category,
      cycle: sub.cycle,
      nextBilling: sub.nextBilling,
    });
  };

  const cancelInlineEdit = () => {
    setEditingId(null);
  };

  const saveInlineEdit = (id) => {
    const costNum = parseFloat(inlineForm.cost);
    if (!inlineForm.name.trim() || isNaN(costNum) || costNum <= 0 || !inlineForm.nextBilling) {
      alert("Please enter a valid bill name, cost, and next payment date.");
      return;
    }
    onSaveInline({
      id,
      name: inlineForm.name.trim(),
      cost: round2(costNum),
      category: inlineForm.category,
      cycle: inlineForm.cycle,
      nextBilling: inlineForm.nextBilling,
    });
    setEditingId(null);
  };

  // Filter and sort
  const filteredSubs = useMemo(() => {
    let list = subs.filter((s) =>
      s.name.toLowerCase().includes(search.trim().toLowerCase())
    );
    if (categoryFilter !== "All") list = list.filter((s) => s.category === categoryFilter);
    if (cycleFilter !== "All") list = list.filter((s) => s.cycle === cycleFilter);

    list = [...list].sort((a, b) => {
      if (sortBy === "date-asc") return parseISO(a.nextBilling) - parseISO(b.nextBilling);
      if (sortBy === "date-desc") return parseISO(b.nextBilling) - parseISO(a.nextBilling);
      if (sortBy === "amount-desc") return b.cost - a.cost;
      if (sortBy === "amount-asc") return a.cost - b.cost;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [subs, search, categoryFilter, cycleFilter, sortBy]);

  const filteredMonthlyTotal = useMemo(() => {
    return round2(filteredSubs.reduce((sum, s) => sum + monthlyEquivalent(s), 0));
  }, [filteredSubs]);

  const handleExportCSV = () => {
    if (subs.length === 0) return;
    const headers = ["ID", "Bill Name", "Cost (INR)", "Billing Cycle", "Category", "Next Payment Date"];
    const rows = subs.map((s) => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      s.cost,
      s.cycle,
      s.category,
      s.nextBilling,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subzero_bills_${toISO(todayDate())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="subscriptions" className="pt-12 scroll-mt-24 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25 backdrop-blur-md">
              <Receipt className="h-4.5 w-4.5" />
            </div>
            <h2 className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              My Subscriptions &amp; Bills
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View all your recurring services, search, filter, and make quick edits.
          </p>
        </div>

        <button
          onClick={onOpenAdd}
          className="glass-button-primary self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+ Add a Bill</span>
        </button>
      </div>

      {/* Control Bar inside Glass Panel */}
      <div className="glass-panel glass-specular p-4 rounded-2xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-xs group">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500" />
            <input
              type="text"
              placeholder="Search bills by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input w-full rounded-xl py-2 pl-9 pr-8 text-xs sm:text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-200/50 hover:text-slate-700 dark:hover:bg-slate-700/50 dark:hover:text-slate-200"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & Export */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="glass-input rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <option value="All">All Categories</option>
              {CATEGORY_KEYS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={cycleFilter}
              onChange={(e) => setCycleFilter(e.target.value)}
              className="glass-input rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <option value="All">All Cycles</option>
              <option value="monthly">Monthly Bills</option>
              <option value="annual">Yearly Bills</option>
            </select>

            <div className="relative group">
              <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="glass-input rounded-xl py-2 pl-8 pr-3 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <option value="date-asc">Due: Soonest</option>
                <option value="date-desc">Due: Latest</option>
                <option value="amount-desc">Cost: Highest First</option>
                <option value="amount-asc">Cost: Lowest First</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              disabled={subs.length === 0}
              className="glass-button-secondary flex items-center gap-1.5 px-3 py-2 text-xs font-semibold disabled:opacity-40"
              title="Download your bills as a CSV spreadsheet"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Status Line */}
        <div className="mt-3 flex flex-wrap items-center justify-between border-t border-white/60 dark:border-white/10 pt-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredSubs.length}</strong> of {subs.length} bills
            </span>
            {(search || categoryFilter !== "All" || cycleFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("All");
                  setCycleFilter("All");
                }}
                className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
              >
                <RotateCcw className="h-3 w-3" />
                Reset filters
              </button>
            )}
          </div>
          <div className="font-mono">
            Filtered monthly total: <strong className="text-slate-900 dark:text-white">{formatCurrency(filteredMonthlyTotal)}</strong>
          </div>
        </div>
      </div>

      {/* Main Glass Table */}
      <div className="glass-panel glass-specular rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/60 dark:border-white/10 bg-white/40 dark:bg-white/[0.04] backdrop-blur-md text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3.5">Bill Name</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Cost</th>
                <th className="px-4 py-3.5">Cycle</th>
                <th className="px-4 py-3.5">Next Payment Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 dark:divide-white/[0.07]">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="h-8 w-8 text-slate-400" />
                      <p className="font-bold text-slate-900 dark:text-white">
                        No bills match your current filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubs.map((s) => {
                  const isInline = editingId === s.id;
                  const d = daysUntil(s.nextBilling);
                  const soon = d >= 0 && d <= 7;

                  if (isInline) {
                    return (
                      <tr key={s.id} className="bg-cyan-500/10 dark:bg-cyan-500/15 backdrop-blur-md">
                        <td className="px-4 py-2.5">
                          <input
                            type="text"
                            value={inlineForm.name}
                            onChange={(e) => setInlineForm({ ...inlineForm, name: e.target.value })}
                            className="glass-input w-full rounded-lg px-2 py-1 text-xs font-semibold"
                            autoFocus
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <select
                            value={inlineForm.category}
                            onChange={(e) => setInlineForm({ ...inlineForm, category: e.target.value })}
                            className="glass-input rounded-lg px-2 py-1 text-xs"
                          >
                            {CATEGORY_KEYS.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="number"
                            step="0.01"
                            value={inlineForm.cost}
                            onChange={(e) => setInlineForm({ ...inlineForm, cost: e.target.value })}
                            className="glass-input w-24 rounded-lg px-2 py-1 font-mono text-xs"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <select
                            value={inlineForm.cycle}
                            onChange={(e) => setInlineForm({ ...inlineForm, cycle: e.target.value })}
                            className="glass-input rounded-lg px-2 py-1 text-xs"
                          >
                            <option value="monthly">Monthly</option>
                            <option value="annual">Annual</option>
                          </select>
                        </td>
                        <td className="px-4 py-2.5">
                          <input
                            type="date"
                            value={inlineForm.nextBilling}
                            onChange={(e) => setInlineForm({ ...inlineForm, nextBilling: e.target.value })}
                            className="glass-input rounded-lg px-2 py-1 text-xs"
                          >
                          </input>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => saveInlineEdit(s.id)}
                              className="rounded-lg bg-emerald-500 p-1.5 text-white hover:bg-emerald-600 shadow-sm"
                              title="Save changes"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={cancelInlineEdit}
                              className="glass-button-secondary rounded-lg p-1.5"
                              title="Cancel"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={s.id}
                      className="group transition-colors duration-150 hover:bg-white/60 dark:hover:bg-white/[0.06]"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${CATEGORIES[s.category]?.dot || "bg-cyan-500"}`}
                          />
                          <span className="font-bold text-slate-900 dark:text-white">
                            {s.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge category={s.category} />
                      </td>
                      <td className="px-4 py-3.5 font-mono text-sm font-extrabold tabular-nums text-slate-900 dark:text-white">
                        {formatCurrency(s.cost)}
                      </td>
                      <td className="px-4 py-3.5 capitalize text-slate-500 dark:text-slate-400">
                        <span className="inline-flex rounded-md bg-white/60 dark:bg-white/10 border border-white/50 dark:border-white/10 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {s.cycle}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            soon
                              ? "rounded-md bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-cyan-700 dark:text-cyan-300 backdrop-blur-md"
                              : "text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {soon && <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />}
                          {formatDate(s.nextBilling)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => startInlineEdit(s)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-white/80 hover:text-slate-800 dark:hover:bg-white/10 dark:hover:text-white text-[11px] font-bold transition-colors"
                            title="Quick inline edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onEdit(s)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-cyan-500/15 hover:text-cyan-600 dark:hover:bg-cyan-500/20 dark:hover:text-cyan-300 transition-colors"
                            title="Open full edit window"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(s.id)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/15 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 transition-colors"
                            title="Delete bill"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="glass-panel glass-specular w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/25">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Remove this bill?
              </h3>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to delete this subscription from your active list?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="glass-button-secondary px-3.5 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-red-700 active:scale-95 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
