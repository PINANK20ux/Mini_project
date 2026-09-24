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
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8B9A6E]/20 text-[#4E5C37] dark:text-[#D5E0C2]">
              <Receipt className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-[#1F211C] dark:text-[#F7F2EB] sm:text-2xl">
              My Subscriptions &amp; Bills
            </h2>
          </div>
          <p className="text-xs text-[#70736A] dark:text-[#8D9087]">
            View all your recurring services, search, filter, and make quick edits.
          </p>
        </div>

        <button
          onClick={onOpenAdd}
          className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl bg-[#8B9A6E] px-4 py-2 text-xs font-bold text-white shadow transition-all hover:bg-[#78875C] active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+ Add a Bill</span>
        </button>
      </div>

      {/* Control Bar inside Sandstone Cream container */}
      <div className="rounded-2xl border border-[#DCD5C9] bg-[#EAE2D6] p-4 shadow-sm dark:border-[#2E2D27] dark:bg-[#24231F]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-xs group">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#70736A] group-focus-within:text-[#8B9A6E]" />
            <input
              type="text"
              placeholder="Search bills by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#DCD5C9] bg-[#F7F2EB] py-2 pl-9 pr-8 text-xs sm:text-sm text-[#1F211C] outline-none transition-all placeholder:text-[#70736A] focus:border-[#8B9A6E] focus:bg-white focus:ring-2 focus:ring-[#8B9A6E]/15 dark:border-[#2E2D27] dark:bg-[#181916] dark:text-[#F7F2EB] dark:placeholder:text-[#70736A]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#70736A] hover:bg-[#DCD5C9] hover:text-[#1F211C]"
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
              className="rounded-xl border border-[#DCD5C9] bg-[#F7F2EB] px-3 py-2 text-xs sm:text-sm font-semibold text-[#1F211C] outline-none hover:border-[#8B9A6E] dark:border-[#2E2D27] dark:bg-[#181916] dark:text-[#F7F2EB]"
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
              className="rounded-xl border border-[#DCD5C9] bg-[#F7F2EB] px-3 py-2 text-xs sm:text-sm font-semibold text-[#1F211C] outline-none hover:border-[#8B9A6E] dark:border-[#2E2D27] dark:bg-[#181916] dark:text-[#F7F2EB]"
            >
              <option value="All">All Cycles</option>
              <option value="monthly">Monthly Bills</option>
              <option value="annual">Yearly Bills</option>
            </select>

            <div className="relative group">
              <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#70736A] group-focus-within:text-[#8B9A6E]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-[#DCD5C9] bg-[#F7F2EB] py-2 pl-8 pr-3 text-xs sm:text-sm font-semibold text-[#1F211C] outline-none hover:border-[#8B9A6E] dark:border-[#2E2D27] dark:bg-[#181916] dark:text-[#F7F2EB]"
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
              className="flex items-center gap-1.5 rounded-xl border border-[#DCD5C9] bg-[#F7F2EB] px-3 py-2 text-xs font-semibold text-[#1F211C] shadow-sm hover:bg-white disabled:opacity-40 dark:border-[#2E2D27] dark:bg-[#181916] dark:text-[#F7F2EB]"
              title="Download your bills as a CSV spreadsheet"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Status Line */}
        <div className="mt-3 flex flex-wrap items-center justify-between border-t border-[#DCD5C9] pt-3 text-xs text-[#70736A] dark:border-[#2E2D27] dark:text-[#8D9087]">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-[#1F211C] dark:text-[#F7F2EB]">{filteredSubs.length}</strong> of {subs.length} bills
            </span>
            {(search || categoryFilter !== "All" || cycleFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("All");
                  setCycleFilter("All");
                }}
                className="inline-flex items-center gap-1 text-[#8B9A6E] dark:text-[#A4B585] hover:underline font-semibold"
              >
                <RotateCcw className="h-3 w-3" />
                Reset filters
              </button>
            )}
          </div>
          <div className="font-mono">
            Filtered monthly total: <strong className="text-[#1F211C] dark:text-[#F7F2EB]">{formatCurrency(filteredMonthlyTotal)}</strong>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-[#DCD5C9] bg-[#EAE2D6] shadow-sm dark:border-[#2E2D27] dark:bg-[#24231F]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#DCD5C9] bg-[#E2D9CC]/70 text-xs font-bold uppercase tracking-wider text-[#4D5047] dark:border-[#2E2D27] dark:bg-[#1E1D19] dark:text-[#A6A89F]">
                <th className="px-4 py-3.5">Bill Name</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Cost</th>
                <th className="px-4 py-3.5">Cycle</th>
                <th className="px-4 py-3.5">Next Payment Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD5C9]/70 dark:divide-[#2E2D27]/70">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#70736A]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="h-8 w-8 text-[#70736A]" />
                      <p className="font-bold text-[#1F211C] dark:text-[#F7F2EB]">
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
                      <tr key={s.id} className="bg-[#8B9A6E]/10 dark:bg-[#8B9A6E]/15">
                        <td className="px-4 py-2.5">
                          <input
                            type="text"
                            value={inlineForm.name}
                            onChange={(e) => setInlineForm({ ...inlineForm, name: e.target.value })}
                            className="w-full rounded-lg border border-[#8B9A6E] bg-white px-2 py-1 text-xs font-semibold text-[#1F211C] outline-none dark:bg-[#181916] dark:text-[#F7F2EB]"
                            autoFocus
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <select
                            value={inlineForm.category}
                            onChange={(e) => setInlineForm({ ...inlineForm, category: e.target.value })}
                            className="rounded-lg border border-[#8B9A6E] bg-white px-2 py-1 text-xs text-[#1F211C] outline-none dark:bg-[#181916] dark:text-[#F7F2EB]"
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
                            className="w-24 rounded-lg border border-[#8B9A6E] bg-white px-2 py-1 font-mono text-xs text-[#1F211C] outline-none dark:bg-[#181916] dark:text-[#F7F2EB]"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <select
                            value={inlineForm.cycle}
                            onChange={(e) => setInlineForm({ ...inlineForm, cycle: e.target.value })}
                            className="rounded-lg border border-[#8B9A6E] bg-white px-2 py-1 text-xs text-[#1F211C] outline-none dark:bg-[#181916] dark:text-[#F7F2EB]"
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
                            className="rounded-lg border border-[#8B9A6E] bg-white px-2 py-1 text-xs text-[#1F211C] outline-none dark:bg-[#181916] dark:text-[#F7F2EB]"
                          />
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => saveInlineEdit(s.id)}
                              className="rounded-lg bg-[#8B9A6E] p-1.5 text-white hover:bg-[#78875C]"
                              title="Save changes"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={cancelInlineEdit}
                              className="rounded-lg bg-[#DCD5C9] p-1.5 text-[#1F211C] hover:bg-[#DDD6CA] dark:bg-[#2E2D27] dark:text-[#F7F2EB]"
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
                      className="group transition-colors duration-150 hover:bg-[#F7F2EB]/60 dark:hover:bg-[#181916]/60"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${CATEGORIES[s.category]?.dot || "bg-[#8B9A6E]"}`}
                          />
                          <span className="font-bold text-[#1F211C] dark:text-[#F7F2EB]">
                            {s.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge category={s.category} />
                      </td>
                      <td className="px-4 py-3.5 font-mono text-sm font-extrabold tabular-nums text-[#1F211C] dark:text-[#F7F2EB]">
                        {formatCurrency(s.cost)}
                      </td>
                      <td className="px-4 py-3.5 capitalize text-[#70736A] dark:text-[#8D9087]">
                        <span className="inline-flex rounded-md bg-[#F7F2EB] px-2 py-0.5 text-xs font-semibold text-[#4D5047] dark:bg-[#181916] dark:text-[#A6A89F]">
                          {s.cycle}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${
                            soon
                              ? "rounded-md bg-[#8B9A6E]/20 px-2 py-0.5 text-[#4E5C37] ring-1 ring-[#8B9A6E]/40 dark:bg-[#8B9A6E]/30 dark:text-[#D5E0C2]"
                              : "text-[#4D5047] dark:text-[#A6A89F]"
                          }`}
                        >
                          {soon && <span className="h-1.5 w-1.5 rounded-full bg-[#8B9A6E] animate-ping" />}
                          {formatDate(s.nextBilling)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => startInlineEdit(s)}
                            className="rounded-lg p-1.5 text-[#70736A] hover:bg-[#F7F2EB] hover:text-[#1F211C] dark:hover:bg-[#181916] dark:hover:text-[#F7F2EB] text-[11px] font-bold"
                            title="Quick inline edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onEdit(s)}
                            className="rounded-lg p-1.5 text-[#70736A] hover:bg-[#8B9A6E]/20 hover:text-[#4E5C37] dark:hover:bg-[#181916] dark:hover:text-[#D5E0C2]"
                            title="Open full edit window"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(s.id)}
                            className="rounded-lg p-1.5 text-[#70736A] hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F211C]/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[#DCD5C9] bg-[#EAE2D6] p-6 shadow-xl dark:border-[#2E2D27] dark:bg-[#24231F] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/50">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#1F211C] dark:text-[#F7F2EB]">
                Remove this bill?
              </h3>
            </div>
            <p className="mt-3 text-xs text-[#4D5047] dark:text-[#A6A89F] leading-relaxed">
              Are you sure you want to delete this subscription from your active list?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl px-3.5 py-2 text-xs font-semibold text-[#1F211C] hover:bg-[#DCD5C9] dark:text-[#F7F2EB] dark:hover:bg-[#2E2D27]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-rose-700"
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
