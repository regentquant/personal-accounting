# Currency Rates Update Script

This script updates currency exchange rates in the Supabase database from a CSV file.

## Setup

1. Install Python dependencies:
```bash
pip install -r scripts/requirements.txt
```

2. Set up environment variables in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Usage

### Basic usage (default CSV path):
```bash
python scripts/update_currency_rates.py
```

This will use the default CSV file at: `data/currency-rates/FX_IDC_USDCNY, 1D.csv`

### Custom CSV path:
```bash
python scripts/update_currency_rates.py path/to/your/file.csv
```

## CSV Format

The script expects a CSV file with the following format:
```csv
time,open,high,low,close,Correlation
2024-11-11,7.178,7.2134,7.1763,7.2134,0.08437767506818072
2024-11-12,7.2189,7.2407,7.218,7.2315,0.10151434032639053
```

The script uses the `close` price as the exchange rate.

## Features

- **Avoids duplicates**: Checks existing rates by date before inserting
- **Batch processing**: Inserts rates in batches of 100 for efficiency
- **Error handling**: Continues processing even if individual records fail
- **Progress reporting**: Shows summary of inserted and skipped rates

## File Locations

- Script: `scripts/update_currency_rates.py`
- CSV data: `data/currency-rates/FX_IDC_USDCNY, 1D.csv`
- Requirements: `scripts/requirements.txt`

