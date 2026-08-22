import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import UpcomingBanner from "./components/UpcomingBanner.jsx";
import KpiCards from "./components/KpiCards.jsx";
import CategoryChart from "./components/CategoryChart.jsx";
import ProjectionChart from "./components/ProjectionChart.jsx";
import SubscriptionTable from "./components/SubscriptionTable.jsx";
import SubscriptionModal from "./components/SubscriptionModal.jsx";
import AuthPage from "./components/AuthPage.jsx";
import ProfileModal from "./components/ProfileModal.jsx";
import SubZeroLogo from "./components/SubZeroLogo.jsx";
import { useSubscriptions } from "./hooks/useSubscriptions.js";
import { useAuth } from "./context/AuthContext.jsx";

const THEME_KEY = "ledger_theme_v1";

export default function App() {
  const {
    subs,
    loaded,
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

  const [dark, setDark] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  // Load theme preference
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

  // Persist theme preference
  useEffect(() => {
    if (!themeLoaded) return;
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark, themeLoaded]);

  // When user logs in, ensure guestMode is reset
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

  const handleDelete = (id) => {
    if (window.confirm("Delete this subscription? This can't be undone.")) {
      remove(id);
    }
  };

  // 1. Initial Authentication Check Loading State
  if (authLoading || !loaded) {
    return (
      <div className={dark ? "dark" : ""}>
        <div className="flex min-h-screen items-center justify-center bg-[#faf9f6] dark:bg-[#121110]">
          <div className="flex flex-col items-center gap-3">
            <SubZeroLogo className="h-12 w-12 animate-float" />
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-amber-600 border-t-transparent dark:border-amber-400"></span>
              <span>Loading SubZero...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. First Step: If user is not logged in and not in guest mode, show Sign In / Sign Up page
  if (!user && !guestMode) {
    return (
      <div className={dark ? "dark" : ""}>
        <div className="min-h-screen bg-[#faf9f6] text-stone-900 transition-colors duration-300 dark:bg-[#121110] dark:text-stone-100">
          <AuthPage
            isLandingPage={true}
            onContinueAsGuest={() => setGuestMode(true)}
          />
        </div>
      </div>
    );
  }

  // 3. Main Dashboard Screen
  return (
    <div className={dark ? "dark" : ""}>
      <div className="relative min-h-screen bg-[#faf9f6] font-sans text-stone-900 transition-colors duration-300 dark:bg-[#121110] dark:text-stone-100 overflow-x-hidden">
        {/* Soft Light Warm Ambient Background Glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30 dark:opacity-15">
          <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-amber-300/30 blur-3xl filter" />
          <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl filter" />
          <div className="absolute -bottom-20 left-1/3 h-96 w-96 rounded-full bg-amber-200/25 blur-3xl filter" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Header
            dark={dark}
            onToggleDark={() => setDark((d) => !d)}
            onAdd={openAdd}
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenProfile={() => setProfileModalOpen(true)}
          />

          <UpcomingBanner upcoming={upcoming} />

          <KpiCards
            totalMonthly={totalMonthly}
            totalAnnual={totalAnnual}
            activeCount={activeCount}
            upcomingCount={upcoming.length}
          />

          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CategoryChart categoryData={categoryData} totalMonthly={totalMonthly} />
            <ProjectionChart projectionData={projectionData} />
          </div>

          <SubscriptionTable
            subs={subs}
            search={search}
            setSearch={setSearch}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onEdit={openEdit}
            onDelete={handleDelete}
          />

          <p className="mt-6 text-center text-xs text-stone-400 dark:text-stone-600">
            {user
              ? `Signed in as ${user.user_metadata?.full_name || user.email}`
              : "Guest Mode — SubZero Subscription Tracker"}
          </p>
        </div>
      </div>

      {/* Subscription Add / Edit Modal */}
      {modalOpen && (
        <SubscriptionModal
          initial={editingSub}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Authentication Modal (when opened from Header in Guest Mode) */}
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

