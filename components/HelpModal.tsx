"use client";

import { useFika } from "@/context/FikaContext";
import { useI18n } from "@/context/I18nContext";
import { Modal } from "@/components/ui/Modal";
import { Icon } from "@/components/ui/Icon";
import { useState } from "react";

export function HelpModal() {
  const { isHelpModalOpen, setIsHelpModalOpen } = useFika();
  const { t, language } = useI18n();
  const [openSection, setOpenSection] = useState<string | null>("gettingStarted");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <Modal
      isOpen={isHelpModalOpen}
      onClose={() => setIsHelpModalOpen(false)}
      title={t("help.title")}
    >
      <div className="space-y-3">
        {/* Section 1: Getting Started */}
        <HelpSection
          id="gettingStarted"
          title={t("help.gettingStarted")}
          isOpen={openSection === "gettingStarted"}
          onToggle={() => toggleSection("gettingStarted")}
        >
          {language === "en" ? (
            <GettingStartedEN />
          ) : (
            <GettingStartedZH />
          )}
        </HelpSection>

        {/* Section 2: Managing Accounts */}
        <HelpSection
          id="managingAccounts"
          title={t("help.managingAccounts")}
          isOpen={openSection === "managingAccounts"}
          onToggle={() => toggleSection("managingAccounts")}
        >
          {language === "en" ? (
            <ManagingAccountsEN />
          ) : (
            <ManagingAccountsZH />
          )}
        </HelpSection>

        {/* Section 3: Recording Transactions */}
        <HelpSection
          id="recordingTransactions"
          title={t("help.recordingTransactions")}
          isOpen={openSection === "recordingTransactions"}
          onToggle={() => toggleSection("recordingTransactions")}
        >
          {language === "en" ? (
            <RecordingTransactionsEN />
          ) : (
            <RecordingTransactionsZH />
          )}
        </HelpSection>

        {/* Section 4: Dashboard Metrics */}
        <HelpSection
          id="dashboardMetrics"
          title={t("help.dashboardMetrics")}
          isOpen={openSection === "dashboardMetrics"}
          onToggle={() => toggleSection("dashboardMetrics")}
        >
          {language === "en" ? (
            <DashboardMetricsEN />
          ) : (
            <DashboardMetricsZH />
          )}
        </HelpSection>

        {/* Section 5: Subscriptions */}
        <HelpSection
          id="subscriptions"
          title={t("help.subscriptions")}
          isOpen={openSection === "subscriptions"}
          onToggle={() => toggleSection("subscriptions")}
        >
          {language === "en" ? (
            <SubscriptionsEN />
          ) : (
            <SubscriptionsZH />
          )}
        </HelpSection>

        {/* Section 6: Charts & Analytics */}
        <HelpSection
          id="charts"
          title={t("help.charts")}
          isOpen={openSection === "charts"}
          onToggle={() => toggleSection("charts")}
        >
          {language === "en" ? (
            <ChartsEN />
          ) : (
            <ChartsZH />
          )}
        </HelpSection>

        {/* Section 7: Settings & Preferences */}
        <HelpSection
          id="settings"
          title={t("help.settings")}
          isOpen={openSection === "settings"}
          onToggle={() => toggleSection("settings")}
        >
          {language === "en" ? (
            <SettingsEN />
          ) : (
            <SettingsZH />
          )}
        </HelpSection>

        {/* Section 8: Import & Export */}
        <HelpSection
          id="importExport"
          title={t("help.importExport")}
          isOpen={openSection === "importExport"}
          onToggle={() => toggleSection("importExport")}
        >
          {language === "en" ? (
            <ImportExportEN />
          ) : (
            <ImportExportZH />
          )}
        </HelpSection>

        {/* Section 9: FAQ */}
        <HelpSection
          id="faq"
          title={t("help.faq")}
          isOpen={openSection === "faq"}
          onToggle={() => toggleSection("faq")}
        >
          {language === "en" ? (
            <FAQEN />
          ) : (
            <FAQZH />
          )}
        </HelpSection>
      </div>
    </Modal>
  );
}

