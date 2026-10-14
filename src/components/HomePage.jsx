import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const EXHIBITION_ITEMS = [
  {
    id: "01",
    title: "Renewal Horizon",
    subtitle: "7-Day Pre-Debit Surveillance",
    aspect: "aspect-[16/11]",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80",
    target: "subscriptions",
  },
  {
    id: "02",
    title: "The Equilibrium",
    subtitle: "50/30/20 Income Health",
    aspect: "aspect-[3/4.4]",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=900&q=80",
    target: "analytics",
  },
  {
    id: "03",
    title: "The Archive",
    subtitle: "Centralized Ledger Registry",
    aspect: "aspect-[4/5]",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80",
    target: "subscriptions",
  },
  {
    id: "04",
    title: "Algorithmic Advisor",
    subtitle: "Conversational Financial Intelligence",
    aspect: "aspect-[16/9.5]",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
    target: "analytics",
  },
  {
    id: "05",
    title: "Cashflow Perspective",
    subtitle: "6-Month Projected Outflows",
    aspect: "aspect-[4/3.2]",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
    target: "analytics",
  },
  {
    id: "06",
    title: "The Vault",
    subtitle: "Local-First Cryptographic Privacy",
    aspect: "aspect-[4/4.8]",
    image: "https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb?auto=format&fit=crop&w=900&q=80",
    target: "about",
  },
];

const CAPABILITIES = [
  {
    num: "01",
    title: "Renewal Surveillance",
    desc: "A proactive 7-day alert radar tracking auto-renewals and impending trial expirations before card debits occur.",
    target: "subscriptions",
  },
  {
    num: "02",
    title: "Income Calibration",
    desc: "Dynamic take-home income benchmarking, auditing whether recurring commitments exceed healthy 50/30/20 proportions.",
    target: "analytics",
  },
  {
    num: "03",
    title: "Duplication & Creep Audit",
    desc: "Instant recognition of overlapping streaming platforms, unused cloud tiers, and incremental price hikes.",
    target: "analytics",
  },
  {
    num: "04",
    title: "Local-First Architecture",
    desc: "Zero tracking and zero mandatory signups. Data persists encrypted in your browser with optional Supabase cloud sync.",
    target: "about",
  },
];

