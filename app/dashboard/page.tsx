"use client";

import { useMemo } from "react";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { AccountSelector } from "@/components/AccountSelector";
import { SpendingChart } from "@/components/SpendingChart";
import { ExpenseBreakdown, IncomeBreakdown } from "@/components/CategoryBreakdown";
import { TransactionHistory } from "@/components/TransactionHistory";
import { TransactionModal } from "@/components/TransactionModal";
import { AccountModal } from "@/components/AccountModal";
import { SettingsModal } from "@/components/SettingsModal";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { HelpModal } from "@/components/HelpModal";
import { PersonalEquityTrend } from "@/components/PersonalEquityTrend";
import { EquityViewToggle } from "@/components/EquityViewToggle";
import { useFika } from "@/context/FikaContext";
import { useI18n } from "@/context/I18nContext";
import { getMonthName } from "@/lib/utils";
import { getMonthYearFromLocalDate, getDeviceTimezone, getLocalDateInTimezone } from "@/lib/timezone";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const {
    personalEquity,
    totalAssets,
    hasExcludedAccounts,
    equityViewMode,
    setEquityViewMode,
    displayedPersonalEquity,
    profile,
    loading,
    transactions,
    activeAccountId,
  } = useFika();
  const { t, convertAmount, formatCurrency } = useI18n();
  const currentMonth = getMonthName(new Date().getMonth());

  // Calculate monthly values with currency conversion and same-period change
  const { monthlyIncome, monthlyExpenses, incomePercentChange, expensePercentChange } = useMemo(() => {
    // Determine current month/year/day using device timezone
    const deviceTz = getDeviceTimezone();
    const todayLocal = getLocalDateInTimezone(deviceTz);
    const { month: currentMonth, year: currentYear } = getMonthYearFromLocalDate(todayLocal);
    
    // Get current day of month (1-31) from local date string (YYYY-MM-DD)
    const currentDay = parseInt(todayLocal.split('-')[2], 10);

    // Calculate previous month/year
    let lastMonth = currentMonth - 1;
    let lastYear = currentYear;
    if (lastMonth < 0) {
      lastMonth = 11;
      lastYear = currentYear - 1;
    }

    // Filter transactions for current month up to current day (same period)
    const monthlyTransactions = transactions.filter((t) => {
      const transactionDate = t.local_date || t.date;
      const { month, year } = getMonthYearFromLocalDate(transactionDate);
      const matchesMonth = month === currentMonth && year === currentYear;
      
      // Get day of month from transaction date (YYYY-MM-DD format)
      const transactionDay = parseInt(transactionDate.split('-')[2], 10);
      const matchesDay = transactionDay <= currentDay;
      
      const matchesAccount = activeAccountId
        ? t.account_id === activeAccountId
        : true;
      return matchesMonth && matchesDay && matchesAccount;
    });

    // Filter transactions for last month up to same day (same period comparison)
    const lastMonthlyTransactions = transactions.filter((t) => {
      const transactionDate = t.local_date || t.date;
      const { month, year } = getMonthYearFromLocalDate(transactionDate);
      const matchesMonth = month === lastMonth && year === lastYear;
      
      // Get day of month from transaction date (YYYY-MM-DD format)
      const transactionDay = parseInt(transactionDate.split('-')[2], 10);
      const matchesDay = transactionDay <= currentDay;
      
      const matchesAccount = activeAccountId
        ? t.account_id === activeAccountId
        : true;
      return matchesMonth && matchesDay && matchesAccount;
    });

    // Calculate current month income and expenses with currency conversion (up to current day)
    const income = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + convertAmount(Number(t.amount), t.currency || "CNY", t.local_date || t.date), 0);

    const expenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + convertAmount(Number(t.amount), t.currency || "CNY", t.local_date || t.date), 0);

    // Calculate last month income and expenses with currency conversion (up to same day)
    const lastMonthIncome = lastMonthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + convertAmount(Number(t.amount), t.currency || "CNY", t.local_date || t.date), 0);

    const lastMonthExpenses = lastMonthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + convertAmount(Number(t.amount), t.currency || "CNY", t.local_date || t.date), 0);

    // Calculate percent change: ((current - last) / last) * 100
    // If last month is 0, return 0 or 100% based on current value
    const incomeChange = lastMonthIncome === 0
      ? (income > 0 ? 100 : 0)
      : ((income - lastMonthIncome) / lastMonthIncome) * 100;

    const expenseChange = lastMonthExpenses === 0
      ? (expenses > 0 ? 100 : 0)
      : ((expenses - lastMonthExpenses) / lastMonthExpenses) * 100;

    return {
      monthlyIncome: income,
      monthlyExpenses: expenses,
      incomePercentChange: Math.round(incomeChange),
      expensePercentChange: Math.round(expenseChange),
    };
  }, [transactions, activeAccountId, convertAmount]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-fika-honey" />
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24 bg-noise min-h-screen">
        {/* Welcome Section */}
        <div className="mb-8 animate-spring-in">
          <h2 className="font-display italic text-2xl sm:text-3xl text-fika-espresso">
            {t(`dashboard.greeting.${getGreeting()}`)},{" "}
            <span className="not-italic font-bold">
              {profile?.display_name?.split(" ")[0] || t("dashboard.friend")}
            </span>{" "}
            ☕
          </h2>
          <p className="text-fika-cinnamon mt-1 text-sm uppercase tracking-wide">
            {t("dashboard.overview")} {currentMonth}
          </p>
        </div>

        {/* Bento Grid Layout - 4 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Personal Equity - full width on md, 2/3 width on lg */}
          <div className="md:col-span-2 lg:col-span-2">
            <StatCard
              title={
                equityViewMode === "monthly"
                  ? t("dashboard.equity.monthlyChange")
                  : t("dashboard.equity.allTimeBalance")
              }
              value={displayedPersonalEquity}
              icon="TrendingUp"
              color="default"
              variant="primary"
              topRight={
                <EquityViewToggle
                  value={equityViewMode}
                  onChange={setEquityViewMode}
                  className="shrink-0 scale-[0.92] origin-top-right"
                />
              }
              trendLabel={
                hasExcludedAccounts
                  ? `${t("dashboard.total")}: ${formatCurrency(totalAssets)}`
                  : equityViewMode === "all-time"
                  ? t("dashboard.acrossAllAccounts")
                  : t("dashboard.equity.currentMonth")
              }
              formatValue={formatCurrency}
              className="h-full lg:min-h-[350px]"
            />
          </div>

          {/* Income & Expenses Container - keeps them always adjacent */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6 h-full">
              {/* Monthly Income */}
              <StatCard
                title={t("dashboard.monthlyIncome")}
                value={monthlyIncome}
                icon="ArrowUpCircle"
                color="income"
                variant="secondary"
                trend={incomePercentChange}
                trendLabel={t("dashboard.samePeriodChange")}
                animationDelay="animate-delay-100"
                formatValue={formatCurrency}
                className="h-full"
              />

              {/* Monthly Expenses */}
              <StatCard
                title={t("dashboard.monthlyExpenses")}
                value={monthlyExpenses}
                icon="ShoppingBag"
                color="expense"
                variant="secondary"
                trend={expensePercentChange}
                trendLabel={t("dashboard.samePeriodChange")}
                animationDelay="animate-delay-200"
                formatValue={formatCurrency}
                className="h-full"
              />
            </div>
          </div>

          {/* Subscriptions Card - full width */}
          <div className="md:col-span-2 lg:col-span-3 card-subtle animate-spring-in animate-delay-300" style={{ animationFillMode: "both" }}>
            <SubscriptionCard />
          </div>

          {/* Row 2: Account Selector */}
          <div className="md:col-span-2 lg:col-span-3">
            <AccountSelector />
          </div>

          {/* Row 3: Spending Chart - Full Width */}
          <div className="md:col-span-2 lg:col-span-3">
            <SpendingChart />
          </div>

          {/* Row 4: Expense and Income Breakdown - 50/50 on large screens, stacked on small */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <ExpenseBreakdown />
              <IncomeBreakdown />
            </div>
          </div>

          {/* Row 5: Personal Equity Trend */}
          <div className="md:col-span-2 lg:col-span-3">
            <PersonalEquityTrend />
          </div>

          {/* Row 6: Transaction History */}
          <div className="md:col-span-2 lg:col-span-3">
            <TransactionHistory />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pb-8 text-center">
          <p className="text-sm text-fika-cinnamon/60">
            {t("footer.madeWith")} ☕ {t("footer.tagline")}
          </p>
        </footer>
      </main>

      {/* Modals */}
      <TransactionModal />
      <AccountModal />
      <SettingsModal />
      <SubscriptionModal />
      <HelpModal />
    </>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
