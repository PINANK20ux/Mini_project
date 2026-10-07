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
    "glass-input mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm";
  const errCls = "mt-1 animate-slide-down text-xs font-medium text-rose-500";

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass-panel glass-specular animate-scale-in w-full max-w-md rounded-3xl p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-600 dark:text-cyan-300 backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {isEditing ? "Edit subscription" : "Add subscription"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing ? "Update your recurring expense" : "Track a new recurring bill or trial"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="glass-button-secondary rounded-xl p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Subscription Name
            </label>
            <input
              type="text"
              className={inputCls}
              placeholder="e.g. Netflix, Spotify, Gym, Cloud"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className={errCls}>{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
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
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
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
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
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
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Next renewal date
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
              className="glass-button-secondary px-4 py-2.5 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glass-button-primary flex items-center gap-2 px-5 py-2.5 text-sm font-bold"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isEditing ? "Save changes" : "Add subscription"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