// Reusable accordion section component
interface HelpSectionProps {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function HelpSection({ title, isOpen, onToggle, children }: HelpSectionProps) {
  return (
    <div className="border-2 border-fika-latte rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-fika-latte/30 hover:bg-fika-latte/50 transition-colors"
      >
        <span className="text-sm font-semibold text-fika-espresso">{title}</span>
        <Icon
          name={isOpen ? "ChevronUp" : "ChevronDown"}
          size={16}
          className="text-fika-cinnamon"
        />
      </button>
      {isOpen && (
        <div className="p-4 space-y-3 text-sm text-fika-espresso bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

// Content Components - English

function GettingStartedEN() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">What is Fika?</h4>
        <p className="text-fika-cinnamon">
          Fika is a personal finance app designed to help you track income and expenses across multiple payment methods, understand your true net worth, and manage recurring subscriptions. The app supports multiple currencies (CNY and USD) and is available in both English and Chinese.
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Creating an Account</h4>
        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon">
          <li>Visit the Fika app and click "Sign Up"</li>
          <li>Enter your email address and create a password</li>
          <li>Verify your email</li>
          <li>Sign in to access your dashboard</li>
        </ol>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">First-Time Setup</h4>
        <p className="text-fika-cinnamon mb-2">
          When you first sign in, Fika automatically creates several default accounts for you: WeChat Pay, Alipay, PayPal, Venmo, Apple Pay, Google Pay, Bank Card, and Cash.
        </p>
        <p className="text-fika-cinnamon mb-2">
          <strong className="text-fika-espresso">Setting Your Preferences:</strong>
        </p>
        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon ml-4">
          <li>Click the ⚙️ Settings button in the top-right corner</li>
          <li>Choose your preferred Language (English or Chinese)</li>
          <li>Select your Currency (CNY or USD)</li>
          <li>Set your Home Timezone (or let it automatically match your device)</li>
        </ol>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Understanding the Dashboard</h4>
        <p className="text-fika-cinnamon mb-2">Your dashboard displays key information at a glance:</p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4">
          <li><strong className="text-fika-espresso">Personal Equity</strong>: Your true net worth from personal accounts</li>
          <li><strong className="text-fika-espresso">Monthly Income & Expenses</strong>: What you've earned and spent this month</li>
          <li><strong className="text-fika-espresso">Subscriptions</strong>: Your recurring service costs</li>
          <li><strong className="text-fika-espresso">Charts</strong>: Visual trends and category breakdowns</li>
          <li><strong className="text-fika-espresso">Transaction History</strong>: Recent income and expense entries</li>
        </ul>
      </div>
    </div>
  );
}

function ManagingAccountsEN() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">What Are Accounts?</h4>
        <p className="text-fika-cinnamon mb-2">
          Accounts represent your payment methods - where your money comes from and where it goes. Examples include digital wallets (WeChat Pay, Alipay), bank accounts, credit cards, cash, and investment accounts.
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Creating a New Account</h4>
        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon">
          <li>Click the Account Selector card on your dashboard</li>
          <li>Click the + button in the account list</li>
          <li>Fill in: Name, Icon, Color, Initial Balance (optional)</li>
          <li>Check "Exclude from Equity" for credit cards or loans</li>
          <li>Click Save</li>
        </ol>
      </div>

      <div className="bg-fika-honey/10 border-2 border-fika-honey/30 rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso flex items-center gap-2">
          <Icon name="AlertCircle" size={16} className="text-fika-honey" />
          Understanding "Exclude from Equity"
        </h4>
        <p className="text-fika-cinnamon mb-2">
          This option is crucial for calculating your true net worth:
        </p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4">
          <li><strong className="text-fika-espresso">Personal accounts</strong> (checking, savings, cash) = assets that increase your net worth</li>
          <li><strong className="text-fika-espresso">Credit cards & loans</strong> = debts that should be excluded</li>
        </ul>
        <p className="text-fika-cinnamon mt-2">
          <strong className="text-fika-espresso">Example:</strong> You have $5,000 in checking and a $2,000 credit card balance. If you mark the credit card as "Exclude from Equity": Personal Equity = $5,000 (only checking), Total Assets = $3,000 (checking minus credit card).
        </p>
      </div>
    </div>
  );
}

function RecordingTransactionsEN() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Adding a Transaction</h4>
        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon">
          <li>Click the Add Transaction button (receipt-style button in header)</li>
          <li>Choose type: Income 💚 or Expense ❤️</li>
          <li>Fill in: Amount, Category, Account, Date, Timezone, Currency, Note (optional)</li>
          <li>Click Save or Add Another for continuous entry</li>
        </ol>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Available Categories</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-fika-espresso mb-1">Income:</p>
            <ul className="list-disc list-inside text-fika-cinnamon text-xs space-y-0.5">
              <li>Salary</li>
              <li>Bonus</li>
              <li>Investment</li>
              <li>Gift</li>
              <li>Freelance</li>
              <li>Other</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-fika-espresso mb-1">Expense:</p>
            <ul className="list-disc list-inside text-fika-cinnamon text-xs space-y-0.5">
              <li>Food & Dining</li>
              <li>Transport</li>
              <li>Shopping</li>
              <li>Entertainment</li>
              <li>Utilities</li>
              <li>Health</li>
              <li>Education</li>
              <li>Other</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-fika-honey/10 border-2 border-fika-honey/30 rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso flex items-center gap-2">
          <Icon name="MapPin" size={16} className="text-fika-honey" />
          Transaction Dates & Timezones
        </h4>
        <p className="text-fika-cinnamon mb-2">
          When you create a transaction, Fika remembers the <strong className="text-fika-espresso">local date</strong> (what you saw on your clock) and the <strong className="text-fika-espresso">timezone</strong> where you were.
        </p>
        <p className="text-fika-cinnamon">
          <strong className="text-fika-espresso">Important:</strong> Transaction dates stay the same even if you change your timezone later. A transaction recorded as "December 20" in Beijing will always show as December 20, even if you later change your home timezone to New York.
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Batch Operations</h4>
        <p className="text-fika-cinnamon mb-2">Delete multiple transactions at once:</p>
        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon">
          <li>In Transaction History, click Select (top-right)</li>
          <li>Check boxes next to transactions (use Shift+Click for range)</li>
          <li>Click Delete Selected and confirm</li>
        </ol>
      </div>
    </div>
  );
}

