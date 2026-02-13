# Fika User Manual

Welcome to Fika! This guide will help you understand how to use the app to track your personal finances, manage subscriptions, and gain insights into your spending habits.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Managing Your Accounts](#managing-your-accounts)
3. [Recording Transactions](#recording-transactions)
4. [Understanding Your Dashboard Metrics](#understanding-your-dashboard-metrics)
5. [Tracking Subscriptions](#tracking-subscriptions)
6. [Viewing Charts & Analytics](#viewing-charts--analytics)
7. [Settings & Preferences](#settings--preferences)
8. [Importing & Exporting Data](#importing--exporting-data)
9. [Common Questions](#common-questions)

---

## Getting Started

### What is Fika?

Fika is a personal finance app designed to help you track income and expenses across multiple payment methods, understand your true net worth, and manage recurring subscriptions. The app supports multiple currencies (CNY and USD) and is available in both English and Chinese.

### Creating an Account

1. Visit the Fika app and click "Sign Up"
2. Enter your email address and create a password
3. Verify your email
4. Sign in to access your dashboard

### First-Time Setup

When you first sign in, Fika automatically creates several default accounts for you:
- **WeChat Pay**
- **Alipay**
- **PayPal**
- **Venmo**
- **Apple Pay**
- **Google Pay**
- **Bank Card**
- **Cash**

You can customize these accounts or create new ones based on your actual payment methods.

**Setting Your Preferences:**

1. Click the ⚙️ **Settings** button in the top-right corner
2. Choose your preferred **Language** (English or Chinese)
3. Select your **Currency** (CNY or USD) - this will be used to display all amounts
4. Set your **Home Timezone** (or let it automatically match your device)

### Understanding the Dashboard Layout

Your dashboard displays key information at a glance:

- **Personal Equity** (main card): Your true net worth from personal accounts
- **Monthly Income** and **Monthly Expenses**: What you've earned and spent this month
- **Subscriptions**: Your recurring service costs
- **Account Selector**: View all your payment accounts
- **Spending Chart**: Visual trends of income vs expenses
- **Category Breakdown**: Where your money goes
- **Personal Equity Trend**: How your net worth changes over time
- **Transaction History**: Recent income and expense entries

---

## Managing Your Accounts

### What Are Accounts?

Accounts represent your payment methods - where your money comes from and where it goes. Examples include:
- Digital wallets (WeChat Pay, Alipay, PayPal)
- Bank accounts
- Credit cards
- Cash
- Investment accounts

### Creating a New Account

1. Click the **Account Selector** card on your dashboard
2. Click the **+** button in the account list
3. Fill in the account details:
   - **Name**: What you want to call this account (e.g., "Chase Checking")
   - **Icon**: Choose an icon that represents the account type
   - **Color**: Pick a color for easy visual identification
   - **Initial Balance**: The starting balance (optional)
   - **Exclude from Equity**: Check this for credit cards or loans (see below)
4. Click **Save**

### Editing an Account

1. Go to the **Account Selector**
2. Click on the account you want to edit
3. Make your changes
4. Click **Save**

### Understanding "Exclude from Equity"

When you create or edit an account, you'll see an option called **"Exclude from Equity"**. This is important for calculating your true net worth.

**Why it matters:**

- **Personal accounts** (checking, savings, cash) = assets that increase your net worth
- **Credit cards** and **loans** = debts that decrease your net worth

If you mark a credit card as "Exclude from Equity," its balance won't count toward your **Personal Equity** (net worth), but it will still appear in your **Total Assets**.

**Example:**
- You have $5,000 in your checking account
- You have a $2,000 credit card balance
- If you mark the credit card as "Exclude from Equity":
  - Personal Equity = $5,000 (only your checking account)
  - Total Assets = $3,000 (checking minus credit card)

This gives you an accurate picture of your true financial position.

### Deleting an Account

You can only delete an account if it has no transactions. If you want to remove an account with transactions, you'll need to delete those transactions first.

---

## Recording Transactions

### Adding a Transaction

1. Click the **Add Transaction** button in the top navigation (looks like a receipt stub)
2. Choose the transaction type:
   - 💚 **Income**: Money you received
   - ❤️ **Expense**: Money you spent
3. Fill in the details:
   - **Amount**: How much (the calculator keypad makes entry easy)
   - **Category**: What type of income/expense (see categories below)
   - **Account**: Which payment method you used
   - **Date**: When the transaction occurred (defaults to today)
   - **Timezone**: Where you were when the transaction happened (defaults to your device timezone)
   - **Currency**: CNY or USD (defaults to your preferred currency)
   - **Note**: Optional description or reminder
4. Click **Save** to record the transaction
5. To add another transaction immediately, click **Add Another** (Continuous Entry Mode)

### Available Categories

**Income Categories:**
- Salary
- Bonus
- Investment
- Gift
- Freelance
- Other

**Expense Categories:**
- Food & Dining
- Transport
- Shopping
- Entertainment
- Utilities
- Health
- Education
- Other

### Editing a Transaction

1. Find the transaction in your **Transaction History**
2. Click on it to open the details
3. Make your changes
4. Click **Save**

### Deleting Transactions

**Delete a single transaction:**
1. Click on the transaction in your history
2. Click the **Delete** button
3. Confirm the deletion

**Batch delete multiple transactions:**
1. In the Transaction History card, click **Select** (top-right)
2. Check the boxes next to transactions you want to delete
3. Use **Shift+Click** to select a range of transactions
4. Click **Delete Selected**
5. Confirm the deletion

### Searching and Filtering Transactions

At the top of the Transaction History card:
- **Search**: Type to find transactions by note, amount, category, or account
- **Type filter**: Show all, only income, or only expenses
- **Account filter**: View transactions for a specific account or all accounts

### Understanding Transaction Dates and Timezones

When you create a transaction, Fika remembers the **local date** (what you saw on your clock) and the **timezone** where you were.

**Important:** Transaction dates stay the same even if you change your timezone later.

**Example:**
- You're in Beijing on December 20 and record an expense
- The transaction is saved as "December 20"
- Later, you travel to New York and change your home timezone to America/New_York
- The transaction still shows as "December 20" (it doesn't change to December 19)

This ensures your financial records always reflect when transactions actually happened in your life.

---

## Understanding Your Dashboard Metrics

### Personal Equity vs Total Assets

Fika shows you two different ways to measure your financial position:

**Personal Equity** = Your true net worth
- Only includes accounts NOT marked as "Exclude from Equity"
- Represents the money you actually own
- Shown in the main card on your dashboard

**Total Assets** = Everything combined
- Includes ALL accounts, even excluded ones
- Might include credit card debt or loans
- Shown as a secondary label when you have excluded accounts

**Example Scenario:**
- Bank Account: $10,000
- Investment Account: $5,000
- Credit Card (excluded): -$2,000

Your dashboard would show:
- **Personal Equity**: $15,000 (bank + investment)
- **Total Assets**: $13,000 (everything combined)

### Two View Modes for Personal Equity

You can toggle between two ways of viewing your equity:

1. **All-Time View**: Total accumulated net worth from all transactions ever
2. **Monthly View**: Net change in equity for the current month only

Click the toggle button on the Personal Equity card to switch between them.

**Example:**
- All-Time View: $25,000 (total net worth)
- Monthly View: +$1,200 (you gained $1,200 this month)

### Monthly Income & Expenses

The Monthly Income and Monthly Expenses cards show your financial activity for the **current month up to today**.

**How it's calculated:**

If today is **January 15**:
- **Monthly Income** = All income from January 1-15
- **Monthly Expenses** = All expenses from January 1-15

The percentage shown (↑ or ↓) compares this period to the **same period last month**:
- January 1-15 compared to December 1-15 (not the full month of December!)

**Example:**
```
Today: January 15

January 1-15 Income: $3,000
December 1-15 Income: $2,500

Percentage change: +20% ↑

(You earned 20% more in the first 15 days of January compared to the first 15 days of December)
```

This "same-period comparison" gives you a more accurate sense of whether your income/expenses are trending up or down.

### How Currency Conversion Works

If your preferred currency is **CNY** but you enter a transaction in **USD** (or vice versa), Fika automatically converts it for display.

**Key Points:**

1. **Historical Rates**: Each transaction uses the exchange rate from **its own date**
2. **Accurate Conversion**: A transaction from December 1 uses December 1's rate, not today's rate
3. **Automatic Updates**: If you change your preferred currency, all amounts re-convert automatically

**Example:**
```
Your preferred currency: CNY

You spent $100 USD on December 1, 2024
- Exchange rate on Dec 1: 1 USD = 7.2 CNY
- Displayed amount: ¥720

Later, you change your preferred currency to USD
- The transaction now displays as: $100

All your CNY transactions convert to USD using their historical rates
```

This ensures your financial history remains accurate regardless of currency fluctuations.

---

## Tracking Subscriptions

### What Are Subscriptions?

Subscriptions are recurring services you pay for regularly, such as:
- Streaming services (Netflix, Spotify, Disney+)
- Software (Adobe, Microsoft 365, iCloud)
- Memberships (gym, Amazon Prime)
- Utilities with regular billing

### Adding a Subscription

1. In the **Subscriptions** card, click the **+** button
2. Fill in the details:
   - **Service Name**: What you're subscribed to (e.g., "Netflix")
   - **Cost**: How much you pay per billing cycle
   - **Currency**: CNY or USD
   - **Billing Cycle**: Monthly or Annual
   - **Next Payment Date**: When is your next bill due?
   - **Icon**: Choose an icon that represents the service
   - **Color**: Pick a color for visual identification
   - **Note**: Optional details about the subscription
3. Click **Save**

### Understanding Subscription Costs

The Subscriptions card shows:
- **Annual Total**: What you'll spend on all subscriptions in a year
- **Monthly Average**: Approximate monthly cost (shown with ~)

**How it's calculated:**

If you have:
- Netflix: $15/month
- Amazon Prime: $139/year

The card displays:
- **Annual Total**: $319 ($15 × 12 + $139)
- **Monthly Average**: ~$26.58 ($319 ÷ 12)

All costs convert to your preferred currency automatically.

### Next Payment Alerts

The Subscriptions card highlights your next upcoming payment with color-coded urgency:

- 🟡 **Yellow background**: Due within 3 days
- 🔴 **Red background**: Overdue (past the payment date)
- ⚪ **Neutral**: More than 3 days away

Days until payment:
- "Due today" = 0 days
- "Due tomorrow" = 1 day
- "3 days" = Due in 3 days
- "Overdue" = Past the due date

### Pausing a Subscription

If you cancel a subscription but want to keep it in your records:

1. Open the Subscriptions modal
2. Click on the subscription
3. Toggle **Active Status** to OFF
4. The subscription won't count toward your totals but remains in your list

### Editing or Deleting a Subscription

1. In the Subscriptions card, click **View All**
2. Click on the subscription you want to modify
3. Make changes or click **Delete**
4. Click **Save**

---

## Viewing Charts & Analytics

### Spending Trends Chart

This chart shows your income and expenses over time as colored area graphs:
- 🟢 **Green area**: Income
- 🔴 **Red area**: Expenses

**Changing the time range:**
- Click the buttons at the top-right: **7**, **14**, **30**, or **90** days

**Summary stats** below the chart show:
- Total Income for the period
- Total Expenses for the period
- Net (Income - Expenses) - positive is good!

**Toggle income/expense lines:**
- Click the legend items to hide/show income or expense areas

**Hover for details:**
- Move your cursor over the chart to see exact amounts for each day

### Category Breakdown Charts

Two pie charts show where your money comes from and goes:
- **Expense Breakdown**: Where you spend money (Food, Transport, Shopping, etc.)
- **Income Breakdown**: Sources of income (Salary, Bonus, Investment, etc.)

Each slice shows:
- Category name
- Amount spent/earned
- Percentage of total

**Hover for details:**
- Move your cursor over a slice to see the exact amount and percentage

The center of each pie shows the **total** for that category type.

### Personal Equity Trend

This chart tracks your net worth over time with three possible lines:
- 🟢 **Green line**: Income
- 🔴 **Red line**: Expenses
- 🟡 **Gold line**: Daily Net (Income - Expenses)

**Changing the time range:**
- Click the buttons: **7**, **14**, **30**, or **90** days

**Toggle lines:**
- Click the legend items to show/hide income, expense, or net lines

**What it shows:**

The chart helps you see patterns:
- Are you consistently earning more than you spend?
- When do your biggest expenses occur?
- Is your net worth trending up or down?

**Note:** If you're viewing a single account marked as "Exclude from Equity" (like a credit card), you'll see a message explaining that equity tracking isn't available for that account.

---

## Settings & Preferences

Access settings by clicking the ⚙️ icon in the top navigation.

### Language Settings

**Switch between English and Chinese:**

1. Open Settings
2. Find the **Language** section
3. Click **English** or **中文** (Chinese)
4. The entire interface updates immediately, including:
   - All buttons and labels
   - Category names
   - Chart labels
   - Date formatting

### Currency Settings

**Choose your preferred currency:**

1. Open Settings
2. Find the **Currency** section
3. Click **CNY (¥)** or **USD ($)**

**What happens when you change currency:**

All amounts throughout the app automatically convert:
- Dashboard metrics
- Transaction amounts
- Subscription costs
- Chart values
- Account balances

Each transaction converts using the historical exchange rate from its date, ensuring accuracy.

**Recording transactions in different currencies:**

Even if your preferred currency is CNY, you can still enter transactions in USD (or vice versa). Just select the currency when creating the transaction. It will display in your preferred currency but remember the original currency internally.

### Timezone Settings

**What is "Home Timezone"?**

Your Home Timezone is the default timezone for new transactions. It's usually set to match your device's timezone, but you can override it if needed.

**Setting your timezone:**

1. Open Settings
2. Find the **Timezone** section
3. Select your timezone from the dropdown (organized by region)

**Timezone Mismatch Alert:**

If your device timezone doesn't match your home timezone (e.g., you traveled), you'll see a yellow alert with:
- Current device timezone
- A **"Sync to device timezone"** button for quick updating

**Why transactions remember their timezone:**

When you create a transaction, it stores:
- The **local date** (what you saw on your clock)
- The **timezone** you were in

This means:
- A transaction recorded as "December 20" in Beijing stays "December 20" even if you later change your home timezone to New York
- Your financial records accurately reflect when transactions occurred in your life

**Example scenario:**
```
You're in Shanghai (Asia/Shanghai timezone)
You record an expense on December 20, 2024

Later, you move to New York
You change your home timezone to America/New_York

The expense still shows as December 20, 2024
(It doesn't change to December 19)
```

### Profile Settings

**Update your display name:**

1. Open Settings
2. Find the **Profile** section
3. Enter your new name in the **Display Name** field
4. Click **Save**

Your display name appears in the dashboard greeting ("Good morning, [Your Name]").

---

## Importing & Exporting Data

### Exporting Transactions

Download all your transactions as a CSV file for backup or analysis.

1. Open Settings
2. Find the **Data Management** section
3. Click **Export Transactions to CSV**
4. A file downloads with all your transaction data

**What's included in the export:**
- Date
- Amount
- Type (Income or Expense)
- Category
- Account
- Currency
- Timezone
- Notes

### Importing Transactions

Bulk add transactions from a CSV file.

**CSV Format Requirements:**

Your CSV file should have these columns (header row required):
```
Date,Amount,Type,Category,Account,Currency,Note
```

**Example:**
```csv
Date,Amount,Type,Category,Account,Currency,Note
2024-01-15,100,expense,Food & Dining,WeChat Pay,CNY,Lunch with friends
2024-01-16,5000,income,Salary,Bank Card,CNY,Monthly salary
```

**Download an example file:**
1. Open Settings → Data Management
2. Click **Download Example CSV** to see the correct format

**Importing your file:**

1. Open Settings → Data Management
2. Click **Import Transactions from CSV**
3. Select your CSV file
4. Review the preview:
   - ✅ Green rows = valid, ready to import
   - ⚠️ Yellow/red rows = errors that need fixing
5. Toggle **Auto-create missing accounts** if you want new accounts created automatically
6. Click **Import Transactions**

**What gets auto-created:**
- Accounts that don't exist yet
- The system matches category names (works with both English and Chinese names)

**Handling errors:**

Common import errors:
- Invalid date format (use YYYY-MM-DD)
- Missing required fields (Amount, Type, Category)
- Invalid category name (must match existing categories)
- Invalid currency (must be CNY or USD)

Fix errors in your CSV file and try importing again.

---

## Common Questions

### About Calculations

**Q: Why does my monthly income show a different number than last month even though I earned the same?**

A: The percentage change compares the same period of days, not full months.

Example: If today is January 15, the app compares:
- January 1-15 (current period)
- December 1-15 (same period last month)

If you earned the same total amount in both full months but the timing was different, the percentages will differ.

---

**Q: Why doesn't my credit card balance count toward my net worth?**

A: Credit cards are debts, not assets. When you mark an account as "Exclude from Equity," it doesn't count toward your Personal Equity (net worth).

- Personal Equity = True net worth (only personal accounts)
- Total Assets = Everything combined (including credit cards)

This distinction helps you see your actual financial position vs your total obligations.

---

**Q: If I change my timezone from Asia/Shanghai to America/New_York, will my transaction dates change?**

A: No. Transactions remember the local date when they were created, regardless of timezone changes.

Example:
- You record an expense in Beijing on December 20
- You later change your timezone to New York
- The transaction still shows December 20 (not December 19)

This ensures your records reflect when transactions actually happened in your life.

---

**Q: When I switch from CNY to USD, how does the app convert my transactions?**

A: Each transaction converts using the historical exchange rate from its date, not today's rate.

Example:
- Transaction from December 1: Uses December 1's exchange rate
- Transaction from January 15: Uses January 15's exchange rate

This ensures accuracy even when exchange rates fluctuate.

---

### About Features

**Q: What's the difference between "All-Time" and "Monthly" equity view?**

A:
- **All-Time View**: Total accumulated net worth from all transactions ever
- **Monthly View**: Net change in equity for the current month only

Example:
- All-Time: $25,000 (your total net worth)
- Monthly: +$1,200 (you gained $1,200 this month)

Toggle between them using the button on the Personal Equity card.

---

**Q: How do I exclude an account like a credit card from my net worth?**

A: When creating or editing an account:
1. Open the account modal
2. Check the box labeled **"Exclude from Equity"**
3. Save

The account will no longer count toward your Personal Equity but will still appear in Total Assets.

---

**Q: Can I enter a transaction in USD even if my preferred currency is CNY?**

A: Yes! When creating a transaction:
1. Select **USD** in the Currency dropdown
2. Enter the amount in USD
3. The transaction will automatically convert to CNY for display using the historical exchange rate from that date

The original USD amount is preserved, so if you later change your preferred currency to USD, it will display accurately.

---

**Q: How do I see transactions for just one account?**

A:
1. Go to the **Account Selector** card
2. Click on the account you want to view
3. The entire dashboard updates to show only that account's:
   - Balance
   - Transactions
   - Charts
   - Monthly income/expenses

To return to viewing all accounts, click **"All Accounts"** in the Account Selector.

---

**Q: Can I change the categories?**

A: Currently, categories are predefined and cannot be customized. This ensures consistency across imports and exports. If you need a category that doesn't exist, use the "Other" category and add details in the Note field.

---

**Q: What happens to my transaction history if I delete an account?**

A: You cannot delete an account if it has transactions. You must first delete all transactions associated with that account, then you can delete the account itself.

If you want to stop using an account without deleting your history, simply stop creating new transactions for that account.

---

## Need Help?

If you have questions not covered in this manual, please reach out to support or consult the in-app help resources.

Happy tracking! ☕
