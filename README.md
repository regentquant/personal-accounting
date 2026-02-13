# ☕ Fika - Personal Finance App

A minimalist personal accounting web app inspired by Swedish coffee culture. Built with Next.js, Tailwind CSS, Supabase, and Recharts.

## ✨ Features

- **User Authentication**: Email/password and Google OAuth login
- **Dynamic Dashboard**: High-level overview with Total Balance, Monthly Income, and Monthly Expenses
- **Spending Trends**: Interactive line chart showing income vs expenses over the last 14 days
- **Multi-Account Management**: Toggle between accounts (WeChat Pay, Alipay, Bank Cards, Cash)
- **Transaction Logging**: Easy-to-use modal for recording income and expenses
- **Transaction History**: Searchable, filterable list of recent transactions
- **Category Breakdown**: Beautiful donut chart showing spending by category
- **Responsive Design**: Works perfectly on mobile and desktop

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Backend**: [Supabase](https://supabase.com/) (Auth + PostgreSQL)
- **Hosting**: [Vercel](https://vercel.com/)
- **TypeScript**: For type safety

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Supabase account

### 1. Clone & Install

```bash
cd fika-app
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Authentication > Providers** and enable:
   - Email (enabled by default)
   - Google (requires Google Cloud OAuth credentials)
4. Go to **Project Settings > API** and copy your keys

### 3. Configure Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services > Credentials**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Add authorized redirect URI:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
6. Copy **Client ID** and **Client Secret**
7. In Supabase Dashboard, go to **Authentication > Providers > Google**
8. Paste your Client ID and Client Secret

## 🚀 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Update Supabase Redirect URLs

After deploying, add your Vercel URL to Supabase:

1. Go to **Authentication > URL Configuration**
2. Add your Vercel URL to **Site URL**: `https://your-app.vercel.app`
3. Add to **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

## 📁 Project Structure

```
fika-app/
├── app/
│   ├── auth/
│   │   ├── callback/route.ts    # OAuth callback handler
│   │   ├── login/page.tsx       # Login page
│   │   └── signup/page.tsx      # Sign up page
│   ├── dashboard/page.tsx       # Protected dashboard
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Landing page
├── components/
│   ├── ui/
│   │   ├── Icon.tsx
│   │   └── Modal.tsx
│   ├── AccountSelector.tsx
│   ├── CategoryBreakdown.tsx
│   ├── Header.tsx
│   ├── SpendingChart.tsx
│   ├── StatCard.tsx
│   ├── TransactionHistory.tsx
│   └── TransactionModal.tsx
├── context/
│   └── FikaContext.tsx          # Global state with Supabase
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser client
│   │   ├── server.ts            # Server client
│   │   └── middleware.ts        # Auth middleware
│   └── utils.ts
├── types/
│   ├── database.ts              # Supabase types
│   └── index.ts
├── middleware.ts                # Route protection
├── supabase-schema.sql          # Database schema
└── env.example                  # Environment template
```

## 🗄️ Database Schema

The app uses the following tables:

- **profiles**: User profile information
- **accounts**: Payment accounts (WeChat, Alipay, etc.)
- **categories**: Income/expense categories
- **transactions**: All financial transactions

See `supabase-schema.sql` for the complete schema with RLS policies.

## 🎨 Design Philosophy

**Fika** (Swedish: "coffee break") is more than just a personal finance app—it's an invitation to slow down and take control of your finances with the same calm, mindful approach as enjoying a good cup of coffee.

### Design Principles:
- **Warm Neutrals**: Cream, latte, caramel, and espresso tones
- **Soft Rounded Corners**: Friendly, approachable interface
- **Plenty of White Space**: Clean, uncluttered design
- **Bento Box Layout**: Organized, modular dashboard sections

## 📝 License

MIT License - feel free to use this for personal or commercial projects.

---

*Take a break. Enjoy your finances. ☕*
