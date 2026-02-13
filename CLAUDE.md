# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Mandatory Workflow
1. Before writing or editing any code, first output a detailed step-by-step plan (files to modify, specific changes, rationale)
2. Immediately execute the full plan without pausing for confirmation

## Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Management
```bash
# Update currency exchange rates from CSV
python3 scripts/update_currency_rates.py

# Query current database state
python3 scripts/query_currency_rates.py
```

## Architecture Overview

### State Management: Context-Aware Local Time Model

**Core Philosophy**: Transactions preserve their "local time" (wall-clock time) at creation, independent of timezone changes.

The app uses a **Context-Aware Local Time** model (implemented in `lib/timezone.ts`):
- Transactions store `local_date` (what the user saw on their clock) and `timezone_id` (where they were)
- Display always shows the original local date
- New transactions default to device's current timezone
- Users can set a "Home Timezone" preference

Example: A transaction created at "2024-01-15 10:00 AM PST" will always display as Jan 15, even if you view it from Tokyo.

### Global State: FikaContext

All application state flows through `context/FikaContext.tsx`:

**Data Flow**:
1. User authentication via Supabase
2. On login, parallel fetch of: accounts, categories, transactions, subscriptions
3. State updates trigger re-fetch to maintain sync with database
4. All CRUD operations go through FikaContext methods

**Key Computed Values**:
- `personalEquity`: Net worth from non-excluded accounts (e.g., excludes credit cards)
- `totalAssets`: Sum of ALL account balances
- `monthlyIncome/Expenses`: Calculated from current month's transactions
- `equityViewMode`: Toggle between "all-time" and "monthly" equity view

### Multi-Currency System

Currency conversion is handled in FikaContext:
- User sets a preferred currency (CNY or USD)
- Historical exchange rates stored in `currency_rates` table
- `convertAmount()` function converts transaction amounts to preferred currency
- All displayed totals are in the user's preferred currency

### Internationalization (i18n)

Bilingual support (English/Chinese) via `context/I18nContext.tsx` and `lib/i18n.ts`:
- Language preference stored in user profile
- All UI text uses `t()` function with translation keys
- Translations organized by feature (auth, dashboard, transactions, etc.)

### Personal Equity Feature

The app distinguishes between "Total Assets" and "Personal Equity":
- **Total Assets**: Sum of all account balances (including loans, credit cards)
- **Personal Equity**: True net worth (excludes accounts marked with `exclude_from_equity`)
- Two view modes:
  - **All-time**: Total accumulated equity
  - **Monthly**: Net change this month from personal accounts only

This allows users to track credit card spending without inflating their net worth.

### Database Schema

Tables (see `supabase-schema.sql`):
- `profiles`: User settings (currency, language, timezone)
- `accounts`: Payment accounts with `exclude_from_equity` flag
- `categories`: Income/expense categories (default + custom)
- `transactions`: All financial transactions with timezone context
- `subscriptions`: Recurring subscription tracking
- `currency_rates`: Historical USD↔CNY exchange rates

**Key Relationships**:
- All tables use Row Level Security (RLS) - users only access their own data
- `handle_new_user()` trigger creates default accounts and profile on signup
- `update_account_balance()` trigger auto-updates account balances on transaction changes

### Subscription Feature

Tracks recurring services (Netflix, Spotify, etc.):
- Supports monthly and annual billing cycles
- Calculates total annual and monthly costs (converted to preferred currency)
- Shows upcoming payment with urgency indicators (overdue, due soon)
- Allows pausing subscriptions with `is_active` toggle

## File Organization

### Critical Files
- `context/FikaContext.tsx` - Central state management, all data operations
- `context/I18nContext.tsx` - Language/translation state
- `lib/timezone.ts` - Timezone utilities for local time model
- `lib/i18n.ts` - Translation dictionaries
- `types/database.ts` - TypeScript types generated from Supabase schema

### Supabase Client Patterns
- **Browser**: Use `lib/supabase/client.ts` in client components
- **Server**: Use `lib/supabase/server.ts` in server components/actions
- **Middleware**: Use `lib/supabase/middleware.ts` for route protection

### Component Organization
- `components/` - Reusable UI components
- `components/ui/` - Base UI primitives (Modal, Icon)
- `app/` - Next.js App Router pages
- `app/auth/` - Authentication pages (login, signup, callback)
- `app/dashboard/` - Main app dashboard

## Development Notes

### Working with Transactions
- Always include `timezone_id` and `local_date` when creating transactions
- Use `getDeviceTimezone()` to get user's current timezone
- Use `getLocalDateInTimezone()` to calculate correct local date

### Working with Accounts
- Check `exclude_from_equity` flag when calculating personal equity
- Default accounts are created automatically via `handle_new_user()` trigger
- Account balances auto-update via database trigger - don't update manually

### Working with Subscriptions
- Cost can be in any currency (CNY or USD)
- Billing cycle affects cost calculations (monthly → annual = × 12)
- `next_payment_date` determines sort order and urgency
- Only `is_active` subscriptions count toward totals

### Database Migrations
- Place migration files in project root (e.g., `migration-add-subscriptions.sql`)
- Update `supabase-schema.sql` to keep it comprehensive
- Test migrations in Supabase SQL Editor or via MCP connection
- Follow existing patterns for RLS policies, indexes, and triggers

### Currency Rate Updates
- CSV files should contain columns: `time,open,high,low,close`
- Script uses `close` price as the exchange rate
- Place CSV in `scripts/` folder or specify custom path
- Script automatically skips duplicate dates using pagination to fetch all existing rates

## Claude Code Instructions
- After each task, automatically run `git add .` and `git commit -m "[description]"` to describe your changes.
- I will handle all `git push` commands manually.