function DashboardMetricsEN() {
  return (
    <div className="space-y-4">
      <div className="bg-fika-latte/30 border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">Personal Equity vs Total Assets</h4>
        <ul className="space-y-2 text-fika-cinnamon">
          <li>
            <strong className="text-fika-espresso">Personal Equity</strong> = Your true net worth
            <ul className="list-disc list-inside ml-4 mt-1 text-xs">
              <li>Only includes accounts NOT marked as "Exclude from Equity"</li>
              <li>Represents the money you actually own</li>
            </ul>
          </li>
          <li>
            <strong className="text-fika-espresso">Total Assets</strong> = Everything combined
            <ul className="list-disc list-inside ml-4 mt-1 text-xs">
              <li>Includes ALL accounts, even excluded ones</li>
              <li>Might include credit card debt or loans</li>
            </ul>
          </li>
        </ul>
        <div className="mt-3 p-2 bg-white rounded text-xs">
          <p className="font-medium text-fika-espresso mb-1">Example:</p>
          <p className="text-fika-cinnamon">Bank: $10,000 | Investment: $5,000 | Credit Card (excluded): -$2,000</p>
          <p className="text-fika-espresso mt-1">→ Personal Equity: $15,000 | Total Assets: $13,000</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Monthly Income & Expenses</h4>
        <p className="text-fika-cinnamon mb-2">
          Shows your financial activity for the <strong className="text-fika-espresso">current month up to today</strong>.
        </p>
        <div className="bg-white border border-fika-latte rounded p-2 text-xs">
          <p className="text-fika-espresso mb-1">If today is January 15:</p>
          <ul className="list-disc list-inside text-fika-cinnamon space-y-0.5">
            <li>Monthly Income = All income from Jan 1-15</li>
            <li>Monthly Expenses = All expenses from Jan 1-15</li>
            <li>Percentage compares to Dec 1-15 (same 15-day period last month)</li>
          </ul>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Currency Conversion</h4>
        <p className="text-fika-cinnamon mb-2">
          All amounts convert to your preferred currency using <strong className="text-fika-espresso">historical exchange rates</strong>.
        </p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4 text-xs">
          <li>Each transaction uses the rate from its own date</li>
          <li>A Dec 1 transaction uses Dec 1's rate, not today's rate</li>
          <li>If you change preferred currency, all amounts re-convert automatically</li>
        </ul>
      </div>
    </div>
  );
}

function SubscriptionsEN() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">What Are Subscriptions?</h4>
        <p className="text-fika-cinnamon mb-2">
          Track recurring services you pay for regularly: streaming (Netflix, Spotify), software (Adobe, Microsoft 365), memberships, and utilities.
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Adding a Subscription</h4>
        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon">
          <li>In Subscriptions card, click the + button</li>
          <li>Fill in: Service Name, Cost, Currency, Billing Cycle (Monthly/Annual)</li>
          <li>Set Next Payment Date</li>
          <li>Choose Icon and Color</li>
          <li>Click Save</li>
        </ol>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Cost Calculations</h4>
        <div className="bg-white border border-fika-latte rounded p-2 text-xs">
          <p className="text-fika-espresso mb-1">Example:</p>
          <p className="text-fika-cinnamon">Netflix: $15/month | Amazon Prime: $139/year</p>
          <p className="text-fika-espresso mt-1">→ Annual Total: $319 ($15 × 12 + $139)</p>
          <p className="text-fika-espresso">→ Monthly Average: ~$26.58 ($319 ÷ 12)</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Payment Alerts</h4>
        <ul className="space-y-1 text-fika-cinnamon text-xs">
          <li>🟡 <strong className="text-fika-espresso">Yellow</strong>: Due within 3 days</li>
          <li>🔴 <strong className="text-fika-espresso">Red</strong>: Overdue (past payment date)</li>
          <li>⚪ <strong className="text-fika-espresso">Neutral</strong>: More than 3 days away</li>
        </ul>
      </div>
    </div>
  );
}

