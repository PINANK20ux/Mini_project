const pad = (n) => String(n).padStart(2, "0");

export const toISO = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseISO = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const todayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const addDays = (n) => {
  const d = todayDate();
  d.setDate(d.getDate() + n);
  return toISO(d);
};

export const daysUntil = (iso) => {
  const diff = parseISO(iso) - todayDate();
  return Math.round(diff / 86400000);
};

export const formatDate = (iso) =>
  parseISO(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

/**
 * Roll a subscription's next-billing date forward past today,
 * preserving its cadence (monthly -> +1 month steps, annual -> +1 year steps).
 */
export const rollForward = (cycle, nextBilling) => {
  const d = parseISO(nextBilling);
  const today = todayDate();
  if (cycle === "monthly") {
    while (d < today) d.setMonth(d.getMonth() + 1);
  } else {
    while (d < today) d.setFullYear(d.getFullYear() + 1);
  }
  return toISO(d);
};
