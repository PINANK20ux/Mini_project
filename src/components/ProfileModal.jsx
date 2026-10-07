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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="glass-panel glass-specular relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl transition-all animate-scale-in">
        <button
          onClick={onClose}
          className="glass-button-secondary absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Profile Header with Avatar */}
        <div className="flex items-center gap-4 border-b border-white/60 dark:border-white/10 pb-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-xl font-bold text-white shadow-lg shadow-cyan-500/25">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {displayName}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 backdrop-blur-md">
                <Shield className="h-3 w-3" />
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Member since {joinedDate}
            </p>
          </div>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-700 dark:text-rose-300 backdrop-blur-md animate-slide-down">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-700 dark:text-emerald-300 backdrop-blur-md animate-slide-down">
            <Check className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          {/* Email (Read-Only) */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Account Email
            </label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="glass-input w-full cursor-not-allowed rounded-xl py-2.5 pl-9 pr-3 text-sm opacity-60 font-mono"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Your primary login identifier managed via Supabase.
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Display Name / Full Name
            </label>
            <div className="relative mt-1 group">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-500" />
              <input
                type="text"
                placeholder="e.g. Alex Johnson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="glass-input w-full rounded-xl py-2.5 pl-9 pr-3 text-sm"
              />
            </div>
          </div>

          {/* Preferences Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Preferred Currency */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="glass-input mt-1 w-full rounded-xl py-2.5 px-3 text-sm"
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
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Monthly Budget Goal
              </label>
              <div className="relative mt-1 group">
                <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-500" />
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="glass-input w-full rounded-xl py-2.5 pl-9 pr-3 text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Password Change Toggle */}
          <div className="border-t border-white/60 dark:border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{showPasswordSection ? "Cancel Password Change" : "Change Account Password"}</span>
            </button>

            {showPasswordSection && (
              <div className="glass-card mt-3 space-y-3 rounded-2xl p-4 animate-slide-down border border-white/60 dark:border-white/10">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="glass-input mt-1 w-full rounded-xl py-2 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass-input mt-1 w-full rounded-xl py-2 px-3 text-sm"
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
              className="glass-button-secondary px-4 py-2.5 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="glass-button-primary flex items-center gap-2 px-5 py-2.5 text-xs font-semibold disabled:opacity-60"
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
