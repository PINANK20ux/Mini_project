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
      accent: "text-[#4E5C37] bg-[#8B9A6E]/20 dark:bg-[#8B9A6E]/30 dark:text-[#D5E0C2]",
    },
    {
      step: "02",
      title: "Get timely renewal alerts",
      desc: "SubZero gives you a clear heads-up 7 days before any money gets charged to your card.",
      icon: BellRing,
      accent: "text-[#3D5265] bg-[#6E859A]/20 dark:bg-[#6E859A]/30 dark:text-[#C5D9EB]",
    },
    {
      step: "03",
      title: "Save money effortlessly",
      desc: "Spot duplicate services, cancel forgotten free trials in time, and keep more money in your pocket.",
      icon: PiggyBank,
      accent: "text-[#6D5322] bg-[#B89758]/20 dark:bg-[#B89758]/30 dark:text-[#EBD6A7]",
    },
  ];

  const whyReasons = [
    {
      title: "No More Surprise Auto-Debits",
      desc: "Never wake up to an unexpected bank debit for a subscription you forgot existed.",
      icon: ShieldCheck,
    },
    {
      title: "See Where Your Money Goes",
      desc: "Small monthly payments quietly add up. See your exact monthly and annual spending at a glance.",
      icon: TrendingDown,
    },
    {
      title: "Private & Safe by Default",
      desc: "No bank passwords or card numbers needed. Your data is stored safely on your device.",
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="about" className="pt-12 scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8B9A6E]/20 text-[#4E5C37] dark:text-[#D5E0C2]">
            <HelpCircle className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-[#1F211C] dark:text-[#F7F2EB] sm:text-2xl">
            Why SubZero?
          </h2>
        </div>
        <p className="text-xs text-[#70736A] dark:text-[#8D9087]">
          The simple, hassle-free subscription and recurring bill tracker.
        </p>
      </div>

      {/* Main Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#DCD5C9] bg-[#EAE2D6] p-6 shadow-sm dark:border-[#2E2D27] dark:bg-[#24231F] sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#8B9A6E]/20 text-[#4E5C37] dark:text-[#D5E0C2]">
            <SubZeroLogo className="h-10 w-10 drop-shadow animate-float" />
          </div>

          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#DCD5C9] bg-[#F7F2EB] px-3 py-0.5 text-xs font-semibold text-[#4E5C37] dark:border-[#2E2D27] dark:bg-[#181916] dark:text-[#D5E0C2]">
              <Sparkles className="h-3.5 w-3.5 text-[#8B9A6E]" />
              <span>Simple • Automatic • Peace of Mind</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1F211C] dark:text-[#F7F2EB]">
              Take back control of your recurring monthly bills.
            </h3>
            <p className="text-sm text-[#4D5047] dark:text-[#A6A89F] leading-relaxed max-w-2xl">
              Between OTT platforms, gym memberships, phone bills, iCloud storage, and work tools, small recurring subscriptions quietly drain thousands of rupees every month. SubZero keeps everything organized in one place so you never get surprised.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Simple Steps */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-[#4D5047] dark:text-[#A6A89F] uppercase tracking-wider">
          How it works in 3 simple steps
        </h4>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-[#DCD5C9] bg-[#EAE2D6] p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#8B9A6E] dark:border-[#2E2D27] dark:bg-[#24231F]"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xl font-extrabold text-[#70736A]/40 dark:text-[#A6A89F]/40">
                    {item.step}
                  </span>
                </div>

                <h5 className="mt-4 text-sm font-bold text-[#1F211C] dark:text-[#F7F2EB]">
                  {item.title}
                </h5>
                <p className="mt-1.5 text-xs text-[#4D5047] dark:text-[#A6A89F] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-[#4D5047] dark:text-[#A6A89F] uppercase tracking-wider">
          Why you'll love SubZero
        </h4>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {whyReasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#DCD5C9] bg-[#EAE2D6] p-5 shadow-sm dark:border-[#2E2D27] dark:bg-[#24231F]"
              >
                <div className="flex items-center gap-2 text-[#4E5C37] dark:text-[#D5E0C2]">
                  <Icon className="h-4 w-4 shrink-0 text-[#8B9A6E]" />
                  <h5 className="font-bold text-xs text-[#1F211C] dark:text-[#F7F2EB]">
                    {reason.title}
                  </h5>
                </div>
                <p className="mt-2 text-xs text-[#4D5047] dark:text-[#A6A89F] leading-relaxed">
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