function ChartsEN() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Spending Trends Chart</h4>
        <p className="text-fika-cinnamon mb-2">
          Shows income (green) and expenses (red) over time as area graphs.
        </p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4 text-xs">
          <li>Change time range: 7, 14, 30, or 90 days</li>
          <li>Toggle lines on/off by clicking legend items</li>
          <li>Hover over chart to see exact daily amounts</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Category Breakdown</h4>
        <p className="text-fika-cinnamon mb-2">
          Pie charts show where your money comes from (income) and goes (expenses).
        </p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4 text-xs">
          <li>Each slice shows category, amount, and percentage</li>
          <li>Hover to see detailed information</li>
          <li>Center displays total for that category type</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Personal Equity Trend</h4>
        <p className="text-fika-cinnamon mb-2">
          Tracks your net worth over time with income (green), expense (red), and net (gold) lines.
        </p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4 text-xs">
          <li>See patterns: earning more than spending?</li>
          <li>Identify when biggest expenses occur</li>
          <li>Track if net worth is trending up or down</li>
        </ul>
      </div>
    </div>
  );
}

function SettingsEN() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Language Settings</h4>
        <p className="text-fika-cinnamon mb-2">
          Switch between English and Chinese. The entire interface updates immediately, including buttons, labels, category names, and date formatting.
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Currency Settings</h4>
        <p className="text-fika-cinnamon mb-2">
          Choose CNY (¥) or USD ($) as your preferred currency. All amounts automatically convert throughout the app.
        </p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4 text-xs">
          <li>Dashboard metrics, transactions, subscriptions, charts all convert</li>
          <li>You can still enter transactions in different currencies</li>
          <li>Each transaction uses historical exchange rate from its date</li>
        </ul>
      </div>

      <div className="bg-fika-honey/10 border-2 border-fika-honey/30 rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso flex items-center gap-2">
          <Icon name="MapPin" size={16} className="text-fika-honey" />
          Timezone Settings
        </h4>
        <p className="text-fika-cinnamon mb-2">
          <strong className="text-fika-espresso">Home Timezone:</strong> Default timezone for new transactions. Usually matches your device timezone.
        </p>
        <p className="text-fika-cinnamon mb-2">
          <strong className="text-fika-espresso">Timezone Mismatch Alert:</strong> If device timezone differs from home timezone (e.g., you traveled), you'll see an alert with a "Sync to device timezone" button.
        </p>
        <p className="text-fika-cinnamon">
          <strong className="text-fika-espresso">Important:</strong> Transactions remember their original timezone. A transaction recorded as "Dec 20" in Shanghai stays "Dec 20" even if you later change to New York timezone.
        </p>
      </div>
    </div>
  );
}

function ImportExportEN() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Exporting Transactions</h4>
        <p className="text-fika-cinnamon mb-2">
          Download all transactions as CSV: Settings → Data Management → Export Transactions to CSV
        </p>
        <p className="text-fika-cinnamon text-xs">
          Includes: Date, Amount, Type, Category, Account, Currency, Timezone, Notes
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Importing Transactions</h4>
        <p className="text-fika-cinnamon mb-2">Bulk add transactions from CSV file.</p>

        <div className="bg-fika-latte/50 px-3 py-2 rounded text-xs font-mono mb-2">
          <div className="text-fika-espresso mb-1">CSV Format Required:</div>
          <div className="text-fika-cinnamon">Date,Amount,Type,Category,Account,Currency,Note</div>
          <div className="text-fika-cinnamon">2024-01-15,100,expense,Food & Dining,WeChat Pay,CNY,Lunch</div>
        </div>

        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon text-xs">
          <li>Settings → Data Management → Import Transactions from CSV</li>
          <li>Select your CSV file</li>
          <li>Review preview (green = valid, red/yellow = errors)</li>
          <li>Toggle "Auto-create missing accounts" if needed</li>
          <li>Click Import Transactions</li>
        </ol>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">Common Import Errors</h4>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4 text-xs">
          <li>Invalid date format (use YYYY-MM-DD)</li>
          <li>Missing required fields (Amount, Type, Category)</li>
          <li>Invalid category name</li>
          <li>Invalid currency (must be CNY or USD)</li>
        </ul>
      </div>
    </div>
  );
}

