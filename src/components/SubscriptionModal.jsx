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
    "mt-1.5 w-full rounded-xl border border-[#DCD5C9] bg-[#F7F2EB] px-3.5 py-2.5 text-sm text-[#1F211C] outline-none transition-all duration-200 focus:border-[#8B9A6E] focus:bg-white focus:ring-4 focus:ring-[#8B9A6E]/15 dark:border-[#2E2D27] dark:bg-[#181916] dark:text-[#F7F2EB] dark:focus:border-[#8B9A6E]";
  const errCls = "mt-1 animate-slide-down text-xs font-medium text-rose-600 dark:text-rose-400";

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#1F211C]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-scale-in w-full max-w-md rounded-3xl border border-[#DCD5C9] bg-[#EAE2D6] p-6 shadow-2xl transition-all dark:border-[#2E2D27] dark:bg-[#24231F]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B9A6E]/20 text-[#4E5C37] dark:text-[#D5E0C2]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[#1F211C] dark:text-[#F7F2EB]">
                {isEditing ? "Edit subscription" : "Add subscription"}
              </h2>
              <p className="text-xs text-[#70736A] dark:text-[#8D9087]">
                {isEditing ? "Update your recurring expense" : "Track a new recurring bill or trial"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[#70736A] transition-all hover:bg-[#DCD5C9] hover:text-[#1F211C] active:scale-90 dark:hover:bg-[#2E2D27] dark:hover:text-[#F7F2EB]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#1F211C] dark:text-[#F7F2EB]">
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
              <label className="text-xs font-bold text-[#1F211C] dark:text-[#F7F2EB]">
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
              <label className="text-xs font-bold text-[#1F211C] dark:text-[#F7F2EB]">
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
              <label className="text-xs font-bold text-[#1F211C] dark:text-[#F7F2EB]">
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
              <label className="text-xs font-bold text-[#1F211C] dark:text-[#F7F2EB]">
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
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4D5047] transition-all hover:bg-[#DCD5C9] active:scale-95 dark:text-[#A6A89F] dark:hover:bg-[#2E2D27]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#8B9A6E] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#78875C] active:scale-95"
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
