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

## Architecture Overview

### Storage: Local JSON Files

All data is stored in local JSON files under the `data/` directory (gitignored — contains personal financial data):
- `data/accounts.json` — Payment accounts
- `data/categories.json` — Income/expense categories
- `data/transactions.json` — All financial transactions
- `data/subscriptions.json` — Recurring subscriptions
- `data/profile.json` — User settings (currency, language)
- `data/currency_rates.json` — Historical USD/CNY exchange rates

Data is read/written via `lib/storage.ts` and the Next.js API routes in `app/api/`.

### Global State: FikaContext

All application state flows through `context/FikaContext.tsx`:

**Data Flow**:
1. On load, fetch all data from local JSON files via API routes
2. State updates write back to JSON files to persist
3. All CRUD operations go through FikaContext methods

**Key Computed Values**:
- `personalEquity`: Net worth from non-excluded accounts (e.g., excludes credit cards)
- `totalAssets`: Sum of ALL account balances
- `monthlyIncome/Expenses`: Calculated from current month's transactions
- `equityViewMode`: Toggle between "all-time" and "monthly" equity view

### Multi-Currency System

- User sets a preferred currency (CNY or USD)
- Historical exchange rates stored in `data/currency_rates.json`
- `convertAmount()` converts transaction amounts to preferred currency
- All displayed totals are in the user's preferred currency

### Internationalization (i18n)

Bilingual support (English/Chinese) via `context/I18nContext.tsx` and `lib/i18n.ts`:
- Language preference stored in profile
- All UI text uses `t()` function with translation keys

### Personal Equity Feature

- **Total Assets**: Sum of all account balances (including loans, credit cards)
- **Personal Equity**: True net worth (excludes accounts marked with `exclude_from_equity`)
- Two view modes: **All-time** and **Monthly**

### Subscription Feature

Tracks recurring services:
- Monthly and annual billing cycles
- Total annual/monthly costs (converted to preferred currency)
- Upcoming payment urgency indicators
- `is_active` toggle for pausing

## File Organization

### Critical Files
- `context/FikaContext.tsx` — Central state management, all data operations
- `context/I18nContext.tsx` — Language/translation state
- `lib/storage.ts` — Local JSON file read/write utilities
- `lib/timezone.ts` — Date utilities
- `lib/i18n.ts` — Translation dictionaries
- `types/database.ts` — TypeScript type definitions

### API Routes
- `app/api/data/[collection]/route.ts` — CRUD API for all data collections
- `app/api/init/route.ts` — Initialize default data on first run

### Component Organization
- `components/` — Reusable UI components
- `components/ui/` — Base UI primitives (Modal, Icon)
- `app/dashboard/` — Main app dashboard

## Development Notes

### Working with Transactions
- Include `local_date` when creating transactions
- Use `getTodayLocalDate()` from `lib/timezone.ts` for current date

### Working with Accounts
- Check `exclude_from_equity` flag when calculating personal equity
- Account balances are updated in FikaContext when transactions change

### Working with Subscriptions
- Cost can be in any currency (CNY or USD)
- Billing cycle affects cost calculations (monthly -> annual = x12)
- `next_payment_date` determines sort order and urgency
- Only `is_active` subscriptions count toward totals

## Claude Code Instructions
- After each task, automatically run `git add .` and `git commit -m "[description]"` to describe your changes.
- I will handle all `git push` commands manually.