function FAQEN() {
  return (
    <div className="space-y-4">
      <div className="bg-white border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">Why does my monthly income show a different percentage even though I earned the same?</h4>
        <p className="text-fika-cinnamon text-sm">
          The percentage compares the same period of days, not full months. If today is Jan 15, it compares Jan 1-15 to Dec 1-15. If your income timing was different between those periods, the percentages will differ.
        </p>
      </div>

      <div className="bg-white border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">Why doesn't my credit card balance count toward my net worth?</h4>
        <p className="text-fika-cinnamon text-sm">
          Credit cards are debts, not assets. When marked as "Exclude from Equity," they don't count toward Personal Equity (net worth) but still appear in Total Assets.
        </p>
      </div>

      <div className="bg-white border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">If I change timezone, will my transaction dates change?</h4>
        <p className="text-fika-cinnamon text-sm">
          No. Transactions remember the local date when created, regardless of timezone changes. A transaction recorded as "Dec 20" in Beijing stays "Dec 20" even if you later change to New York timezone.
        </p>
      </div>

      <div className="bg-white border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">How does currency conversion work?</h4>
        <p className="text-fika-cinnamon text-sm">
          Each transaction converts using the historical exchange rate from its date, not today's rate. This ensures accuracy even when exchange rates fluctuate.
        </p>
      </div>

      <div className="bg-white border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">What's the difference between "All-Time" and "Monthly" equity view?</h4>
        <p className="text-fika-cinnamon text-sm">
          All-Time shows total accumulated net worth from all transactions ever. Monthly shows only this month's change in equity. Toggle between them on the Personal Equity card.
        </p>
      </div>

      <div className="bg-white border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">Can I enter a transaction in USD if my preferred currency is CNY?</h4>
        <p className="text-fika-cinnamon text-sm">
          Yes! Select USD when creating the transaction. It will automatically convert to CNY for display using the historical exchange rate from that date.
        </p>
      </div>
    </div>
  );
}

// Content Components - Chinese (simplified versions - can be expanded with full Chinese translations)

function GettingStartedZH() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">什么是 Fika？</h4>
        <p className="text-fika-cinnamon">
          Fika 是一款个人财务应用程序，帮助您跨多种支付方式跟踪收入和支出、了解真实净资产并管理定期订阅。该应用支持多种货币（人民币和美元），提供中英文双语界面。
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">创建账户</h4>
        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon">
          <li>访问 Fika 应用并点击"注册"</li>
          <li>输入您的电子邮件地址并创建密码</li>
          <li>验证您的电子邮件</li>
          <li>登录以访问您的仪表盘</li>
        </ol>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">首次设置</h4>
        <p className="text-fika-cinnamon mb-2">
          首次登录时，Fika 会自动为您创建几个默认账户：微信支付、支付宝、PayPal、Venmo、Apple Pay、Google Pay、银行卡和现金。
        </p>
        <p className="text-fika-cinnamon mb-2">
          <strong className="text-fika-espresso">设置您的偏好：</strong>
        </p>
        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon ml-4">
          <li>点击右上角的 ⚙️ 设置按钮</li>
          <li>选择您的首选语言（英语或中文）</li>
          <li>选择您的货币（CNY 或 USD）</li>
          <li>设置您的主时区（或让其自动匹配您的设备）</li>
        </ol>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">了解仪表盘</h4>
        <p className="text-fika-cinnamon mb-2">仪表盘一目了然地显示关键信息：</p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4">
          <li><strong className="text-fika-espresso">个人净资产</strong>：来自个人账户的真实净资产</li>
          <li><strong className="text-fika-espresso">月收入和支出</strong>：本月的收入和支出</li>
          <li><strong className="text-fika-espresso">订阅</strong>：定期服务费用</li>
          <li><strong className="text-fika-espresso">图表</strong>：可视化趋势和类别细分</li>
          <li><strong className="text-fika-espresso">交易历史</strong>：最近的收入和支出条目</li>
        </ul>
      </div>
    </div>
  );
}

