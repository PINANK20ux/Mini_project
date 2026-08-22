# Ledger — Subscription & Recurring Bill Tracker

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Project structure

```
src/
  main.jsx                     entry point
  App.jsx                      top-level layout, wires everything together
  index.css                    Tailwind directives
  components/
    Header.jsx                 logo, dark-mode toggle, "Add subscription"
    UpcomingBanner.jsx          alert banner for renewals within 7 days
    KpiCards.jsx                total monthly / annual / active count cards
    CategoryChart.jsx           donut chart, spend by category
    ProjectionChart.jsx         bar chart, next 6 months projected spend
    SubscriptionTable.jsx       search + filter + sort + table + row actions
    SubscriptionModal.jsx       add/edit form with validation
    Badge.jsx                   category pill used in the table
  hooks/
    useSubscriptions.js         state, localStorage persistence, derived metrics, CRUD
  data/
    seed.js                     mock starting data (Netflix, Spotify, Gym, Rent, AWS...)
  constants/
    categories.js                category colors/badges used across components
  utils/
    date.js                     ISO date parsing/formatting, renewal roll-forward logic
    format.js                   currency formatting, cost math, id generation
```

## Notes

- All subscriptions and the dark-mode preference persist to `localStorage`
  (`ledger_subscriptions_v1` and `ledger_theme_v1`), so data survives refreshes.
- Past-due renewal dates automatically roll forward on load, so the seeded
  demo data always looks current.
- Tailwind dark mode uses the `class` strategy (see `tailwind.config.js`),
  toggled via the sun/moon button in the header.
