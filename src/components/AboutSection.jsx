import React from "react";
import {
  PlusCircle,
  BellRing,
  PiggyBank,
  ShieldCheck,
  TrendingDown,
  HeartHandshake,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import SubZeroLogo from "./SubZeroLogo.jsx";

export default function AboutSection({ onAddSub }) {
  const steps = [
    {
      step: "01",
      title: "Add your bills & trials",
      desc: "Takes 10 seconds. Enter your streaming, gym, internet, or software subs with their renewal date.",
      icon: PlusCircle,
      accent: "text-cyan-600 bg-cyan-500/15 border border-cyan-500/25 dark:text-cyan-300",
    },
    {
      step: "02",
      title: "Get timely renewal alerts",
      desc: "SubZero gives you a clear heads-up 7 days before any money gets charged to your card.",
      icon: BellRing,
      accent: "text-indigo-600 bg-indigo-500/15 border border-indigo-500/25 dark:text-indigo-300",
    },
    {
      step: "03",
      title: "Save money effortlessly",
      desc: "Spot duplicate services, cancel forgotten free trials in time, and keep more money in your pocket.",
      icon: PiggyBank,
      accent: "text-amber-600 bg-amber-500/15 border border-amber-500/25 dark:text-amber-300",
    },
  ];

  const whyReasons = [
    {
      title: "No More Surprise Auto-Debits",
      desc: "Never wake up to an unexpected bank debit for a subscription you forgot existed.",
      icon: ShieldCheck,
      color: "text-cyan-500",
    },
    {
      title: "See Where Your Money Goes",
      desc: "Small monthly payments quietly add up. See your exact monthly and annual spending at a glance.",
      icon: TrendingDown,
      color: "text-indigo-500",
    },
    {
      title: "Private & Safe by Default",
      desc: "No bank passwords or card numbers needed. Your data is stored safely on your device.",
      icon: HeartHandshake,
      color: "text-emerald-500",
    },
  ];

  return (
    <section id="about" className="pt-12 scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25 backdrop-blur-md">
            <HelpCircle className="h-4 w-4" />
          </div>
          <h2 className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Why SubZero?
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The simple, crystalline subscription ledger and recurring bill tracker.
        </p>
      </div>

      {/* Main Welcome Card */}
      <div className="glass-panel glass-specular p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-500 shadow-glass-sm backdrop-blur-md">
            <SubZeroLogo className="h-11 w-11 drop-shadow animate-float" />
          </div>

          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/60 dark:border-white/10 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
              <span>Simple • Transparent • Peace of Mind</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Take back control of your recurring monthly bills.
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Between OTT platforms, gym memberships, phone bills, iCloud storage, and work tools, small recurring subscriptions quietly drain thousands of rupees every month. SubZero keeps everything crystal clear in one unified glass ledger.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Simple Steps */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          How it works in 3 simple steps
        </h4>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group glass-card-interactive glass-specular p-5 rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl backdrop-blur-md ${item.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xl font-extrabold text-slate-400/40 dark:text-slate-600/40">
                    {item.step}
                  </span>
                </div>

                <h5 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h5>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Why you'll love SubZero
        </h4>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {whyReasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div
                key={idx}
                className="glass-card-interactive glass-specular p-5 rounded-2xl"
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 shrink-0 ${reason.color}`} />
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                    {reason.title}
                  </h5>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {reason.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
