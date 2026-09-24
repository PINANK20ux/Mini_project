# 🌿 SubZero — Smart Subscription & Recurring Expense Tracker

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-8B9A6E.svg)](LICENSE)

**SubZero** is a sleek, continuous single-page web application designed to track, analyze, and optimize recurring subscriptions and bills. Styled in an **earthy minimal aesthetic** with warm natural tones, it combines a local-first architecture with optional **Supabase PostgreSQL** cloud synchronization and an embedded **Floating AI Advisor Chatbot**.

---

## 🎨 Earthy Minimal Design Palette

SubZero uses a calming, nature-inspired palette crafted for high readability, minimal eye fatigue, and sharp contrast:

| Role | Tone | Hex Code | UI Application |
| :--- | :--- | :--- | :--- |
| **Primary Accent / CTA** | **Sage Green** | `#8B9A6E` | `+ Add Bill` button, active navigation indicator, floating AI launcher, progress bars, chart gradients |
| **Primary Background** | **Warm Linen** | `#F7F2EB` | Main viewport canvas, sticky top navbar, and secondary card highlights |
| **Card / Panel Backgrounds** | **Sandstone Cream** | `#EAE2D6` | Metric summary cards, analytics panels, subscription table shell, and AI popup |
| **Borders & Dividers** | **Soft Ash** | `#DCD5C9` / `#EEEEEE` | Subtle card borders, table dividers, input borders, and separation lines |
| **Typography** | **Deep Charcoal** | `#1F211C` / `#4D5047` | High-contrast headings, currency values, table labels, and readable body text |

---

## ✨ Features & Architecture

### 1. 🧭 Sticky Navigation Bar ([`Navbar.jsx`](src/components/Navbar.jsx))
- **Smooth-Scroll Navigation**: Instant navigation to `#home`, `#analytics`, `#subscriptions`, and `#about`.
- **Active Scroll-Spy**: Automatically highlights your current location on the page as you scroll.
- **Top Bar Controls**: Dark/Light mode toggle, cloud sync status indicator, user account settings, and the primary **`+ Add Bill`** button.

### 2. 🏠 Spend Overview ([`KpiCards.jsx`](src/components/KpiCards.jsx) & [`UpcomingBanner.jsx`](src/components/UpcomingBanner.jsx))
- **Key Metric Cards**: Instant calculation of *Monthly Spend*, *Annual Projection*, and *Active Bills*.
- **Urgent Renewal Alerts**: Proactively flags bills renewing within the next 7 days to eliminate surprise auto-debits.
- **Quick Highlights**: Highlights your *Biggest Monthly Expense* and *Next Bill Coming Up*.

### 3. 📊 Smart Budget & Income Engine ([`AnalyticsSection.jsx`](src/components/AnalyticsSection.jsx))
- **Monthly Income Input**: Set your take-home salary to measure overall subscription load.
- **"Calculate Recommended Limits"**: Auto-calculates healthy spending limits across categories based on standard 50/30/20 personal finance ratios.
- **Bill-to-Income Health Meter**: Color-coded safety meter (*Safe & Healthy < 10%*, *Moderate 10%–20%*, *High Bill Load > 20%*).
- **Interactive Visualizations**:
  - **Category Donut Chart** ([`CategoryChart.jsx`](src/components/CategoryChart.jsx)): Visual breakdown of spending by category in earthy tones.
  - **6-Month Cashflow Projection** ([`ProjectionChart.jsx`](src/components/ProjectionChart.jsx)): Forecasts upcoming monthly outflows.
- **Custom Category Limit Sliders**: Fine-tune budget caps per category with live threshold meters.

### 4. 📋 Subscription Management ([`SubscriptionsSection.jsx`](src/components/SubscriptionsSection.jsx))
- **Search & Filters**: Real-time name search, category filter, and billing cadence filter (Monthly / Yearly).
- **Multi-Parameter Sorting**: Sort by next due date, highest cost, lowest cost, or alphabetical (A–Z).
- **Inline Quick Editing**: Edit names, costs, categories, cycles, and payment dates in-place with instant validation.
- **Data Export & Actions**: Download CSV export, open full edit modal ([`SubscriptionModal.jsx`](src/components/SubscriptionModal.jsx)), or safely delete entries.

### 5. 💡 How It Works ([`AboutSection.jsx`](src/components/AboutSection.jsx))
- **Plain-English User Guide** (Zero developer jargon):
  1. **01 — Add your bills & trials**: Record streaming, gym, utilities, or software in 10 seconds.
  2. **02 — Get timely renewal alerts**: Receive a heads-up 7 days before charges hit your card.
  3. **03 — Save money effortlessly**: Spot duplicate services and cancel forgotten trials in time.

