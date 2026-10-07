import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import SubZeroLogo from "./SubZeroLogo.jsx";

export default function AuthPage({ onClose, onContinueAsGuest, isLandingPage = false }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const { signIn, signUp, isConfigured } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      if (mode === "signin") {
        await signIn({ email: email.trim(), password });
        if (onClose) onClose();
      } else {
        const data = await signUp({ email: email.trim(), password });
        if (data?.session) {
          if (onClose) onClose();
        } else {
          setSuccessMsg("Account created! You can now sign in.");
          setMode("signin");
        }
      }
    } catch (err) {
      setError(err.message || "An authentication error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setError(null);
    setSuccessMsg(null);
  };

  const containerClass = isLandingPage
    ? "relative min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#070A12] overflow-hidden"
    : "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-md animate-fade-in overflow-y-auto";

  return (
    <div className={containerClass}>
      {/* Ambient glass glows for landing page */}
      {isLandingPage && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute -top-32 -left-20 h-[500px] w-[500px] rounded-full bg-cyan-400/25 dark:bg-cyan-500/15 blur-[120px] filter animate-orb-1" />
          <div className="absolute top-1/3 -right-28 h-[520px] w-[520px] rounded-full bg-purple-500/20 dark:bg-purple-600/15 blur-[120px] filter animate-orb-2" />
          <div className="absolute -bottom-20 left-1/3 h-[450px] w-[450px] rounded-full bg-blue-500/20 dark:bg-blue-600/15 blur-[120px] filter animate-orb-3" />
        </div>
      )}

      <div className="glass-panel glass-specular relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl transition-all animate-scale-in z-10">
        {onClose && !isLandingPage && (
          <button
            onClick={onClose}
            className="glass-button-secondary absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 flex items-center justify-center transition-transform duration-300 hover:scale-105">
            <SubZeroLogo className="h-14 w-14 drop-shadow animate-float" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {mode === "signin" ? "Sign in to " : "Create your "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent inline-block">
              SubZero
            </span>
            {mode === "signup" ? " account" : ""}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {mode === "signin"
              ? "Sign in to manage and sync your subscriptions"
              : "Start tracking and optimizing your recurring bills in the cloud"}
          </p>
        </div>

        {/* Configuration Notice if Supabase not ready */}
        {!isConfigured && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 backdrop-blur-md">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div>
              <span className="font-semibold">Supabase credentials required for cloud:</span>
              <p className="mt-0.5 text-slate-600 dark:text-slate-300">
                Add <code className="font-mono text-[11px] bg-amber-500/15 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="font-mono text-[11px] bg-amber-500/15 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> to your <code className="font-mono text-[11px]">.env</code> file.
              </p>
            </div>
          </div>
        )}

        {/* Mode Toggle Tabs */}
        <div className="mt-6 flex rounded-xl border border-white/60 dark:border-white/10 bg-white/40 dark:bg-white/[0.04] p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => handleSwitchMode("signin")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === "signin"
                ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode("signup")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === "signup"
                ? "bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-700 dark:text-rose-300 backdrop-blur-md animate-slide-down">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-700 dark:text-emerald-300 backdrop-blur-md animate-slide-down">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Email Address
            </label>
            <div className="relative mt-1 group">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full rounded-xl py-2.5 pl-9 pr-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Password
            </label>
            <div className="relative mt-1 group">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full rounded-xl py-2.5 pl-9 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-button-primary group flex w-full items-center justify-center gap-2 py-3 text-sm disabled:opacity-60 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                <span>{mode === "signin" ? "Signing in..." : "Creating account..."}</span>
              </span>
            ) : (
              <>
                <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer / Guest Option */}
        <div className="mt-6 border-t border-white/60 dark:border-white/10 pt-4 text-center">
          {onContinueAsGuest && (
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs font-semibold text-slate-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
            >
              Continue without signing in (Guest / Local Mode) &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
