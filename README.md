# ❄️ SubZero — Subscription & Recurring Expense Tracker

SubZero is a modern, responsive Single Page Application (SPA) designed to track, analyze, and optimize recurring subscriptions and expenses. Built with an offline-first architecture, it seamlessly synchronizes with Supabase for real-time multi-device cloud persistence while providing instant local UI response.

---

## ✨ Features

- **🔐 Dual Access Modes**:
  - **Authenticated Mode**: Secure account management with multi-tenant cloud storage and real-time synchronization.
  - **Guest Mode**: Full functionality stored locally in the browser (`localStorage`) without requiring an account.
- **📊 Real-time Financial Analytics**:
  - **KPI Cards**: Summary of Total Monthly Spend, Total Annual Outflow, Active Subscription count, and Imminent Renewals.
  - **Category Breakdown**: Interactive Donut Chart powered by Recharts showing expense distribution across categories.
  - **6-Month Cashflow Projections**: Bar Chart computing expected charges by honoring monthly vs. annual billing cycles.
- **⚡ Smart Subscription Management**:
  - Full CRUD (Create, Read, Update, Delete) with input validation.
  - Dynamic **Autonomous Date Roll-Forward** (past-due dates automatically roll over to the next billing cycle).
  - **Renewal Alerts**: Banner highlighting upcoming renewals due within 7 days.
- **🔍 Search, Filter & Sort**:
  - Full-text search across subscription names.
  - Filter by category (Entertainment, Software, Utilities, Fitness, Housing, etc.).
  - Sort by Renewal Date, Cost (Ascending/Descending), or Name.
- **🎨 Modern Design System**:
  - Dark & Light mode toggle with system preference detection and persistence.
  - Custom warm glassmorphism aesthetics and micro-animations with Tailwind CSS.
  - Comprehensive Profile Modal (Manage name, monthly budget, currency preference, and password).

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) | Component-driven architecture using modern Hooks (`useMemo`, `useCallback`, Context API). |
| **Build Tool & Bundler** | [Vite 5](https://vitejs.dev/) | Lightning-fast development server and optimized bundle generator. |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first styling with class-based dark mode and custom animations. |
| **Data Visualization** | [Recharts 2](https://recharts.org/) | Responsive SVG charts (Donut category chart, Monthly projection bar chart). |
| **Icons** | [Lucide React](https://lucide.dev/) | Modern, lightweight icon suite. |
| **Backend / BaaS** | [Supabase](https://supabase.com/) | **PostgreSQL** database with **Row Level Security (RLS)**, **Supabase Auth** (JWT), and **Realtime** WebSocket changes. |
| **State & Storage** | React Context + LocalStorage | Optimistic UI updates with user-scoped `localStorage` fallback. |

---

## 🏗️ Architecture & Data Flow

```
┌────────────────────────────────────────────────────────┐
│                   React UI Dashboard                   │
│  (Header, KPI Cards, Category / Projection Charts, Table)│
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
               ┌────────────────────────┐
               │  useSubscriptions Hook │
               └─────┬────────────┬─────┘
                     │            │
         1. Instant Read/Write    │ 2. Async Sync & Realtime Stream
                     ▼            ▼
             ┌──────────────┐   ┌─────────────────────────────┐
             │ localStorage │   │      Supabase Backend       │
             │ (User Cache) │   │ ├── PostgreSQL (RLS Secured)│
             └──────────────┘   │ ├── Supabase Auth (JWT)     │
                                │ └── Realtime WebSockets     │
                                └─────────────────────────────┘
```

- **Optimistic Updates**: Changes reflect instantaneously in the UI by writing directly to `localStorage` before awaiting cloud confirmation.
- **Row Level Security (RLS)**: Enforces database-level isolation so authenticated users can only access their own records.
- **Realtime CDC**: Subscribes to database change events over WebSockets to synchronize updates across tabs and devices in real time.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A free [Supabase](https://supabase.com/) account (optional for local guest mode, required for cloud sync)

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd subscription-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
   *(If left empty or unconfigured, the application gracefully defaults to offline Guest Mode).*

4. **Set Up the Database (Supabase)**:
   Navigate to the **SQL Editor** in your Supabase dashboard and run the schema found in [`supabase/schema.sql`](supabase/schema.sql):

   ```sql
   -- Create subscriptions table
   create table if not exists public.subscriptions (
     id text primary key,
     user_id uuid references auth.users not null default auth.uid(),
     name text not null,
     cost numeric not null,
     cycle text not null check (cycle in ('monthly', 'annual')),
     category text not null,
     next_billing text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Enable Row Level Security (RLS)
   alter table public.subscriptions enable row level security;

   -- Create RLS Policy for authenticated owners
   create policy "Users can manage own subscriptions"
     on public.subscriptions
     for all
     to authenticated
     using (auth.uid() = user_id)
     with check (auth.uid() = user_id);

   -- Enable Realtime
   alter publication supabase_realtime add table public.subscriptions;
   ```

---

### Running the App

```bash
# Start local development server
npm run dev
```

Open the printed URL in your browser (typically `http://localhost:5173`).

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
src/
├── main.jsx                     # Application entry point wrapped in AuthProvider
├── App.jsx                      # Root view coordinator & layout
├── index.css                    # Tailwind CSS directives, typography, and custom utilities
├── components/
│   ├── Header.jsx               # Navigation bar, brand logo, theme switcher, profile menu
│   ├── AuthPage.jsx             # Sign In / Sign Up modal and landing screen
│   ├── ProfileModal.jsx         # User account settings, budget, currency & password update
│   ├── UpcomingBanner.jsx       # Alert banner for subscriptions renewing within 7 days
│   ├── KpiCards.jsx             # Monthly spend, Annual spend, Active count cards
│   ├── CategoryChart.jsx        # Recharts Donut chart displaying spend by category
│   ├── ProjectionChart.jsx      # Recharts Bar chart forecasting 6 months of spend
│   ├── SubscriptionTable.jsx    # Filterable, searchable, and sortable subscription list
│   ├── SubscriptionModal.jsx    # Add / Edit subscription dialog with validation
│   ├── SubZeroLogo.jsx          # Vector brand logo with float animation
│   └── Badge.jsx                # Reusable category tag component
├── context/
│   └── AuthContext.jsx          # Supabase Auth provider, sessions, profile metadata
├── hooks/
│   └── useSubscriptions.js      # CRUD, local storage caching, derived metrics, realtime sync
├── lib/
│   └── supabase.js              # Supabase JS client configuration
├── constants/
│   └── categories.js            # Predefined categories with badge color configurations
└── utils/
    ├── date.js                  # ISO date arithmetic, renewal countdown, roll-forward logic
    └── format.js                # Currency formatting, cost conversion, id generation
```

---

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).
