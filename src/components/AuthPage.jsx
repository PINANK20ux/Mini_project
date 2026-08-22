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
    ? "relative min-h-screen flex items-center justify-center p-4"
    : "fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-md animate-fade-in overflow-y-auto";

  return (
    <div className={containerClass}>
      {/* Soft ambient background glows for landing page */}
      {isLandingPage && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-35 dark:opacity-20">
          <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-amber-300/30 blur-3xl filter" />
          <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl filter" />
          <div className="absolute -bottom-20 left-1/3 h-96 w-96 rounded-full bg-amber-200/25 blur-3xl filter" />
        </div>
      )}

      <div className="relative w-full max-w-md rounded-3xl border border-stone-200/90 bg-white p-6 shadow-2xl transition-all sm:p-8 dark:border-stone-800 dark:bg-stone-900 animate-scale-in">
        {onClose && !isLandingPage && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl p-2 text-stone-400 transition-all hover:bg-stone-100 hover:text-stone-700 active:scale-95 dark:hover:bg-stone-800 dark:hover:text-stone-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <SubZeroLogo className="h-14 w-14 drop-shadow-lg animate-float" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            {mode === "signin" ? "Sign in to " : "Create your "}
            <span className="bg-gradient-to-r from-sky-400 via-amber-500 to-indigo-500 bg-[length:250%_auto] animate-gradient-shift bg-clip-text text-transparent inline-block hover:scale-105 transition-transform">
              SubZero
            </span>
            {mode === "signup" ? " account" : ""}
          </h2>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            {mode === "signin"
              ? "Sign in to manage and sync your subscriptions"
              : "Start tracking and optimizing your recurring bills in the cloud"}
          </p>
        </div>

        {/* Configuration Notice if Supabase not ready */}
        {!isConfigured && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="font-semibold">Supabase credentials required for cloud:</span>
              <p className="mt-0.5 text-stone-600 dark:text-stone-300">
                Add <code className="font-mono text-[11px] bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="font-mono text-[11px] bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> to your <code className="font-mono text-[11px]">.env</code> file.
              </p>
            </div>
          </div>
        )}

        {/* Mode Toggle Tabs */}
        <div className="mt-6 flex rounded-xl bg-stone-100 p-1 dark:bg-stone-800">
          <button
            type="button"
            onClick={() => handleSwitchMode("signin")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === "signin"
                ? "bg-white text-stone-900 shadow-sm dark:bg-stone-900 dark:text-stone-50"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode("signup")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === "signup"
                ? "bg-white text-stone-900 shadow-sm dark:bg-stone-900 dark:text-stone-50"
                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 animate-slide-down">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 animate-slide-down">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Email Address
            </label>
            <div className="relative mt-1 group">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-amber-600 dark:group-focus-within:text-amber-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/70 py-2.5 pl-9 pr-3 text-sm text-stone-900 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-100 dark:focus:border-amber-400 dark:focus:bg-stone-800 dark:focus:ring-amber-400/15"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Password
            </label>
            <div className="relative mt-1 group">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-amber-600 dark:group-focus-within:text-amber-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-stone-50/70 py-2.5 pl-9 pr-10 text-sm text-stone-900 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-100 dark:focus:border-amber-400 dark:focus:bg-stone-800 dark:focus:ring-amber-400/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-sm font-semibold text-white shadow-md shadow-amber-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-lg active:translate-y-0 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none dark:bg-amber-600 dark:hover:bg-amber-500"
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
        <div className="mt-6 border-t border-stone-200/80 pt-4 text-center dark:border-stone-800">
          {onContinueAsGuest && (
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs font-semibold text-stone-500 transition-colors hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400"
            >
              Continue without signing in (Guest / Local Mode) &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
