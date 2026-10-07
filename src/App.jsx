import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import UpcomingBanner from "./components/UpcomingBanner.jsx";
import KpiCards from "./components/KpiCards.jsx";
import AnalyticsSection from "./components/AnalyticsSection.jsx";
import SubscriptionsSection from "./components/SubscriptionsSection.jsx";
import AboutSection from "./components/AboutSection.jsx";
import FloatingAiChatbot from "./components/FloatingAiChatbot.jsx";
import SubscriptionModal from "./components/SubscriptionModal.jsx";
import AuthPage from "./components/AuthPage.jsx";
import ProfileModal from "./components/ProfileModal.jsx";
import SubZeroLogo from "./components/SubZeroLogo.jsx";
import { useSubscriptions } from "./hooks/useSubscriptions.js";
import { useAuth } from "./context/AuthContext.jsx";
import {
  Calendar,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "./utils/format.js";
import { formatDate, daysUntil } from "./utils/date.js";
import Badge from "./components/Badge.jsx";

const THEME_KEY = "ledger_theme_v1";
const SALARY_KEY = "subzero_user_salary_v1";

export default function App() {
  const {
    subs,
    loaded,
    syncing,
    isCloudConnected,
    totalMonthly,
    totalAnnual,
    activeCount,
    categoryData,
    projectionData,
    upcoming,
    addOrUpdate,
    remove,
  } = useSubscriptions();

  const { user, loading: authLoading } = useAuth();

  // Theme state
  const [dark, setDark] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Active section for scroll spy
  const [activeSection, setActiveSection] = useState("home");

  // Salary state
  const [salary, setSalary] = useState(() => {
    try {
      const raw = localStorage.getItem(SALARY_KEY);
      return raw ? Number(raw) : 60000;
    } catch (e) {
      return 60000;
    }
  });

  const handleUpdateSalary = (newSalary) => {
    setSalary(newSalary);
    try {
      localStorage.setItem(SALARY_KEY, String(newSalary));
    } catch (e) {}
  };

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  // Scroll spy to highlight active section in sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "analytics", "subscriptions", "about"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme preference loading & persistence
  useEffect(() => {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw) {
      setDark(raw === "dark");
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDark(true);
    }
    setThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (!themeLoaded) return;
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark, themeLoaded]);

  // Reset guest mode on login
  useEffect(() => {
    if (user) {
      setGuestMode(false);
      setAuthModalOpen(false);
    }
  }, [user]);

  const openAdd = () => {
    setEditingSub(null);
    setModalOpen(true);
  };

  const openEdit = (sub) => {
    setEditingSub({ ...sub, cost: String(sub.cost) });
    setModalOpen(true);
  };

  const handleSave = (payload) => {
    addOrUpdate(payload);
    setModalOpen(false);
  };

  const handleSaveInline = (payload) => {
    addOrUpdate(payload);
  };

  const handleDelete = (id) => {
    remove(id);
  };

  // Top single expense highlight
  const topExpense = subs.length > 0
    ? [...subs].sort((a, b) => b.cost - a.cost)[0]
    : null;

  // 1. Initial Authentication Check Loading State
  if (authLoading || !loaded) {
    return (
      <div className={dark ? "dark" : ""}>
        <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-[#070A12] relative overflow-hidden">
          <div className="absolute h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl animate-pulse-glow" />
          <div className="glass-panel glass-specular flex flex-col items-center gap-4 rounded-3xl p-8 z-10">
            <SubZeroLogo className="h-14 w-14 animate-float" />
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></span>
              <span>Opening SubZero Glass Ledger...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Landing / Auth gate if unauthenticated and not in guest mode
  if (!user && !guestMode) {
    return (
      <div className={dark ? "dark" : ""}>
        <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-[#070A12] dark:text-slate-100">
          <AuthPage
            isLandingPage={true}
            onContinueAsGuest={() => setGuestMode(true)}
          />
        </div>
      </div>
    );
  }

  // 3. Continuous Single-Page Scrolling Layout in Sleek Glass Theme
  return (
    <div className={dark ? "dark" : ""}>
      <div className="relative min-h-screen bg-slate-50 font-sans text-slate-800 transition-colors duration-300 dark:bg-[#070A12] dark:text-slate-100 selection:bg-cyan-500/25 selection:text-cyan-900 dark:selection:text-cyan-200 overflow-x-hidden">
        {/* Luminous Animated Ambient Mesh Orbs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute -top-32 -left-20 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-cyan-400/25 to-blue-500/20 dark:from-cyan-500/15 dark:to-blue-600/15 blur-[120px] filter animate-orb-1" />
          <div className="absolute top-1/4 -right-32 h-[560px] w-[560px] rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/15 dark:from-purple-600/15 dark:to-indigo-600/15 blur-[130px] filter animate-orb-2" />
          <div className="absolute top-2/3 -left-32 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-emerald-400/20 to-teal-500/15 dark:from-emerald-500/12 dark:to-teal-600/12 blur-[120px] filter animate-orb-3" />
          <div className="absolute bottom-10 right-1/4 h-[460px] w-[460px] rounded-full bg-gradient-to-br from-indigo-500/20 to-sky-400/20 dark:from-indigo-600/15 dark:to-sky-500/15 blur-[120px] filter animate-orb-1" />
        </div>

        {/* Sticky Top Glass Navbar */}
        <Navbar
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
          onAdd={openAdd}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenProfile={() => setProfileModalOpen(true)}
          syncing={syncing}
          isCloudConnected={isCloudConnected}
          activeSection={activeSection}
        />

        {/* Continuous Page Sections Container */}
        <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-16">
          {/* 1. HOME SECTION (#home) */}
          <section id="home" className="scroll-mt-24 space-y-6">
            {/* Urgent Renewal Alerts Banner */}
            <UpcomingBanner upcoming={upcoming} />

            {/* Core Summary Metric Cards in Glass Panels */}
            <KpiCards
              totalMonthly={totalMonthly}
              totalAnnual={totalAnnual}
              activeCount={activeCount}
              upcomingCount={upcoming.length}
            />

            {/* Highlights Row in Glass Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Largest Expense Highlight */}
              <div className="glass-card-interactive glass-specular p-5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Biggest Monthly Expense
                  </p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/20 backdrop-blur-md">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                {topExpense ? (
                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-50">
                        {topExpense.name}
                      </span>
                      <Badge category={topExpense.category} />
                    </div>
                    <span className="font-mono text-lg font-extrabold text-slate-900 dark:text-slate-50">
                      {formatCurrency(topExpense.cost)}
                    </span>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">No active subscriptions yet</p>
                )}
              </div>

              {/* Closest Renewal Date */}
              <div className="glass-card-interactive glass-specular p-5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Next Bill Coming Up
                  </p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 backdrop-blur-md">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>
                {upcoming.length > 0 ? (
                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-50">
                        {upcoming[0].name}
                      </span>
                      <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                        {daysUntil(upcoming[0].nextBilling) === 0
                          ? "Due Today"
                          : `Due in ${daysUntil(upcoming[0].nextBilling)}d`}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(upcoming[0].nextBilling)} ({formatCurrency(upcoming[0].cost)})
                    </span>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    All renewals are scheduled safely beyond 7 days.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 2. ANALYTICS & SALARY BUDGETING SECTION (#analytics) */}
          <AnalyticsSection
            subs={subs}
            totalMonthly={totalMonthly}
            categoryData={categoryData}
            projectionData={projectionData}
            salary={salary}
            onUpdateSalary={handleUpdateSalary}
          />

          {/* 3. SUBSCRIPTIONS TABLE SECTION (#subscriptions) */}
          <SubscriptionsSection
            subs={subs}
            onEdit={openEdit}
            onDelete={handleDelete}
            onSaveInline={handleSaveInline}
            onOpenAdd={openAdd}
          />

          {/* 4. ABOUT SECTION (#about) */}
          <AboutSection onAddSub={openAdd} />

          {/* Minimalist Glass Footer */}
          <footer className="border-t border-white/60 dark:border-white/10 pt-8 pb-16 text-center text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-center gap-2 mb-2">
              <SubZeroLogo className="h-5 w-5" />
              <span className="font-extrabold text-slate-900 dark:text-slate-100">SubZero</span>
              <span>— Crystal Glass Subscription Ledger</span>
            </div>
            <p>
              {user ? (
                <>Signed in as <strong className="text-slate-900 dark:text-slate-100">{user.user_metadata?.full_name || user.email}</strong> • Cloud Synchronized</>
              ) : (
                <>Guest Mode • Data saved securely in your local browser cache</>
              )}
            </p>
          </footer>
        </main>

        {/* Fixed Floating AI Advisor Chatbot Widget */}
        <FloatingAiChatbot
          subs={subs}
          totalMonthly={totalMonthly}
          totalAnnual={totalAnnual}
          upcoming={upcoming}
          salary={salary}
        />
      </div>

      {/* Subscription Add / Edit Modal */}
      {modalOpen && (
        <SubscriptionModal
          initial={editingSub}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Authentication Modal */}
      {authModalOpen && (
        <AuthPage
          onClose={() => setAuthModalOpen(false)}
          onContinueAsGuest={() => setAuthModalOpen(false)}
        />
      )}

      {/* Profile Settings Modal */}
      {profileModalOpen && (
        <ProfileModal onClose={() => setProfileModalOpen(false)} />
      )}
    </div>
  );
}
