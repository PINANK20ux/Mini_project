import React from "react";
import { Sun, Moon, Plus, LogIn, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import SubZeroLogo from "./SubZeroLogo.jsx";

export default function Header({
  dark,
  onToggleDark,
  onAdd,
  onOpenAuth,
  onOpenProfile,
}) {
  const { user, signOut } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email || "";

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="group/logo flex items-center gap-3 cursor-pointer select-none">
        <div className="relative flex items-center justify-center transition-all duration-300 group-hover/logo:scale-110 group-hover/logo:-rotate-6 group-hover/logo:drop-shadow-[0_0_14px_rgba(77,162,255,0.45)]">
          <SubZeroLogo className="h-10 w-10 drop-shadow-md transition-all duration-300" />
        </div>
        <div className="transition-transform duration-300 group-hover/logo:translate-x-0.5">
          <h1 className="inline-block text-2xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-amber-500 to-indigo-500 bg-[length:250%_auto] animate-gradient-shift bg-clip-text text-transparent transition-all duration-300 group-hover/logo:scale-105 group-hover/logo:-translate-y-0.5 group-hover/logo:drop-shadow-[0_3px_12px_rgba(77,162,255,0.4)]">
            SubZero
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 transition-colors">
            Subscription &amp; recurring bill tracker
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Auth Button or User Profile Badge */}
        {user ? (
          <div className="flex items-center gap-1 rounded-xl border border-stone-200/80 bg-white p-1 shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <button
              onClick={onOpenProfile}
              className="group flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-medium text-stone-700 transition-all hover:bg-stone-100 hover:text-stone-900 active:scale-95 dark:text-stone-200 dark:hover:bg-stone-800 dark:hover:text-white"
              title="Click to edit profile & account settings"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 transition-transform group-hover:scale-105">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="max-w-[130px] truncate">
                {displayName}
              </span>
              <Settings className="h-3 w-3 text-stone-400 opacity-60 transition-opacity group-hover:opacity-100" />
            </button>
            <button
              onClick={signOut}
              className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="group flex items-center gap-1.5 rounded-xl border border-stone-200/80 bg-white px-3 py-2 text-xs font-semibold text-stone-700 shadow-sm transition-all duration-200 hover:border-amber-400 hover:text-amber-700 hover:shadow active:scale-95 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-amber-500 dark:hover:text-amber-400"
          >
            <LogIn className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 transition-transform duration-200 group-hover:translate-x-0.5" />
            <span>Sign In / Sign Up</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleDark}
          className="group relative rounded-xl border border-stone-200/80 bg-white p-2.5 text-stone-600 shadow-sm transition-all duration-300 hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900 hover:shadow active:scale-95 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-100"
          aria-label="Toggle dark mode"
        >
          <div className="transition-transform duration-500 group-hover:rotate-45">
            {dark ? (
              <Sun className="h-4 w-4 text-amber-400 transition-colors" />
            ) : (
              <Moon className="h-4 w-4 text-stone-600 transition-colors" />
            )}
          </div>
        </button>

        {/* Add Subscription Button */}
        <button
          onClick={onAdd}
          className="group flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-amber-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-md active:translate-y-0 active:scale-95 dark:bg-amber-600 dark:hover:bg-amber-500"
        >
          <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
          <span>Add subscription</span>
        </button>
      </div>
    </div>
  );
}






