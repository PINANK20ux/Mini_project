import React, { useMemo } from "react";
import { Search, ArrowUpDown, Pencil, Trash2, Inbox, X } from "lucide-react";
import Badge from "./Badge.jsx";
import { CATEGORIES, CATEGORY_KEYS } from "../constants/categories.js";
import { daysUntil, formatDate, parseISO } from "../utils/date.js";
import { formatCurrency } from "../utils/format.js";

export default function SubscriptionTable({
  subs,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  onEdit,
  onDelete,
}) {
  const filteredSubs = useMemo(() => {
    let list = subs.filter((s) =>
      s.name.toLowerCase().includes(search.trim().toLowerCase())
    );
    if (categoryFilter !== "All")
      list = list.filter((s) => s.category === categoryFilter);
    list = [...list].sort((a, b) => {
      if (sortBy === "date-asc")
        return parseISO(a.nextBilling) - parseISO(b.nextBilling);
      if (sortBy === "date-desc")
        return parseISO(b.nextBilling) - parseISO(a.nextBilling);
      if (sortBy === "amount-asc") return a.cost - b.cost;
      if (sortBy === "amount-desc") return b.cost - a.cost;
      return 0;
    });
    return list;
  }, [subs, search, categoryFilter, sortBy]);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm transition-all duration-300 hover:border-stone-300 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700">
      {/* Controls Bar */}
      <div className="flex flex-col gap-3 border-b border-stone-200/90 p-4 dark:border-stone-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs group">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-amber-600 dark:group-focus-within:text-amber-400" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/70 py-2 pl-9 pr-8 text-sm text-stone-900 outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-amber-400 dark:focus:bg-stone-800 dark:focus:ring-amber-400/15"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-stone-400 hover:bg-stone-200 hover:text-stone-600 dark:hover:bg-stone-700 dark:hover:text-stone-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 outline-none transition-all duration-200 hover:border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-stone-600"
          >
            <option value="All">All categories</option>
            {CATEGORY_KEYS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="relative group">
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-amber-600 dark:group-focus-within:text-amber-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white py-2 pl-8 pr-3 text-sm text-stone-700 outline-none transition-all duration-200 hover:border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-stone-600"
            >
              <option value="date-asc">Renewal: soonest</option>
              <option value="date-desc">Renewal: latest</option>
              <option value="amount-asc">Amount: low to high</option>
              <option value="amount-desc">Amount: high to low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200/90 bg-stone-50/60 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-400">
              <th className="px-4 py-3.5">Name</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Amount</th>
              <th className="px-4 py-3.5">Cycle</th>
              <th className="px-4 py-3.5">Next renewal</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
            {filteredSubs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                    <div className="animate-float flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-stone-800 dark:text-amber-400">
                      <Inbox className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-stone-700 dark:text-stone-300">
                      No subscriptions match your search.
                    </p>
                    <p className="text-xs text-stone-400 dark:text-stone-500">
                      Try adjusting filters or adding a new subscription.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSubs.map((s) => {
                const d = daysUntil(s.nextBilling);
                const soon = d >= 0 && d <= 7;
                return (
                  <tr
                    key={s.id}
                    className="group transition-colors duration-150 hover:bg-amber-50/40 dark:hover:bg-stone-800/50"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-2.5 w-2.5 rounded-full transition-transform duration-200 group-hover:scale-125 ${
                            CATEGORIES[s.category]?.dot || "bg-stone-400"
                          }`}
                        />
                        <span className="font-semibold text-stone-900 transition-colors group-hover:text-amber-700 dark:text-stone-100 dark:group-hover:text-amber-300">
                          {s.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge category={s.category} />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-sm font-semibold tabular-nums text-stone-800 dark:text-stone-200">
                      {formatCurrency(s.cost)}
                    </td>
                    <td className="px-4 py-3.5 capitalize text-stone-500 dark:text-stone-400">
                      <span className="inline-flex rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                        {s.cycle}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          soon
                            ? "rounded-md bg-amber-50 px-2 py-1 text-amber-800 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30"
                            : "text-stone-600 dark:text-stone-300"
                        }`}
                      >
                        {soon && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                        )}
                        {formatDate(s.nextBilling)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => onEdit(s)}
                          className="rounded-lg p-1.5 text-stone-400 transition-all duration-200 hover:scale-110 hover:bg-amber-50 hover:text-amber-700 active:scale-95 dark:hover:bg-amber-950/40 dark:hover:text-amber-400"
                          aria-label={`Edit ${s.name}`}
                          title="Edit subscription"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(s.id)}
                          className="rounded-lg p-1.5 text-stone-400 transition-all duration-200 hover:scale-110 hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                          aria-label={`Delete ${s.name}`}
                          title="Delete subscription"
                        >
                          <Trash2 className="h-4 w-4" />
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
  );
}