function ManagingAccountsZH() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">什么是账户？</h4>
        <p className="text-fika-cinnamon mb-2">
          账户代表您的支付方式 - 您的钱从哪里来，到哪里去。示例包括数字钱包（微信支付、支付宝）、银行账户、信用卡、现金和投资账户。
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">创建新账户</h4>
        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon">
          <li>点击仪表盘上的账户选择器卡</li>
          <li>点击账户列表中的 + 按钮</li>
          <li>填写：名称、图标、颜色、初始余额（可选）</li>
          <li>对于信用卡或贷款，勾选"从净资产中排除"</li>
          <li>点击保存</li>
        </ol>
      </div>

      <div className="bg-fika-honey/10 border-2 border-fika-honey/30 rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso flex items-center gap-2">
          <Icon name="AlertCircle" size={16} className="text-fika-honey" />
          理解"从净资产中排除"
        </h4>
        <p className="text-fika-cinnamon mb-2">
          此选项对于计算您的真实净资产至关重要：
        </p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4">
          <li><strong className="text-fika-espresso">个人账户</strong>（支票、储蓄、现金）= 增加您净资产的资产</li>
          <li><strong className="text-fika-espresso">信用卡和贷款</strong> = 应该排除的债务</li>
        </ul>
        <p className="text-fika-cinnamon mt-2">
          <strong className="text-fika-espresso">示例：</strong>您有 $5,000 在支票账户和 $2,000 信用卡余额。如果您将信用卡标记为"从净资产中排除"：个人净资产 = $5,000（仅支票），总资产 = $3,000（支票减去信用卡）。
        </p>
      </div>
    </div>
  );
}

function RecordingTransactionsZH() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">添加交易</h4>
        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon">
          <li>点击添加交易按钮（标题中的票据样式按钮）</li>
          <li>选择类型：收入 💚 或支出 ❤️</li>
          <li>填写：金额、类别、账户、日期、时区、货币、备注（可选）</li>
          <li>点击保存或添加另一个以连续输入</li>
        </ol>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">可用类别</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-fika-espresso mb-1">收入：</p>
            <ul className="list-disc list-inside text-fika-cinnamon text-xs space-y-0.5">
              <li>工资</li>
              <li>奖金</li>
              <li>投资</li>
              <li>礼物</li>
              <li>自由职业</li>
              <li>其他</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-fika-espresso mb-1">支出：</p>
            <ul className="list-disc list-inside text-fika-cinnamon text-xs space-y-0.5">
              <li>餐饮</li>
              <li>交通</li>
              <li>购物</li>
              <li>娱乐</li>
              <li>水电费</li>
              <li>健康</li>
              <li>教育</li>
              <li>其他</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-fika-honey/10 border-2 border-fika-honey/30 rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso flex items-center gap-2">
          <Icon name="MapPin" size={16} className="text-fika-honey" />
          交易日期和时区
        </h4>
        <p className="text-fika-cinnamon mb-2">
          创建交易时，Fika 会记住<strong className="text-fika-espresso">本地日期</strong>（您在时钟上看到的内容）和您所在的<strong className="text-fika-espresso">时区</strong>。
        </p>
        <p className="text-fika-cinnamon">
          <strong className="text-fika-espresso">重要：</strong>即使您稍后更改时区，交易日期也保持不变。在北京记录为"12月20日"的交易将始终显示为12月20日，即使您稍后将主时区更改为纽约。
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">批量操作</h4>
        <p className="text-fika-cinnamon mb-2">一次删除多个交易：</p>
        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon">
          <li>在交易历史中，点击选择（右上角）</li>
          <li>勾选交易旁边的框（使用 Shift+点击进行范围选择）</li>
          <li>点击删除所选并确认</li>
        </ol>
      </div>
    </div>
  );
}

function DashboardMetricsZH() {
  return (
    <div className="space-y-4">
      <div className="bg-fika-latte/30 border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">个人净资产 vs 总资产</h4>
        <ul className="space-y-2 text-fika-cinnamon">
          <li>
            <strong className="text-fika-espresso">个人净资产</strong> = 您的真实净资产
            <ul className="list-disc list-inside ml-4 mt-1 text-xs">
              <li>仅包括未标记为"从净资产中排除"的账户</li>
              <li>代表您实际拥有的金钱</li>
            </ul>
          </li>
          <li>
            <strong className="text-fika-espresso">总资产</strong> = 所有账户总和
            <ul className="list-disc list-inside ml-4 mt-1 text-xs">
              <li>包括所有账户，甚至被排除的账户</li>
              <li>可能包括信用卡债务或贷款</li>
            </ul>
          </li>
        </ul>
        <div className="mt-3 p-2 bg-white rounded text-xs">
          <p className="font-medium text-fika-espresso mb-1">示例：</p>
          <p className="text-fika-cinnamon">银行：$10,000 | 投资：$5,000 | 信用卡（已排除）：-$2,000</p>
          <p className="text-fika-espresso mt-1">→ 个人净资产：$15,000 | 总资产：$13,000</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">月收入和支出</h4>
        <p className="text-fika-cinnamon mb-2">
          显示<strong className="text-fika-espresso">本月到今天</strong>的财务活动。
        </p>
        <div className="bg-white border border-fika-latte rounded p-2 text-xs">
          <p className="text-fika-espresso mb-1">如果今天是1月15日：</p>
          <ul className="list-disc list-inside text-fika-cinnamon space-y-0.5">
            <li>月收入 = 1月1-15日的所有收入</li>
            <li>月支出 = 1月1-15日的所有支出</li>
            <li>百分比与12月1-15日（上个月的相同15天期间）比较</li>
          </ul>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">货币转换</h4>
        <p className="text-fika-cinnamon mb-2">
          所有金额使用<strong className="text-fika-espresso">历史汇率</strong>转换为您的首选货币。
        </p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4 text-xs">
          <li>每笔交易使用其自己日期的汇率</li>
          <li>12月1日的交易使用12月1日的汇率，而不是今天的汇率</li>
          <li>如果您更改首选货币，所有金额会自动重新转换</li>
        </ul>
      </div>
    </div>
  );
}

