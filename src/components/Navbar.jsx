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
    <header className="sticky top-0 z-40 w-full border-b border-[#DCD5C9] bg-[#F7F2EB]/95 backdrop-blur-md transition-colors duration-300 dark:border-[#2E2D27] dark:bg-[#181916]/95">
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
          <span className="text-xl font-extrabold tracking-tight text-[#1F211C] dark:text-[#F7F2EB]">
            Sub<span className="text-[#8B9A6E]">Zero</span>
          </span>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-[#DCD5C9] bg-[#EAE2D6]/80 p-1 shadow-sm backdrop-blur-md dark:border-[#2E2D27] dark:bg-[#24231F]/80">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#8B9A6E] text-white shadow-sm"
                    : "text-[#4D5047] hover:text-[#1F211C] hover:bg-[#F7F2EB]/80 dark:text-[#A6A89F] dark:hover:text-white dark:hover:bg-[#181916]/80"
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
            <div className="flex items-center gap-1 rounded-xl border border-[#DCD5C9] bg-[#EAE2D6]/80 p-1 shadow-sm dark:border-[#2E2D27] dark:bg-[#24231F]">
              <button
                onClick={onOpenProfile}
                className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1F211C] transition-all hover:bg-[#F7F2EB] dark:text-[#F7F2EB] dark:hover:bg-[#181916]"
                title="Account settings"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#8B9A6E]/20 text-[#4E5C37] dark:text-[#D5E0C2]">
                  <User className="h-3 w-3" />
                </div>
                <span className="hidden sm:inline max-w-[110px] truncate">
                  {displayName}
                </span>
              </button>
              <button
                onClick={signOut}
                className="rounded-lg p-1.5 text-[#70736A] hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#DCD5C9] bg-[#EAE2D6] px-3.5 py-1.5 text-xs font-semibold text-[#1F211C] shadow-sm transition-all hover:border-[#8B9A6E] hover:text-[#4E5C37] dark:border-[#2E2D27] dark:bg-[#24231F] dark:text-[#F7F2EB]"
            >
              <LogIn className="h-3.5 w-3.5 text-[#8B9A6E]" />
              <span>Log In</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleDark}
            className="rounded-xl border border-[#DCD5C9] bg-[#EAE2D6] p-2 text-[#1F211C] shadow-sm transition-all hover:bg-[#F7F2EB] dark:border-[#2E2D27] dark:bg-[#24231F] dark:text-[#F7F2EB]"
            aria-label="Toggle dark mode"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? (
              <Sun className="h-4 w-4 text-amber-300" />
            ) : (
              <Moon className="h-4 w-4 text-[#4D5047]" />
            )}
          </button>

          {/* + Add Subscription Button */}
          <button
            onClick={onAdd}
            className="group flex items-center gap-1.5 rounded-xl bg-[#8B9A6E] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#78875C] hover:shadow active:scale-95"
          >
            <Plus className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-90" />
            <span>+ Add Bill</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCD5C9] bg-[#EAE2D6] text-[#1F211C] shadow-sm dark:border-[#2E2D27] dark:bg-[#24231F] dark:text-[#F7F2EB] md:hidden"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#DCD5C9] bg-[#F7F2EB] p-4 dark:border-[#2E2D27] dark:bg-[#181916] md:hidden animate-slide-down">
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
                      ? "bg-[#8B9A6E] text-white"
                      : "text-[#1F211C] hover:bg-[#EAE2D6] dark:text-[#F7F2EB] dark:hover:bg-[#24231F]"
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
                className="mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-[#DCD5C9] bg-[#EAE2D6] py-2 text-xs font-semibold text-[#1F211C] shadow-sm dark:border-[#2E2D27] dark:bg-[#24231F] dark:text-[#F7F2EB]"
              >
                <LogIn className="h-3.5 w-3.5 text-[#8B9A6E]" />
                <span>Log In / Create Account</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
