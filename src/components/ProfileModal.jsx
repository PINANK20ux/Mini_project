import React, { useState } from "react";
import { X, User, Mail, DollarSign, Lock, Check, AlertCircle, Sparkles, Shield, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfileModal({ onClose }) {
  const { user, updateProfile, updatePassword } = useAuth();

  const metadata = user?.user_metadata || {};
  const [fullName, setFullName] = useState(metadata.full_name || "");
  const [budget, setBudget] = useState(metadata.monthly_budget || "");
  const [currency, setCurrency] = useState(metadata.currency_preference || "INR");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // 1. Update Profile Metadata
      await updateProfile({
        fullName: fullName.trim(),
        budget: budget ? parseFloat(budget) : null,
        currency,
      });

      // 2. Update Password if provided
      if (showPasswordSection && newPassword) {
        if (newPassword.length < 6) {
          throw new Error("New password must be at least 6 characters long.");
        }
        if (newPassword !== confirmPassword) {
          throw new Error("New passwords do not match.");
        }
        await updatePassword(newPassword);
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordSection(false);
      }

      setSuccess("Profile settings updated successfully!");
      setTimeout(() => {
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Compute initials for the avatar
  const displayName = fullName || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-stone-200/90 bg-white p-6 shadow-2xl transition-all sm:p-8 dark:border-stone-800 dark:bg-stone-900 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-stone-400 transition-all hover:bg-stone-100 hover:text-stone-700 active:scale-95 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Profile Header with Avatar */}
        <div className="flex items-center gap-4 border-b border-stone-200/80 pb-5 dark:border-stone-800">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-xl font-bold text-white shadow-md shadow-amber-600/20">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                {displayName}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30">
                <Shield className="h-3 w-3" />
                Verified
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Member since {joinedDate}
            </p>
          </div>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 animate-slide-down">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 animate-slide-down">
            <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          {/* Email (Read-Only) */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Account Email
            </label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full cursor-not-allowed rounded-xl border border-stone-200 bg-stone-100/70 py-2.5 pl-9 pr-3 text-sm text-stone-500 dark:border-stone-800 dark:bg-stone-800/40 dark:text-stone-400 font-mono"
              />
            </div>
            <p className="mt-1 text-[11px] text-stone-400">
              Your primary login identifier managed via Supabase.
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Display Name / Full Name
            </label>
            <div className="relative mt-1 group">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-amber-600 dark:group-focus-within:text-amber-400" />
              <input
                type="text"
                placeholder="e.g. Alex Johnson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/70 py-2.5 pl-9 pr-3 text-sm text-stone-900 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-100 dark:focus:border-amber-400 dark:focus:bg-stone-800 dark:focus:ring-amber-400/15"
              />
            </div>
          </div>

          {/* Preferences Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Preferred Currency */}
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50/70 py-2.5 px-3 text-sm text-stone-900 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-100 dark:focus:border-amber-400 dark:focus:bg-stone-800 dark:focus:ring-amber-400/15"
              >
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="GBP">£ GBP (British Pound)</option>
                <option value="CAD">$ CAD (Canadian Dollar)</option>
                <option value="AUD">$ AUD (Australian Dollar)</option>
              </select>
            </div>

            {/* Monthly Budget Target */}
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Monthly Budget Goal
              </label>
              <div className="relative mt-1 group">
                <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-amber-600 dark:group-focus-within:text-amber-400" />
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-stone-50/70 py-2.5 pl-9 pr-3 text-sm text-stone-900 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-100 dark:focus:border-amber-400 dark:focus:bg-stone-800 dark:focus:ring-amber-400/15 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Password Change Toggle */}
          <div className="border-t border-stone-200/80 pt-4 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="flex items-center gap-2 text-xs font-semibold text-stone-600 transition-colors hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{showPasswordSection ? "Cancel Password Change" : "Change Account Password"}</span>
            </button>

            {showPasswordSection && (
              <div className="mt-3 space-y-3 rounded-2xl bg-stone-50 p-4 dark:bg-stone-850 animate-slide-down">
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white py-2 px-3 text-sm text-stone-900 outline-none transition-all focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-white py-2 px-3 text-sm text-stone-900 outline-none transition-all focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-semibold text-stone-600 transition-all hover:bg-stone-100 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-amber-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-lg active:translate-y-0 active:scale-95 disabled:opacity-60 dark:bg-amber-600 dark:hover:bg-amber-500"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