function SubscriptionsZH() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">什么是订阅？</h4>
        <p className="text-fika-cinnamon mb-2">
          跟踪您定期支付的服务：流媒体（Netflix、Spotify）、软件（Adobe、Microsoft 365）、会员资格和水电费。
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">添加订阅</h4>
        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon">
          <li>在订阅卡中，点击 + 按钮</li>
          <li>填写：服务名称、费用、货币、计费周期（月度/年度）</li>
          <li>设置下次付款日期</li>
          <li>选择图标和颜色</li>
          <li>点击保存</li>
        </ol>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">费用计算</h4>
        <div className="bg-white border border-fika-latte rounded p-2 text-xs">
          <p className="text-fika-espresso mb-1">示例：</p>
          <p className="text-fika-cinnamon">Netflix：$15/月 | Amazon Prime：$139/年</p>
          <p className="text-fika-espresso mt-1">→ 年度总计：$319（$15 × 12 + $139）</p>
          <p className="text-fika-espresso">→ 月平均：~$26.58（$319 ÷ 12）</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">付款提醒</h4>
        <ul className="space-y-1 text-fika-cinnamon text-xs">
          <li>🟡 <strong className="text-fika-espresso">黄色</strong>：3天内到期</li>
          <li>🔴 <strong className="text-fika-espresso">红色</strong>：逾期（超过付款日期）</li>
          <li>⚪ <strong className="text-fika-espresso">中性</strong>：超过3天</li>
        </ul>
      </div>
    </div>
  );
}

function ChartsZH() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">支出趋势图</h4>
        <p className="text-fika-cinnamon mb-2">
          以面积图的形式显示一段时间内的收入（绿色）和支出（红色）。
        </p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4 text-xs">
          <li>更改时间范围：7、14、30 或 90 天</li>
          <li>点击图例项目切换线条开/关</li>
          <li>将鼠标悬停在图表上以查看确切的每日金额</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">类别细分</h4>
        <p className="text-fika-cinnamon mb-2">
          饼图显示您的钱从哪里来（收入）和去哪里（支出）。
        </p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4 text-xs">
          <li>每个切片显示类别、金额和百分比</li>
          <li>悬停以查看详细信息</li>
          <li>中心显示该类别类型的总计</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">个人净资产趋势</h4>
        <p className="text-fika-cinnamon mb-2">
          使用收入（绿色）、支出（红色）和净额（金色）线跟踪一段时间内的净资产。
        </p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4 text-xs">
          <li>查看模式：收入是否超过支出？</li>
          <li>识别最大支出发生的时间</li>
          <li>跟踪净资产是上升还是下降</li>
        </ul>
      </div>
    </div>
  );
}

function SettingsZH() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">语言设置</h4>
        <p className="text-fika-cinnamon mb-2">
          在英语和中文之间切换。整个界面立即更新，包括按钮、标签、类别名称和日期格式。
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">货币设置</h4>
        <p className="text-fika-cinnamon mb-2">
          选择 CNY（¥）或 USD（$）作为您的首选货币。应用程序中的所有金额会自动转换。
        </p>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4 text-xs">
          <li>仪表盘指标、交易、订阅、图表都会转换</li>
          <li>您仍然可以以不同货币输入交易</li>
          <li>每笔交易使用其日期的历史汇率</li>
        </ul>
      </div>

      <div className="bg-fika-honey/10 border-2 border-fika-honey/30 rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso flex items-center gap-2">
          <Icon name="MapPin" size={16} className="text-fika-honey" />
          时区设置
        </h4>
        <p className="text-fika-cinnamon mb-2">
          <strong className="text-fika-espresso">主时区：</strong>新交易的默认时区。通常与您的设备时区匹配。
        </p>
        <p className="text-fika-cinnamon mb-2">
          <strong className="text-fika-espresso">时区不匹配警报：</strong>如果设备时区与主时区不同（例如，您旅行了），您将看到一个带有"同步到设备时区"按钮的警报。
        </p>
        <p className="text-fika-cinnamon">
          <strong className="text-fika-espresso">重要：</strong>交易记住其原始时区。在上海记录为"12月20日"的交易即使稍后更改为纽约时区也会保持"12月20日"。
        </p>
      </div>
    </div>
  );
}

