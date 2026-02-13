"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useFika } from "@/context/FikaContext";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";
import { Icon } from "./ui/Icon";

type TimeRange = 7 | 14 | 30 | 90;

export function PersonalEquityTrend() {
  const { transactions, personalAccounts, hasExcludedAccounts, activeAccountId, isExcludedAccount } = useFika();
  const { t, currency, convertAmount, formatCurrency } = useI18n();
  const [timeRange, setTimeRange] = useState<TimeRange>(30);
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);
  const [showNet, setShowNet] = useState(true);

  // Get personal account IDs for filtering
  const personalAccountIds = useMemo(() => {
    return new Set(personalAccounts.map((a) => a.id));
  }, [personalAccounts]);

  // Calculate chart data from personal accounts only
  const chartData = useMemo(() => {
    const now = new Date();
    const days = timeRange;
    const data: { date: string; income: number; expense: number; net: number; cumulativeNet: number }[] = [];

    let cumulativeNet = 0;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      // Use local date string (YYYY-MM-DD) instead of UTC
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const displayDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Filter to only include personal account transactions
      // If activeAccountId is set and it's a personal account, use it; otherwise use all personal accounts
      const dayTransactions = transactions.filter((t) => {
        const matchesDate = (t.local_date || t.date) === dateStr;
        
        // Account filtering
        let matchesAccount: boolean;
        if (activeAccountId) {
          // If viewing a specific account, only include if it's personal
          if (isExcludedAccount(activeAccountId)) {
            matchesAccount = false;
          } else {
            matchesAccount = t.account_id === activeAccountId;
          }
        } else {
          // All personal accounts
          matchesAccount = personalAccountIds.has(t.account_id);
        }
        
        return matchesDate && matchesAccount;
      });

      // Convert each transaction to preferred currency before summing
      const income = dayTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + convertAmount(Number(t.amount), t.currency || "CNY", dateStr), 0);

      const expense = dayTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + convertAmount(Number(t.amount), t.currency || "CNY", dateStr), 0);

      const net = income - expense;
      cumulativeNet += net;

      data.push({ 
        date: displayDate, 
        income, 
        expense, 
        net,
        cumulativeNet 
      });
    }

    return data;
  }, [transactions, personalAccountIds, timeRange, activeAccountId, isExcludedAccount, convertAmount]);

  // Calculate summary stats for the selected period
  const summaryStats = useMemo(() => {
    const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
    const totalExpense = chartData.reduce((sum, d) => sum + d.expense, 0);
    const totalNet = totalIncome - totalExpense;
    const avgDailyNet = totalNet / chartData.length || 0;
    return { totalIncome, totalExpense, totalNet, avgDailyNet };
  }, [chartData]);

  // Calculate which date ticks should be shown (always first and last, plus evenly spaced middle ones)
  const xAxisTicks = useMemo(() => {
    const dataLength = chartData.length;
    if (dataLength <= 8) {
      // Show all dates if 8 or fewer
      return chartData.map((d) => d.date);
    }
    // Always include first and last dates
    const tickDates = [chartData[0].date, chartData[dataLength - 1].date];
    // Calculate interval for middle labels (aim for ~4-6 middle labels)
    const middleInterval = Math.floor((dataLength - 2) / 5);
    // Add evenly spaced middle dates
    for (let i = middleInterval; i < dataLength - 1; i += middleInterval) {
      const date = chartData[i].date;
      if (!tickDates.includes(date)) {
        tickDates.push(date);
      }
    }
    // Sort to maintain order (though they should already be in order)
    return tickDates.filter((date) => 
      chartData.some((d) => d.date === date)
    ).sort((a, b) => {
      const indexA = chartData.findIndex((d) => d.date === a);
      const indexB = chartData.findIndex((d) => d.date === b);
      return indexA - indexB;
    });
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      if (!data) return null;

      return (
        <div className="glass-warm rounded-xl p-3 shadow-soft-layered">
          <p className="text-xs font-medium text-fika-espresso mb-2">{label}</p>
          <div className="space-y-1.5">
            {showIncome && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-fika-sage" />
                <span className="text-fika-cinnamon">{t("equity.income")}:</span>
                <span className="font-semibold text-fika-sage">
                  +{formatCurrency(data.income)}
                </span>
              </div>
            )}
            {showExpense && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-fika-berry" />
                <span className="text-fika-cinnamon">{t("equity.expense")}:</span>
                <span className="font-semibold text-fika-berry">
                  -{formatCurrency(data.expense)}
                </span>
              </div>
            )}
            {showNet && (
              <div className="flex items-center gap-2 text-xs border-t border-fika-caramel/30 pt-1.5 mt-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-fika-honey" />
                <span className="text-fika-cinnamon">{t("equity.dailyNet")}:</span>
                <span className={cn(
                  "font-semibold",
                  data.net >= 0 ? "text-fika-sage" : "text-fika-berry"
                )}>
                  {data.net >= 0 ? "+" : ""}{formatCurrency(data.net)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // If viewing an excluded account, show a message
  if (activeAccountId && isExcludedAccount(activeAccountId)) {
    return (
      <div
        className="animate-spring-in animate-delay-300 section-card"
        style={{ animationFillMode: "both" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Icon name="TrendingUp" size={18} className="text-fika-honey" />
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-fika-cinnamon font-medium">
            {t("equity.title")}
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-fika-latte/50 flex items-center justify-center mb-4">
            <Icon name="EyeOff" size={28} className="text-fika-cinnamon/60" />
          </div>
          <p className="text-fika-cinnamon font-medium mb-1">
            {t("equity.excludedAccountTitle")}
          </p>
          <p className="text-sm text-fika-cinnamon/70 max-w-sm">
            {t("equity.excludedAccountDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="animate-spring-in animate-delay-300 section-card"
      style={{ animationFillMode: "both" }}
    >
      {/* Header Row: Title and Info/Toggle buttons */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between mb-2 sm:mb-0">
          <div className="flex items-center gap-2">
            <Icon name="TrendingUp" size={18} className="text-fika-honey" />
            <h3 className="section-header">
              {t("equity.title")}
            </h3>
          </div>

          {/* Top-right: Desktop layout - Range Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Time Range Selector - Desktop: inline with header */}
            <div className="flex gap-1.5 p-1 bg-fika-latte rounded-xl">
              {([7, 14, 30, 90] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300",
                    timeRange === range
                      ? "bg-white text-fika-espresso shadow-soft"
                      : "text-fika-cinnamon hover:text-fika-espresso hover:bg-fika-latte/70"
                  )}
                >
                  {range}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time Range Selector - Mobile: Below title */}
        <div className="flex gap-1.5 p-1 bg-fika-latte rounded-xl w-fit sm:hidden">
          {([7, 14, 30, 90] as TimeRange[]).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300",
                timeRange === range
                  ? "bg-white text-fika-espresso shadow-soft"
                  : "text-fika-cinnamon hover:text-fika-espresso hover:bg-fika-latte/70"
              )}
            >
              {range}d
            </button>
          ))}
        </div>

      </div>

      {/* Summary Stats Row - Compressed grid on mobile, grid on desktop */}
      <div className="mb-4">
        {/* Mobile: Compressed grid layout */}
        <div className="sm:hidden grid grid-cols-3 gap-2 p-2 bg-fika-latte/30 rounded-xl">
          <div className="text-center">
            <p className="text-[10px] text-fika-cinnamon mb-0.5">{t("equity.periodIncome")}</p>
            <p className="text-xs font-semibold text-fika-sage">
              +{formatCurrency(summaryStats.totalIncome)}
            </p>
          </div>
          <div className="text-center border-x border-fika-latte">
            <p className="text-[10px] text-fika-cinnamon mb-0.5">{t("equity.periodExpense")}</p>
            <p className="text-xs font-semibold text-fika-berry">
              -{formatCurrency(summaryStats.totalExpense)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-fika-cinnamon mb-0.5">{t("equity.netChange")}</p>
            <p className={cn(
              "text-xs font-semibold",
              summaryStats.totalNet >= 0 ? "text-fika-sage" : "text-fika-berry"
            )}>
              {summaryStats.totalNet >= 0 ? "+" : ""}{formatCurrency(summaryStats.totalNet)}
            </p>
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-4 p-3 bg-fika-latte/30 rounded-xl">
        <div className="text-center">
          <p className="text-xs text-fika-cinnamon mb-0.5">{t("equity.periodIncome")}</p>
          <p className="text-sm font-semibold text-fika-sage">
            +{formatCurrency(summaryStats.totalIncome)}
          </p>
        </div>
        <div className="text-center border-x border-fika-latte">
          <p className="text-xs text-fika-cinnamon mb-0.5">{t("equity.periodExpense")}</p>
          <p className="text-sm font-semibold text-fika-berry">
            -{formatCurrency(summaryStats.totalExpense)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-fika-cinnamon mb-0.5">{t("equity.netChange")}</p>
          <p className={cn(
            "text-sm font-semibold",
            summaryStats.totalNet >= 0 ? "text-fika-sage" : "text-fika-berry"
          )}>
            {summaryStats.totalNet >= 0 ? "+" : ""}{formatCurrency(summaryStats.totalNet)}
          </p>
        </div>
        </div>
      </div>

      {/* Legend Row */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-3 text-sm">
          <button
            type="button"
            onClick={() => setShowIncome(!showIncome)}
            className={cn(
              "flex items-center gap-2 transition-all cursor-pointer hover:opacity-80",
              !showIncome && "opacity-50"
            )}
          >
            <div className={cn(
              "w-3 h-3 rounded-full bg-fika-sage transition-all",
              !showIncome && "opacity-50"
            )} />
            <span className={cn(
              "text-fika-cinnamon text-xs",
              !showIncome && "line-through opacity-50"
            )}>
              {t("equity.income")}
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => setShowExpense(!showExpense)}
            className={cn(
              "flex items-center gap-2 transition-all cursor-pointer hover:opacity-80",
              !showExpense && "opacity-50"
            )}
          >
            <div className={cn(
              "w-3 h-3 rounded-full bg-fika-berry transition-all",
              !showExpense && "opacity-50"
            )} />
            <span className={cn(
              "text-fika-cinnamon text-xs",
              !showExpense && "line-through opacity-50"
            )}>
              {t("equity.expense")}
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => setShowNet(!showNet)}
            className={cn(
              "flex items-center gap-2 transition-all cursor-pointer hover:opacity-80",
              !showNet && "opacity-50"
            )}
          >
            <div className={cn(
              "w-3 h-3 rounded-full bg-fika-honey transition-all",
              !showNet && "opacity-50"
            )} />
            <span className={cn(
              "text-fika-cinnamon text-xs",
              !showNet && "line-through opacity-50"
            )}>
              {t("equity.net")}
            </span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="equityIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7D9B7A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7D9B7A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="equityExpenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9B5A5A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9B5A5A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="equityNetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4944C" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#D4944C" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(80, 60, 50, 0.08)"
              vertical={false}
              horizontal={true}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#B8A08A", fontSize: 11 }}
              dy={10}
              interval={0}
              ticks={xAxisTicks}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={false}
              width={0}
            />
            <ReferenceLine y={0} stroke="#C4A484" strokeDasharray="3 3" strokeOpacity={0.5} />
            <Tooltip content={<CustomTooltip />} />
            
            {showIncome && (
              <Area
                type="monotoneX"
                dataKey="income"
                stroke="#7D9B7A"
                strokeWidth={2}
                fill="url(#equityIncomeGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#7D9B7A",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            )}

            {showExpense && (
              <Area
                type="monotoneX"
                dataKey="expense"
                stroke="#9B5A5A"
                strokeWidth={2}
                fill="url(#equityExpenseGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#9B5A5A",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            )}

            {showNet && (
              <Area
                type="monotoneX"
                dataKey="net"
                stroke="#D4944C"
                strokeWidth={2.5}
                fill="url(#equityNetGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#D4944C",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

