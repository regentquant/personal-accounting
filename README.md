# Fika - Personal Accounting

A minimalist personal accounting web app. Built with Next.js, Tailwind CSS, and local JSON storage. Runs entirely on your machine with no external services required.

## Features

- **Dashboard**: Overview with total balance, monthly income/expenses, and spending trends
- **Multi-Account**: Manage multiple accounts (bank, cash, WeChat Pay, Alipay, etc.)
- **Transaction Logging**: Record income and expenses with categories and notes
- **Category Breakdown**: Visual spending breakdown by category
- **Subscription Tracking**: Track recurring payments with billing cycle awareness
- **Personal Equity**: Distinguish net worth from total assets (exclude credit cards, loans)
- **Multi-Currency**: USD/CNY support with historical exchange rates
- **Bilingual**: English and Chinese interface
- **Fully Local**: All data stored as JSON files on your machine

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript
- **Storage**: Local JSON files (no database required)

## Getting Started

### Prerequisites

- Node.js 18.17+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Data is stored in the `data/` directory (gitignored). Default accounts and categories are created automatically on first run.

## Project Structure

```
app/
  api/            # API routes for local data CRUD
  dashboard/      # Main dashboard page
components/       # React UI components
context/          # Global state (FikaContext, I18nContext)
lib/              # Utilities (storage, i18n, date helpers)
types/            # TypeScript type definitions
data/             # Local JSON data (gitignored)
```

## License

MIT