function ImportExportZH() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">导出交易</h4>
        <p className="text-fika-cinnamon mb-2">
          下载所有交易为 CSV：设置 → 数据管理 → 导出交易到 CSV
        </p>
        <p className="text-fika-cinnamon text-xs">
          包括：日期、金额、类型、类别、账户、货币、时区、备注
        </p>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">导入交易</h4>
        <p className="text-fika-cinnamon mb-2">从 CSV 文件批量添加交易。</p>

        <div className="bg-fika-latte/50 px-3 py-2 rounded text-xs font-mono mb-2">
          <div className="text-fika-espresso mb-1">所需 CSV 格式：</div>
          <div className="text-fika-cinnamon">Date,Amount,Type,Category,Account,Currency,Note</div>
          <div className="text-fika-cinnamon">2024-01-15,100,expense,餐饮,微信支付,CNY,午餐</div>
        </div>

        <ol className="list-decimal list-inside space-y-1 text-fika-cinnamon text-xs">
          <li>设置 → 数据管理 → 从 CSV 导入交易</li>
          <li>选择您的 CSV 文件</li>
          <li>查看预览（绿色 = 有效，红色/黄色 = 错误）</li>
          <li>如果需要，切换"自动创建缺失账户"</li>
          <li>点击导入交易</li>
        </ol>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-fika-espresso">常见导入错误</h4>
        <ul className="list-disc list-inside space-y-1 text-fika-cinnamon ml-4 text-xs">
          <li>无效的日期格式（使用 YYYY-MM-DD）</li>
          <li>缺少必填字段（金额、类型、类别）</li>
          <li>无效的类别名称</li>
          <li>无效的货币（必须是 CNY 或 USD）</li>
        </ul>
      </div>
    </div>
  );
}

function FAQZH() {
  return (
    <div className="space-y-4">
      <div className="bg-white border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">为什么即使我赚了相同的钱，我的月收入显示不同的百分比？</h4>
        <p className="text-fika-cinnamon text-sm">
          百分比比较的是相同的天数期间，而不是整个月。如果今天是1月15日，它会将1月1-15日与12月1-15日进行比较。如果您的收入时间在这些期间之间不同，百分比就会不同。
        </p>
      </div>

      <div className="bg-white border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">为什么我的信用卡余额不计入我的净资产？</h4>
        <p className="text-fika-cinnamon text-sm">
          信用卡是债务，不是资产。当标记为"从净资产中排除"时，它们不计入个人净资产（净值），但仍出现在总资产中。
        </p>
      </div>

      <div className="bg-white border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">如果我更改时区，我的交易日期会改变吗？</h4>
        <p className="text-fika-cinnamon text-sm">
          不会。交易记住创建时的本地日期，无论时区更改如何。在北京记录为"12月20日"的交易即使稍后更改为纽约时区也会保持"12月20日"。
        </p>
      </div>

      <div className="bg-white border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">货币转换如何工作？</h4>
        <p className="text-fika-cinnamon text-sm">
          每笔交易使用其日期的历史汇率进行转换，而不是今天的汇率。这确保了即使汇率波动也能保持准确性。
        </p>
      </div>

      <div className="bg-white border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">"全部时间"和"月度"净资产视图有什么区别？</h4>
        <p className="text-fika-cinnamon text-sm">
          全部时间显示所有交易的总累积净资产。月度仅显示本月的净资产变化。在个人净资产卡上在它们之间切换。
        </p>
      </div>

      <div className="bg-white border-2 border-fika-latte rounded-lg p-3">
        <h4 className="font-semibold mb-2 text-fika-espresso">如果我的首选货币是 CNY，我可以以 USD 输入交易吗？</h4>
        <p className="text-fika-cinnamon text-sm">
          可以！创建交易时选择 USD。它将使用该日期的历史汇率自动转换为 CNY 进行显示。
        </p>
      </div>
    </div>
  );
}
