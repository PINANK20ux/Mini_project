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
        <div className="flex min-h-screen items-center justify-center bg-[#F7F2EB] dark:bg-[#181916]">
          <div className="flex flex-col items-center gap-3">
            <SubZeroLogo className="h-12 w-12 animate-float" />
            <div className="flex items-center gap-2 text-xs font-semibold text-[#70736A] dark:text-[#8D9087]">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#8B9A6E] border-t-transparent"></span>
              <span>Opening SubZero...</span>
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
        <div className="min-h-screen bg-[#F7F2EB] text-[#1F211C] transition-colors duration-300 dark:bg-[#181916] dark:text-[#F7F2EB]">
          <AuthPage
            isLandingPage={true}
            onContinueAsGuest={() => setGuestMode(true)}
          />
        </div>
      </div>
    );
  }

  // 3. Continuous Single-Page Scrolling Layout in Earthy Minimal Palette
  return (
    <div className={dark ? "dark" : ""}>
      <div className="relative min-h-screen bg-[#F7F2EB] font-sans text-[#1F211C] transition-colors duration-300 dark:bg-[#181916] dark:text-[#F7F2EB] selection:bg-[#8B9A6E]/25 selection:text-[#1F211C] dark:selection:text-[#F7F2EB] overflow-x-hidden">
        {/* Soft Ambient Warm Glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-25 dark:opacity-10 z-0">
          <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-[#8B9A6E]/30 blur-3xl filter" />
          <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-[#EAE2D6]/40 blur-3xl filter" />
        </div>

        {/* Sticky Top Navbar in #F7F2EB */}
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

            {/* Core Summary Metric Cards in Sandstone Cream (#EAE2D6) */}
            <KpiCards
              totalMonthly={totalMonthly}
              totalAnnual={totalAnnual}
              activeCount={activeCount}
              upcomingCount={upcoming.length}
            />

            {/* Highlights Row in #EAE2D6 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Largest Expense Highlight */}
              <div className="rounded-2xl border border-[#DCD5C9] bg-[#EAE2D6] p-5 shadow-sm dark:border-[#2E2D27] dark:bg-[#24231F]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#4D5047] dark:text-[#A6A89F]">
                    Biggest Monthly Expense
                  </p>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8B9A6E]/20 text-[#4E5C37] dark:text-[#D5E0C2]">
                    <TrendingUp className="h-3.5 w-3.5" />
                  </div>
                </div>
                {topExpense ? (
                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1F211C] dark:text-[#F7F2EB]">
                        {topExpense.name}
                      </span>
                      <Badge category={topExpense.category} />
                    </div>
                    <span className="font-mono text-lg font-extrabold text-[#1F211C] dark:text-[#F7F2EB]">
                      {formatCurrency(topExpense.cost)}
                    </span>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-[#70736A] dark:text-[#8D9087]">No active subscriptions yet</p>
                )}
              </div>

              {/* Closest Renewal Date */}
              <div className="rounded-2xl border border-[#DCD5C9] bg-[#EAE2D6] p-5 shadow-sm dark:border-[#2E2D27] dark:bg-[#24231F]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#4D5047] dark:text-[#A6A89F]">
                    Next Bill Coming Up
                  </p>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6E859A]/20 text-[#3D5265] dark:text-[#C5D9EB]">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                </div>
                {upcoming.length > 0 ? (
                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1F211C] dark:text-[#F7F2EB]">
                        {upcoming[0].name}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#8B9A6E] dark:text-[#A4B585]">
                        {daysUntil(upcoming[0].nextBilling) === 0
                          ? "Due Today"
                          : `Due in ${daysUntil(upcoming[0].nextBilling)}d`}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#70736A] dark:text-[#8D9087]">
                      {formatDate(upcoming[0].nextBilling)} ({formatCurrency(upcoming[0].cost)})
                    </span>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-[#70736A] dark:text-[#8D9087]">
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

          {/* Minimalist Footer */}
          <footer className="border-t border-[#DCD5C9] pt-8 pb-16 text-center text-xs text-[#70736A] dark:border-[#2E2D27] dark:text-[#8D9087]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <SubZeroLogo className="h-5 w-5" />
              <span className="font-extrabold text-[#1F211C] dark:text-[#F7F2EB]">SubZero</span>
              <span>— Effortless Subscription Ledger</span>
            </div>
            <p>
              {user ? (
                <>Signed in as <strong className="text-[#1F211C] dark:text-[#F7F2EB]">{user.user_metadata?.full_name || user.email}</strong> • Cloud Synchronized</>
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
