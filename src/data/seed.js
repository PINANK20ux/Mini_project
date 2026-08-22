import { addDays } from "../utils/date.js";
import { genId } from "../utils/format.js";

// Renewal dates are offset from "today" so the app always demonstrates
// the upcoming-renewal alert banner on first load, regardless of the date.
export const SEED = () => [
  {
    id: genId(),
    name: "Netflix",
    cost: 499,
    cycle: "monthly",
    category: "Entertainment",
    nextBilling: addDays(3),
  },
  {
    id: genId(),
    name: "Spotify",
    cost: 119,
    cycle: "monthly",
    category: "Entertainment",
    nextBilling: addDays(18),
  },
  {
    id: genId(),
    name: "Gym Membership",
    cost: 1999,
    cycle: "monthly",
    category: "Fitness",
    nextBilling: addDays(6),
  },
  {
    id: genId(),
    name: "Rent",
    cost: 15000,
    cycle: "monthly",
    category: "Housing",
    nextBilling: addDays(9),
  },
  {
    id: genId(),
    name: "AWS Cloud",
    cost: 4500,
    cycle: "monthly",
    category: "Work",
    nextBilling: addDays(14),
  },
  {
    id: genId(),
    name: "Domain & Hosting",
    cost: 2499,
    cycle: "annual",
    category: "Utilities",
    nextBilling: addDays(45),
  },
];
