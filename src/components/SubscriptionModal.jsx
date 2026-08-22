import React, { useState } from "react";
import { X, Sparkles, CheckCircle2 } from "lucide-react";
import { CATEGORY_KEYS } from "../constants/categories.js";
import { addDays, rollForward } from "../utils/date.js";
import { round2, genId } from "../utils/format.js";

export default function SubscriptionModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      cost: "",
      cycle: "monthly",
      category: "Entertainment",
      nextBilling: addDays(0),
    }
  );
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(initial && initial.id);

  const validate = () => {
    const errs = {};
    if (!form.name || !form.name.trim()) errs.name = "Name is required.";
    const costNum = parseFloat(form.cost);
    if (form.cost === "" || isNaN(costNum) || costNum <= 0)
      errs.cost = "Enter an amount greater than 0.";
    if (!form.nextBilling) errs.nextBilling = "Select a first billing date.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      id: isEditing ? initial.id : genId(),
      name: form.name.trim(),
      cost: round2(parseFloat(form.cost)),
      cycle: form.cycle,
      category: form.category,
      nextBilling: rollForward(form.cycle, form.nextBilling),
    });
  };

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-stone-300 bg-stone-50/70 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition-all duration-200 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-100 dark:focus:border-amber-400 dark:focus:bg-stone-800 dark:focus:ring-amber-400/15";
  const errCls = "mt-1 animate-slide-down text-xs font-medium text-rose-600 dark:text-rose-400";

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-scale-in w-full max-w-md rounded-3xl border border-stone-200/90 bg-white p-6 shadow-2xl transition-all dark:border-stone-800 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50">
                {isEditing ? "Edit subscription" : "Add subscription"}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isEditing ? "Update subscription details" : "Keep track of your recurring expenses"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-stone-400 transition-all duration-200 hover:rotate-90 hover:bg-stone-100 hover:text-stone-700 active:scale-90 dark:hover:bg-stone-800 dark:hover:text-stone-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Subscription Name
            </label>
            <input
              type="text"
              className={inputCls}
              placeholder="e.g. Netflix, Spotify, AWS"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className={errCls}>{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Cost (₹ INR)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={inputCls}
                placeholder="0.00"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
              />
              {errors.cost && <p className={errCls}>{errors.cost}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Billing cycle
              </label>
              <select
                className={inputCls}
                value={form.cycle}
                onChange={(e) => setForm({ ...form, cycle: e.target.value })}
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Category
              </label>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORY_KEYS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Next billing date
              </label>
              <input
                type="date"
                className={inputCls}
                value={form.nextBilling}
                onChange={(e) => setForm({ ...form, nextBilling: e.target.value })}
              />
              {errors.nextBilling && <p className={errCls}>{errors.nextBilling}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-600 transition-all duration-200 hover:bg-stone-100 active:scale-95 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-amber-500 hover:to-orange-600 hover:shadow-lg hover:shadow-amber-500/25 active:translate-y-0 active:scale-95"
            >
              <CheckCircle2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              <span>{isEditing ? "Save changes" : "Add subscription"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


