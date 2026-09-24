import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  X,
  Minus,
  Maximize2,
  Copy,
  Check,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { formatCurrency, monthlyEquivalent, round2 } from "../utils/format.js";
import { daysUntil, formatDate } from "../utils/date.js";

const INITIAL_MESSAGES = [
  {
    id: "welcome",
    role: "assistant",
    timestamp: new Date(),
    content: `🌿 **Hello! I'm your SubZero AI Advisor.**

I'm linked directly to your active bills and salary budget. Ask me how to trim recurring expenses, query upcoming renewals, or check if your spending matches your income!`,
  },
];

const PROMPT_CHIPS = [
  "Is my spending healthy for my salary?",
  "What bills are due this week?",
  "Where can I save ₹2,000?",
  "Summarize OTT expenses",
  "Detect duplicate subscriptions",
];

export default function FloatingAiChatbot({
  subs = [],
  totalMonthly = 0,
  totalAnnual = 0,
  upcoming = [],
  salary = 60000,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized, messages, isTyping]);

  // AI response engine grounded in live subscription and salary data
  const generateAiResponse = (query) => {
    const q = query.toLowerCase();

    if (subs.length === 0) {
      return `⚠️ **You currently have no active subscriptions added.**\n\nClick **"+ Add Subscription"** to record your bills, and I'll analyze them for instant savings!`;
    }

    // 1. Salary & Income health check query
    if (q.includes("salary") || q.includes("income") || q.includes("healthy") || q.includes("ratio") || q.includes("percent")) {
      const currentSalary = Number(salary || 60000);
      const ratio = currentSalary > 0 ? Math.round((totalMonthly / currentSalary) * 100 * 10) / 10 : 0;
      const remaining = Math.max(0, currentSalary - totalMonthly);

      let res = `📊 **Income-to-Subscription Health Audit:**\n\n`;
      res += `* **Monthly Take-Home Salary:** **${formatCurrency(currentSalary)}**\n`;
      res += `* **Committed Subscriptions:** **${formatCurrency(totalMonthly)}/mo** (${ratio}% of salary)\n`;
      res += `* **Remaining Disposable Income:** **${formatCurrency(remaining)}/mo**\n\n`;

      if (ratio <= 8) {
        res += `🌿 **Status: Exceptional!** Your recurring bills account for only **${ratio}%** of your income (well under the 10% healthy benchmark). You have great financial breathing room.\n\n`;
      } else if (ratio <= 15) {
        res += `⚖️ **Status: Healthy & Moderate.** At **${ratio}%**, your subscription load is balanced. Ensure you actively use all services.\n\n`;
      } else {
        res += `🚨 **Status: High Subscription Load.** Spending **${ratio}%** of monthly income on recurring services is on the higher side. Consider trimming non-essential subscriptions.\n\n`;
      }

      res += `💡 **Recommended Healthy Limits based on your salary:**\n`;
      res += `* Housing/Rent: ~${formatCurrency(Math.round(currentSalary * 0.30))}/mo (30%)\n`;
      res += `* Utilities: ~${formatCurrency(Math.round(currentSalary * 0.05))}/mo (5%)\n`;
      res += `* Entertainment & OTT: ~${formatCurrency(Math.round(currentSalary * 0.03))}/mo (3%)\n`;
      res += `* Fitness/Health: ~${formatCurrency(Math.round(currentSalary * 0.04))}/mo (4%)`;

      return res;
    }

    // 2. Where can I save ₹2,000? or general savings
    if (q.includes("save") || q.includes("cut") || q.includes("reduce") || q.includes("2000") || q.includes("2,000")) {
      const sortedSubs = [...subs].sort((a, b) => monthlyEquivalent(b) - monthlyEquivalent(a));
      const discretionary = sortedSubs.filter((s) => s.category === "Entertainment" || s.category === "Fitness");
      const discretionaryTotal = discretionary.reduce((sum, s) => sum + monthlyEquivalent(s), 0);

      let res = `💡 **How to save ₹2,000+ per month:**\n\n`;
      res += `Your current recurring run-rate is **${formatCurrency(totalMonthly)}/month** across ${subs.length} active service(s).\n\n`;

      if (discretionary.length > 0) {
        res += `### 🎬 Discretionary & Lifestyle Bills (${formatCurrency(discretionaryTotal)}/mo):\n`;
        discretionary.forEach((s) => {
          res += `* **${s.name}** (${s.category}): **${formatCurrency(s.cost)}**/${s.cycle === "monthly" ? "mo" : "yr"}\n`;
        });
        res += `\n**Savings Opportunity:** Canceling or sharing just 1–2 of these discretionary services will save you **₹1,500 – ₹2,500/mo** immediately.\n\n`;
      }

      const monthlyPlans = subs.filter((s) => s.cycle === "monthly");
      if (monthlyPlans.length > 0) {
        const annualSavings = round2(
          monthlyPlans.reduce((sum, s) => sum + s.cost * 12 * 0.18, 0) / 12
        );
        res += `### 🔄 Switch Monthly to Annual:\n`;
        res += `Switching ${monthlyPlans.length} monthly bill(s) to annual billing saves ~18% (${formatCurrency(annualSavings)}/mo amortized).`;
      }

      return res;
    }

    // 3. Renewals this week / upcoming
    if (q.includes("week") || q.includes("renew") || q.includes("upcoming") || q.includes("due")) {
      const thisWeek = subs.filter((s) => {
        const d = daysUntil(s.nextBilling);
        return d >= 0 && d <= 7;
      });

      if (thisWeek.length === 0) {
        const nextSub = [...subs].sort((a, b) => daysUntil(a.nextBilling) - daysUntil(b.nextBilling))[0];
        return `✅ **No renewals due this week!**\n\nYour closest upcoming renewal is **${nextSub?.name}** (${formatCurrency(nextSub?.cost)}) in ${daysUntil(nextSub?.nextBilling)} days on ${formatDate(nextSub?.nextBilling)}.`;
      }

      let res = `📅 **Renewals Due in the Next 7 Days (${thisWeek.length}):**\n\n`;
      let weekTotal = 0;
      thisWeek.forEach((s) => {
        const d = daysUntil(s.nextBilling);
        const timing = d === 0 ? "⚠️ Today" : d === 1 ? "⚠️ Tomorrow" : `in ${d} days (${formatDate(s.nextBilling)})`;
        weekTotal += s.cost;
        res += `* **${s.name}** — **${formatCurrency(s.cost)}** (${s.category}) • ${timing}\n`;
      });
      res += `\n💳 **Total Cashflow Needed This Week:** **${formatCurrency(weekTotal)}**`;
      return res;
    }

    // 4. OTT / Entertainment expenses
    if (q.includes("ott") || q.includes("entertainment") || q.includes("streaming") || q.includes("netflix") || q.includes("spotify")) {
      const ottSubs = subs.filter((s) => s.category === "Entertainment");
      if (ottSubs.length === 0) {
        return `🎬 **No Entertainment / OTT subscriptions detected** in your ledger.`;
      }

      const ottTotal = ottSubs.reduce((sum, s) => sum + monthlyEquivalent(s), 0);
      const pct = totalMonthly > 0 ? Math.round((ottTotal / totalMonthly) * 100) : 0;

      let res = `🎬 **Entertainment & OTT Summary:**\n\n`;
      res += `You have **${ottSubs.length} active entertainment subscription(s)** totaling **${formatCurrency(ottTotal)}/mo** (${pct}% of monthly spend):\n\n`;
      ottSubs.forEach((s) => {
        res += `* **${s.name}**: ${formatCurrency(s.cost)} (${s.cycle})\n`;
      });

      if (ottSubs.length >= 2) {
        res += `\n💡 **Tip:** Rotating streaming services one at a time can save **₹500–₹1,000/mo**.`;
      }
      return res;
    }

    // 5. Duplicate / overlap detection
    if (q.includes("duplicate") || q.includes("overlap") || q.includes("redundant") || q.includes("waste")) {
      const catMap = {};
      subs.forEach((s) => {
        catMap[s.category] = catMap[s.category] || [];
        catMap[s.category].push(s);
      });

      const overlaps = Object.entries(catMap).filter(([_, list]) => list.length > 1);

      if (overlaps.length === 0) {
        return `✅ **No overlapping categories found!** Your subscriptions are well-distributed across individual needs.`;
      }

      let res = `🔍 **Overlap & Redundancy Audit:**\n\n`;
      overlaps.forEach(([cat, list]) => {
        const catSum = list.reduce((sum, s) => sum + monthlyEquivalent(s), 0);
        res += `### 📂 ${cat} (${list.length} services — ${formatCurrency(catSum)}/mo)\n`;
        list.forEach((s) => {
          res += `* **${s.name}** — ${formatCurrency(s.cost)} (${s.cycle})\n`;
        });
        res += `\n`;
      });
      res += `💡 *Consider consolidating overlapping services to avoid paying twice for similar utilities.*`;
      return res;
    }

    // Default response
    return `🤖 **SubZero Analysis for "${query}":**\n\n` +
      `You have **${subs.length} active subscription(s)** totaling **${formatCurrency(totalMonthly)}/month** (${formatCurrency(totalAnnual)}/year) out of your **${formatCurrency(salary)}** monthly take-home salary.\n\n` +
      `Try asking:\n` +
      `* *"Is my spending healthy for my salary?"*\n` +
      `* *"What bills are due this week?"*\n` +
      `* *"Where can I save ₹2,000?"*`;
  };

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: String(Date.now()),
      role: "user",
      timestamp: new Date(),
      content: query.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAiResponse(query.trim());
      const botMsg = {
        id: String(Date.now() + 1),
        role: "assistant",
        timestamp: new Date(),
        content: response,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Action Launcher Button (FAB) in Sage Green (#8B9A6E) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-2.5 rounded-full bg-[#8B9A6E] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#8B9A6E]/30 transition-all duration-300 hover:scale-105 hover:bg-[#78875C] hover:shadow-xl active:scale-95"
          aria-label="Open SubZero AI Advisor"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          </div>
          <span className="hidden sm:inline font-bold">AI Advisor</span>
        </button>
      )}

      {/* Slide-out / Pop-up Chat Window */}
      {isOpen && (
        <div
          className={`animate-scale-in flex flex-col overflow-hidden rounded-3xl border border-[#DCD5C9] bg-[#EAE2D6] shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-[#2E2D27] dark:bg-[#24231F] ${
            isMinimized
              ? "h-14 w-80 shadow-lg"
              : "h-[530px] max-h-[85vh] w-[92vw] sm:w-[400px]"
          }`}
        >
          {/* Header Bar */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#DCD5C9] bg-[#E2D9CC]/80 px-4 dark:border-[#2E2D27] dark:bg-[#1E1D19]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8B9A6E] text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-[#1F211C] dark:text-[#F7F2EB]">
                    SubZero AI Advisor
                  </h3>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8B9A6E]" />
                </div>
                <p className="text-[10px] font-medium text-[#70736A] dark:text-[#8D9087]">
                  Salary Context: {formatCurrency(salary)}/mo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-lg p-1.5 text-[#70736A] hover:bg-[#DCD5C9] hover:text-[#1F211C] dark:hover:bg-[#2E2D27] dark:hover:text-[#F7F2EB]"
                title={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-[#70736A] hover:bg-[#DCD5C9] hover:text-[#1F211C] dark:hover:bg-[#2E2D27] dark:hover:text-[#F7F2EB]"
                title="Close chat"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Chat Content Body */}
          {!isMinimized && (
            <>
              {/* Quick Prompt Chips */}
              <div className="flex gap-1.5 overflow-x-auto border-b border-[#DCD5C9] bg-[#F7F2EB] p-2 scrollbar-none dark:border-[#2E2D27] dark:bg-[#181916]">
                {PROMPT_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip)}
                    className="shrink-0 rounded-full border border-[#DCD5C9] bg-[#EAE2D6] px-2.5 py-1 text-[11px] font-semibold text-[#1F211C] shadow-sm transition-all hover:border-[#8B9A6E] hover:bg-white active:scale-95 dark:border-[#2E2D27] dark:bg-[#24231F] dark:text-[#F7F2EB] dark:hover:border-[#8B9A6E]"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs leading-relaxed scrollbar-thin bg-[#F7F2EB] dark:bg-[#181916]">
                {messages.map((m) => {
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2 animate-slide-down ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#8B9A6E]/20 text-[#4E5C37] dark:text-[#D5E0C2]">
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                      )}

                      <div
                        className={`group relative max-w-[85%] rounded-2xl p-3 shadow-sm ${
                          isUser
                            ? "bg-[#8B9A6E] text-white rounded-br-none"
                            : "border border-[#DCD5C9] bg-[#EAE2D6] text-[#1F211C] rounded-bl-none dark:border-[#2E2D27] dark:bg-[#24231F] dark:text-[#F7F2EB]"
                        }`}
                      >
                        <div className="whitespace-pre-wrap space-y-1.5">
                          {m.content.split("\n\n").map((para, pIdx) => {
                            if (para.startsWith("### ")) {
                              return (
                                <p key={pIdx} className="font-bold text-[#1F211C] dark:text-[#F7F2EB] pt-0.5">
                                  {para.replace("### ", "")}
                                </p>
                              );
                            }
                            return <p key={pIdx}>{para}</p>;
                          })}
                        </div>

                        {!isUser && (
                          <div className="mt-2 flex items-center justify-between border-t border-[#DCD5C9]/60 pt-1 text-[10px] text-[#70736A] dark:border-[#2E2D27]/60 dark:text-[#8D9087]">
                            <span>SubZero Intelligence</span>
                            <button
                              onClick={() => handleCopy(m.id, m.content)}
                              className="inline-flex items-center gap-0.5 rounded px-1 text-[#70736A] hover:text-[#1F211C] dark:hover:text-[#F7F2EB]"
                              title="Copy text"
                            >
                              {copiedId === m.id ? (
                                <Check className="h-3 w-3 text-[#8B9A6E]" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#DCD5C9] text-[#1F211C] dark:bg-[#2E2D27] dark:text-[#F7F2EB]">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing animation */}
                {isTyping && (
                  <div className="flex items-center gap-2 animate-fade-in">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#8B9A6E]/20 text-[#4E5C37] dark:text-[#D5E0C2]">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl border border-[#DCD5C9] bg-[#EAE2D6] px-3 py-2 dark:border-[#2E2D27] dark:bg-[#24231F]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8B9A6E] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8B9A6E] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8B9A6E] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <div className="border-t border-[#DCD5C9] p-2.5 bg-[#EAE2D6] dark:border-[#2E2D27] dark:bg-[#24231F]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask about salary ratio, savings, renewals..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isTyping}
                    className="flex-1 rounded-xl border border-[#DCD5C9] bg-[#F7F2EB] px-3 py-2 text-xs text-[#1F211C] outline-none transition-all placeholder:text-[#70736A] focus:border-[#8B9A6E] focus:bg-white focus:ring-2 focus:ring-[#8B9A6E]/20 dark:border-[#2E2D27] dark:bg-[#181916] dark:text-[#F7F2EB] dark:placeholder:text-[#70736A]"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8B9A6E] text-white shadow transition-all hover:bg-[#78875C] disabled:opacity-40"
                    aria-label="Send"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