### 6. 🤖 Floating AI Advisor Chatbot ([`FloatingAiChatbot.jsx`](src/components/FloatingAiChatbot.jsx))
- **Fixed Launcher Button (FAB)** in Sage Green (`#8B9A6E`) at bottom-right.
- **Live Ledger & Salary Context**: Directly evaluates your active subscriptions, monthly budget, and take-home pay.
- **Natural Language Inquiries**:
  - *"Is my spending healthy for my salary?"*
  - *"What bills are due this week?"*
  - *"Where can I save ₹2,000?"*
  - *"Summarize OTT / Entertainment expenses"*
  - *"Detect duplicate or overlapping subscriptions"*
- **Chat Experience**: Quick-action prompt chips, auto-scrolling message history, copy response button, and typing indicator.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) | Functional components, custom hooks, and Context API |
| **Build Tool** | [Vite 5](https://vitejs.dev/) | High-speed HMR, ES modules, optimized Rollup bundling |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Custom earthy theme, dark mode transitions, micro-animations |
| **Charts** | [Recharts 2](https://recharts.org/) | Responsive SVG donut and projected bar charts |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible vector icons |
| **Backend / DB** | [Supabase](https://supabase.com/) | PostgreSQL, Row Level Security (RLS), Realtime subscriptions |
| **Persistence** | Local-First + Cloud Sync | Seamless guest fallback with user-isolated `localStorage` cache |

---

## 📁 Project Structure

```
subscription-tracker/
├── src/
│   ├── main.jsx                     # App root wrapped with AuthProvider
│   ├── App.jsx                      # Single-page layout coordinator & scroll-spy
│   ├── index.css                    # Tailwind imports and animation utilities
│   ├── components/
│   │   ├── Navbar.jsx               # Sticky top navigation bar with anchors
│   │   ├── KpiCards.jsx             # Monthly spend, annual projection, active count
│   │   ├── UpcomingBanner.jsx       # Alert banner for bills due within 7 days
│   │   ├── AnalyticsSection.jsx     # Salary input, smart limits, charts & sliders
│   │   ├── CategoryChart.jsx        # Donut chart showing category breakdown
│   │   ├── ProjectionChart.jsx      # Bar chart showing 6-month projected spend
│   │   ├── SubscriptionsSection.jsx # Management table, search, filters, inline edit & CSV
│   │   ├── AboutSection.jsx         # Plain-English 3-step value guide
│   │   ├── FloatingAiChatbot.jsx    # Fixed bottom-right AI advisor widget
│   │   ├── SubscriptionModal.jsx    # Add / Edit subscription dialog
│   │   ├── AuthPage.jsx             # Sign In / Sign Up modal and landing view
│   │   ├── ProfileModal.jsx         # User account settings & budget profile
│   │   ├── SubZeroLogo.jsx          # SVG brand logo
│   │   └── Badge.jsx                # Earthy category badge component
│   ├── context/
│   │   └── AuthContext.jsx          # Supabase auth session & user state
│   ├── hooks/
│   │   └── useSubscriptions.js      # CRUD, local caching, derived metrics, realtime sync
│   ├── lib/
│   │   └── supabase.js              # Supabase client initialization
│   ├── constants/
│   │   └── categories.js            # Category keys and badge color mappings
│   └── utils/
│       ├── date.js                  # Date calculations, countdowns, and renewal roll-forward
│       └── format.js                # Currency formatting and calculations
├── tailwind.config.js               # Theme color tokens (sage, linen, sandstone, ash, charcoal)
├── vite.config.js                   # Vite bundler configuration
└── package.json                     # Project scripts and dependencies
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn** / **pnpm**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/KRISH20ux/Mini_project.git
cd subscription-tracker

# Install dependencies
npm install
```

### 3. Configure Supabase (Optional)
SubZero works immediately out-of-the-box in **Guest Mode** using browser `localStorage`. To enable multi-device cloud sync and user accounts:

1. Create a project at [supabase.com](https://supabase.com/).
2. In the Supabase SQL Editor, run the table setup script:

```sql
-- Create subscriptions table
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cost NUMERIC NOT NULL,
  cycle TEXT NOT NULL CHECK (cycle IN ('monthly', 'yearly')),
  category TEXT NOT NULL,
  next_billing DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own subscriptions
CREATE POLICY "Users can CRUD their own subscriptions"
  ON subscriptions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

3. Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Run Locally
```bash
# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📦 Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛡️ License

Distributed under the [MIT License](LICENSE). Feel free to use, modify, and distribute for personal or commercial projects.
