import React, { useState } from "react";
import {
  Sun,
  Moon,
  Plus,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  LayoutDashboard,
  TrendingUp,
  Receipt,
  HelpCircle,
} from "lucide-react";
import SubZeroLogo from "./SubZeroLogo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_LINKS = [
  { id: "home", label: "Home", href: "#home", icon: LayoutDashboard },
  { id: "analytics", label: "Smart Budget", href: "#analytics", icon: TrendingUp },
  { id: "subscriptions", label: "My Bills", href: "#subscriptions", icon: Receipt },
  { id: "about", label: "How It Works", href: "#about", icon: HelpCircle },
];

export default function Navbar({
  dark,
  onToggleDark,
  onAdd,
  onOpenAuth,
  onOpenProfile,
  syncing = false,
  isCloudConnected = false,
  activeSection = "home",
}) {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const topOffset = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
      window.history.pushState(null, null, href);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/60 dark:border-white/10 bg-white/65 dark:bg-[#070A12]/60 backdrop-blur-2xl transition-colors duration-300 shadow-glass-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => handleScrollTo(e, "#home")}
          className="group flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <SubZeroLogo className="h-8 w-8 drop-shadow-sm" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Sub<span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">Zero</span>
          </span>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.05] p-1 shadow-glass-sm backdrop-blur-xl">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10"
                }`}
              >
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Controls & + Add Subscription Button */}
        <div className="flex items-center gap-2">
          {/* User Account / Sign In */}
          {user ? (
            <div className="flex items-center gap-1 rounded-xl border border-white/60 dark:border-white/10 bg-white/50 dark:bg-white/[0.05] p-1 shadow-sm backdrop-blur-md">
              <button
                onClick={onOpenProfile}
                className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 transition-all hover:bg-white/80 dark:text-slate-200 dark:hover:bg-white/10"
                title="Account settings"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/20 text-cyan-600 dark:text-cyan-300">
                  <User className="h-3 w-3" />
                </div>
                <span className="hidden sm:inline max-w-[110px] truncate">
                  {displayName}
                </span>
              </button>
              <button
                onClick={signOut}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 transition-colors"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="glass-button-secondary hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold"
            >
              <LogIn className="h-3.5 w-3.5 text-cyan-500" />
              <span>Log In</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleDark}
            className="glass-button-secondary p-2 rounded-xl text-slate-700 dark:text-slate-200"
            aria-label="Toggle dark mode"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? (
              <Sun className="h-4 w-4 text-amber-300 animate-pulse-glow" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>

          {/* + Add Subscription Button */}
          <button
            onClick={onAdd}
            className="glass-button-primary group flex items-center gap-1.5 px-4 py-2 text-xs"
          >
            <Plus className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-90" />
            <span>+ Add Bill</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="glass-button-secondary flex h-9 w-9 items-center justify-center md:hidden"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/60 dark:border-white/10 bg-white/80 dark:bg-[#070A12]/80 backdrop-blur-2xl p-4 md:hidden animate-slide-down shadow-xl">
          <nav className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25"
                      : "text-slate-700 hover:bg-white/60 dark:text-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </a>
              );
            })}
            {!user && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="glass-button-secondary mt-2 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold"
              >
                <LogIn className="h-3.5 w-3.5 text-cyan-500" />
                <span>Log In / Create Account</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
