export const formatCurrency = (n) =>
  n.toLocaleString("en-IN", { style: "currency", currency: "INR" });

export const round2 = (n) => Math.round(n * 100) / 100;

export const monthlyEquivalent = (s) =>
  s.cycle === "monthly" ? s.cost : s.cost / 12;

export const annualEquivalent = (s) =>
  s.cycle === "monthly" ? s.cost * 12 : s.cost;

export const genId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
