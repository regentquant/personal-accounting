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
} from "recharts";
import { useFika } from "@/context/FikaContext";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";

type TimeRange = 7 | 14 | 30 | 90;

export function SpendingChart() {
  const { transactions, activeAccountId } = useFika();
  const { currency, convertAmount, formatCurrency, t } = useI18n();
  const [timeRange, setTimeRange] = useState<TimeRange>(30);
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);

  const chartData = useMemo(() => {
    const now = new Date();
    const days = timeRange;
    const data: { date: string; income: number; expense: number }[] = [];

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

      const dayTransactions = transactions.filter((t) => {
        // Use local_date (the date in transaction's timezone) for matching
        const transactionDate = t.local_date || t.date;
        const matchesDate = transactionDate === dateStr;
        const matchesAccount = activeAccountId
          ? t.account_id === activeAccountId
          : true;
        return matchesDate && matchesAccount;
      });

      // Convert each transaction to preferred currency before summing
      const income = dayTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + convertAmount(Number(t.amount), t.currency || "CNY", dateStr), 0);

      const expense = dayTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + convertAmount(Number(t.amount), t.currency || "CNY", dateStr), 0);

      data.push({ date: displayDate, income, expense });
    }

    return data;
  }, [transactions, activeAccountId, timeRange, convertAmount]);

  // Calculate summary stats for the selected period
  const summaryStats = useMemo(() => {
    const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
    const totalExpense = chartData.reduce((sum, d) => sum + d.expense, 0);
    const net = totalIncome - totalExpense;
    return { totalIncome, totalExpense, net };
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
      // Filter payload to only show visible lines
      const visiblePayload = payload.filter((item: any) => {
        if (item.dataKey === "income") return showIncome;
        if (item.dataKey === "expense") return showExpense;
        return true;
      });

      if (visiblePayload.length === 0) return null;

      return (
        <div className="glass-warm rounded-xl p-3 shadow-soft-layered">
          <p className="text-xs font-medium text-fika-espresso mb-2">{label}</p>
          <div className="space-y-1.5">
            {showIncome && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-fika-sage" />
                <span className="text-fika-cinnamon">{t("chart.income")}:</span>
                <span className="font-semibold text-fika-sage">
                  {formatCurrency(
                    payload.find((p: any) => p.dataKey === "income")?.value || 0
                  )}
                </span>
              </div>
            )}
            {showExpense && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-fika-berry" />
                <span className="text-fika-cinnamon">{t("chart.expense")}:</span>
                <span className="font-semibold text-fika-berry">
                  {formatCurrency(
                    payload.find((p: any) => p.dataKey === "expense")?.value || 0
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="animate-spring-in animate-delay-200 section-card"
      style={{ animationFillMode: "both" }}
    >
      {/* Top Row: Title on left, Range Switcher on right */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-header">
          {t("chart.spendingTrends")}
        </h3>

        {/* Time Range Selector */}
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

      {/* Sub-Header Row: Legend with Net stat */}
      <div className="flex items-center gap-4 mb-6">
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
              "text-fika-cinnamon",
              !showIncome && "line-through opacity-50"
            )}>
              {t("chart.income")}
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
              "text-fika-cinnamon",
              !showExpense && "line-through opacity-50"
            )}>
              {t("chart.expense")}
            </span>
          </button>
        </div>

        {/* Net Summary Stat */}
        <div className="text-sm">
          <span className="text-fika-cinnamon">Net: </span>
          <span
            className={cn(
              "font-semibold",
              summaryStats.net >= 0 ? "text-fika-sage" : "text-fika-berry"
            )}
          >
            {summaryStats.net >= 0 ? "+" : ""}
            {formatCurrency(summaryStats.net)}
          </span>
        </div>
      </div>

      <div className="h-[200px] sm:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
          >
            {/* Gradient definitions for liquid fill effect */}
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7D9B7A" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#7D9B7A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9B5A5A" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#9B5A5A" stopOpacity={0} />
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
            <Tooltip content={<CustomTooltip />} />
            {showIncome && (
              <Area
                type="monotoneX"
                dataKey="income"
                stroke="#7D9B7A"
                strokeWidth={2.5}
                fill="url(#incomeGradient)"
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
                strokeWidth={2.5}
                fill="url(#expenseGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#9B5A5A",
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