export default function HomePage({ onNavigate, onAdd }) {
  return (
    <div className="space-y-16 sm:space-y-24 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* 1. HERO SECTION: ATELIER MERIDIEN EDITORIAL LAYOUT */}
      <section className="space-y-6 pt-4">
        {/* Top Header Row with Pill and Giant Title */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Outline Pill Badge */}
          <div className="self-start">
            <span className="inline-block rounded-md border border-[#2D7495] dark:border-[#E8E085] px-3.5 py-1 text-[11px] font-mono tracking-widest uppercase text-[#2D7495] dark:text-[#E8E085]">
              SubZero Ledger • Edition 2026
            </span>
          </div>

          {/* Giant Title (matching Atelier Meridien typography) */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-slate-900 dark:text-white">
            Sub<span className="text-[#2D7495] dark:text-[#E8E085]">Zero</span> Atelier
          </h1>
        </div>

        {/* Thin Horizontal Divider Line spanning across */}
        <div className="w-full h-px bg-slate-900 dark:bg-white/20" />

        {/* Two-Column Editorial Text Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pt-2 items-start">
          {/* Left Column: Bold Thesis Statement */}
          <div className="md:col-span-5 lg:col-span-4">
            <p className="font-display text-lg sm:text-xl lg:text-2xl font-normal leading-snug text-slate-900 dark:text-white">
              More than an expense tracker — a platform for recurring financial clarity and autonomy.
            </p>
          </div>

          {/* Right Column: Narrative Context & Brand Pill Button */}
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            <p className="text-sm sm:text-base lg:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
              We champion intentional recurring spending, curating clarity out of subscription chaos, auditing commitments that challenge, engage, and shape your long-term wealth perspectives.
            </p>

            {/* Brand Pill Button */}
            <div>
              <button
                onClick={() => onNavigate("subscriptions")}
                className="inline-flex items-center justify-center rounded-lg bg-[#2D7495] hover:bg-[#235b76] text-white dark:bg-[#E8E085] dark:hover:bg-[#dfd675] dark:text-[#183a48] px-7 py-3 text-xs sm:text-sm font-semibold tracking-wide active:scale-95 transition-all shadow-md shadow-[#2D7495]/20 dark:shadow-[#E8E085]/15"
              >
                Explore Ledger
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HORIZONTAL EXHIBITION GALLERY STRIP (6 VARYING PROPORTIONS) */}
      <section className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-end">
          {EXHIBITION_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.target)}
              className="group cursor-pointer flex flex-col space-y-2"
            >
              {/* Image Container with varying aspect ratio */}
              <div
                className={`relative w-full overflow-hidden rounded-sm bg-slate-200 dark:bg-slate-800 ${item.aspect} shadow-sm border border-slate-200/60 dark:border-white/10`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />

                {/* Subtle corner badge */}
                <span className="absolute top-2 left-2 text-[10px] font-mono font-medium text-white/90 drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.id}
                </span>
              </div>

              {/* Minimalist Editorial Caption */}
              <div className="pt-1">
                <p className="font-display text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CAPABILITIES INDEX: EDITORIAL ROSTER (MATCHING CONTEMPORARY GALLERY AESTHETIC) */}
      <section className="space-y-8 pt-8">
        <div className="w-full h-px bg-slate-200 dark:bg-white/10" />

        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
          <h2 className="font-display text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Selected Capabilities & Focus
          </h2>
          <p className="text-xs font-mono text-slate-400">
            System Index / 04 Core Pillars
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.num}
              onClick={() => onNavigate(cap.target)}
              className="group cursor-pointer space-y-3 pt-3 border-t border-slate-200 dark:border-white/10 hover:border-slate-900 dark:hover:border-white transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <span>{cap.num}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {cap.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {cap.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EDITORIAL PHILOSOPHY MANIFESTO */}
      <section className="py-12 border-y border-slate-900 dark:border-white/20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal leading-snug tracking-tight text-slate-900 dark:text-white">
            “Recurring expenses should never be passive. SubZero brings gallery-level clarity and architectural intentionality to your recurring footprint.”
          </blockquote>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
            The SubZero Manifesto — Zero Involuntary Burn
          </p>
        </div>
      </section>

      {/* 5. MINIMALIST PAGE PORTAL LAUNCHERS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 pb-8">
        <div
          onClick={() => onNavigate("subscriptions")}
          className="group cursor-pointer p-6 border border-slate-200 dark:border-white/10 rounded-sm hover:border-slate-900 dark:hover:border-white transition-colors flex flex-col justify-between space-y-8"
        >
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Workspace 01
            </span>
            <h4 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              My Bills Ledger
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Active commitments registry, renewal countdowns, inline rate adjustments, and CSV exports.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono tracking-wide text-slate-900 dark:text-white group-hover:translate-x-1 transition-transform">
            <span>Enter Ledger</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("analytics")}
          className="group cursor-pointer p-6 border border-slate-200 dark:border-white/10 rounded-sm hover:border-slate-900 dark:hover:border-white transition-colors flex flex-col justify-between space-y-8"
        >
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Workspace 02
            </span>
            <h4 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Smart Budget
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Take-home salary health ratios, 50/30/20 category distributions, and 6-month outflow forecasts.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono tracking-wide text-slate-900 dark:text-white group-hover:translate-x-1 transition-transform">
            <span>Enter Smart Budget</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        <div
          onClick={() => onNavigate("about")}
          className="group cursor-pointer p-6 border border-slate-200 dark:border-white/10 rounded-sm hover:border-slate-900 dark:hover:border-white transition-colors flex flex-col justify-between space-y-8"
        >
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Workspace 03
            </span>
            <h4 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              How It Works
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              A 3-step practical handbook for auditing recurring software, streaming apps, and trials.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono tracking-wide text-slate-900 dark:text-white group-hover:translate-x-1 transition-transform">
            <span>Enter Handbook</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </section>
    </div>
  );
}
