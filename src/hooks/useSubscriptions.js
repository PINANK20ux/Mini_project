import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { parseISO, todayDate, daysUntil, rollForward } from "../utils/date.js";
import { round2, monthlyEquivalent, annualEquivalent } from "../utils/format.js";

// Generate distinct local storage key for each user account (and guest mode)
const getStorageKey = (user) => {
  return user?.id ? `subzero_user_subs_${user.id}` : "subzero_guest_subs";
};

// Helper to convert Supabase DB row (snake_case) to client model (camelCase)
const mapFromDb = (row) => ({
  id: row.id,
  name: row.name,
  cost: parseFloat(row.cost),
  cycle: row.cycle,
  category: row.category,
  nextBilling: rollForward(row.cycle, row.next_billing),
  createdAt: row.created_at,
  userId: row.user_id,
});

// Helper to convert client model (camelCase) to Supabase DB row (snake_case)
const mapToDb = (sub, userId) => ({
  id: sub.id,
  name: sub.name,
  cost: sub.cost,
  cycle: sub.cycle,
  category: sub.category,
  next_billing: sub.nextBilling,
  user_id: userId,
});

export function useSubscriptions() {
  const [subs, setSubs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const isCloud = isSupabaseConfigured();
  const { user } = useAuth();

  // Helper to read current user's local cache
  const readLocalCache = useCallback(() => {
    try {
      const key = getStorageKey(user);
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((s) => ({
        ...s,
        nextBilling: rollForward(s.cycle, s.nextBilling),
      }));
    } catch (e) {
      return [];
    }
  }, [user]);

  // Helper to write to current user's local cache
  const writeLocalCache = useCallback((data) => {
    try {
      const key = getStorageKey(user);
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn("Could not write to local cache:", e);
    }
  }, [user]);

  // 1. Initial Load: Load local cache first, then sync with Supabase
  const loadData = useCallback(async () => {
    // Immediate instant load from user-scoped local cache
    const cached = readLocalCache();
    setSubs(cached);

    if (isCloud && supabase && user) {
      try {
        setSyncing(true);
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) {
          console.warn("Supabase query note (using local cache):", error.message);
          // Keep local cache if Supabase table is not yet set up
        } else if (data) {
          const cloudSubs = data.map(mapFromDb);
          // If Supabase has data, use it and update local cache
          if (cloudSubs.length > 0) {
            setSubs(cloudSubs);
            writeLocalCache(cloudSubs);
          } else if (cached.length > 0) {
            // If Supabase was empty but user had local cache for this account, sync up to Supabase
            const dbRows = cached.map((s) => mapToDb(s, user.id));
            await supabase.from("subscriptions").upsert(dbRows);
          }
        }
      } catch (err) {
        console.error("Supabase sync error (using local cache):", err);
      } finally {
        setSyncing(false);
        setLoaded(true);
      }
    } else {
      setLoaded(true);
    }
  }, [isCloud, user, readLocalCache, writeLocalCache]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 2. Realtime sync subscription for Supabase
  useEffect(() => {
    if (!isCloud || !supabase || !user) return;

    const channel = supabase
      .channel(`realtime-subscriptions-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newSub = mapFromDb(payload.new);
            setSubs((prev) => {
              if (prev.some((s) => s.id === newSub.id)) return prev;
              const updated = [...prev, newSub];
              writeLocalCache(updated);
              return updated;
            });
          } else if (payload.eventType === "UPDATE") {
            const updatedSub = mapFromDb(payload.new);
            setSubs((prev) => {
              const updated = prev.map((s) => (s.id === updatedSub.id ? updatedSub : s));
              writeLocalCache(updated);
              return updated;
            });
          } else if (payload.eventType === "DELETE") {
            setSubs((prev) => {
              const updated = prev.filter((s) => s.id !== payload.old.id);
              writeLocalCache(updated);
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isCloud, user, writeLocalCache]);

  /* ---------------- derived metrics ---------------- */

  const totalMonthly = useMemo(
    () => round2(subs.reduce((a, s) => a + monthlyEquivalent(s), 0)),
    [subs]
  );

  const totalAnnual = useMemo(
    () => round2(subs.reduce((a, s) => a + annualEquivalent(s), 0)),
    [subs]
  );

  const categoryData = useMemo(() => {
    const totals = {};
    subs.forEach((s) => {
      totals[s.category] = (totals[s.category] || 0) + monthlyEquivalent(s);
    });
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value: round2(value) }))
      .sort((a, b) => b.value - a.value);
  }, [subs]);

  const projectionData = useMemo(() => {
    const today = todayDate();
    return [0, 1, 2, 3, 4, 5].map((offset) => {
      const start = new Date(today.getFullYear(), today.getMonth() + offset, 1, 0, 0, 0);
      const end = new Date(today.getFullYear(), today.getMonth() + offset + 1, 0, 23, 59, 59);
      let amount = 0;

      subs.forEach((s) => {
        if (!s.nextBilling || !s.cost) return;
        const billingDate = parseISO(s.nextBilling);

        if (s.cycle === "annual") {
          // Annual subscription: charges ONLY in the specific renewal month
          const d = new Date(billingDate);
          while (d < start) {
            d.setFullYear(d.getFullYear() + 1);
          }
          if (d >= start && d <= end) {
            amount += s.cost;
          }
        } else {
          // Monthly subscription: charges each month on or after its first billing month
          const firstBillingMonth = new Date(billingDate.getFullYear(), billingDate.getMonth(), 1);
          if (start >= firstBillingMonth) {
            amount += s.cost;
          }
        }
      });

      return {
        month: start.toLocaleString(undefined, { month: "short" }),
        amount: round2(amount),
      };
    });
  }, [subs]);

  const upcoming = useMemo(
    () =>
      subs
        .filter((s) => {
          const d = daysUntil(s.nextBilling);
          return d >= 0 && d <= 7;
        })
        .sort((a, b) => daysUntil(a.nextBilling) - daysUntil(b.nextBilling)),
    [subs]
  );

  /* ---------------- CRUD ---------------- */

  const addOrUpdate = async (payload) => {
    // 1. Update state & user-specific local cache immediately
    setSubs((prev) => {
      const exists = prev.some((s) => s.id === payload.id);
      const updated = exists
        ? prev.map((s) => (s.id === payload.id ? payload : s))
        : [...prev, payload];
      writeLocalCache(updated);
      return updated;
    });

    // 2. Persist to Supabase if connected
    if (isCloud && supabase && user) {
      try {
        setSyncing(true);
        const { error } = await supabase
          .from("subscriptions")
          .upsert(mapToDb(payload, user.id));

        if (error) {
          console.error("Supabase upsert error:", error);
        }
      } catch (err) {
        console.error("Supabase network error:", err);
      } finally {
        setSyncing(false);
      }
    }
  };

  const remove = async (id) => {
    // 1. Update state & user-specific local cache immediately
    setSubs((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      writeLocalCache(updated);
      return updated;
    });

    // 2. Persist deletion to Supabase if connected
    if (isCloud && supabase && user) {
      try {
        setSyncing(true);
        const { error } = await supabase
          .from("subscriptions")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          console.error("Supabase delete error:", error);
        }
      } catch (err) {
        console.error("Supabase network error:", err);
      } finally {
        setSyncing(false);
      }
    }
  };

  return {
    subs,
    loaded,
    syncing,
    isCloudConnected: Boolean(isCloud && user),
    totalMonthly,
    totalAnnual,
    activeCount: subs.length,
    categoryData,
    projectionData,
    upcoming,
    addOrUpdate,
    remove,
  };
}



