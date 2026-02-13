"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useFika } from "@/context/FikaContext";
import { useI18n } from "@/context/I18nContext";
import { Icon } from "./ui/Icon";
import { translateCategoryName } from "@/lib/i18n";
import { getMonthYearFromLocalDate, getTodayLocalDate } from "@/lib/timezone";

type BreakdownType = "expense" | "income";

interface BreakdownProps {
  type: BreakdownType;
  titleKey: string;
  emptyKey: string;
  animationDelay?: string;
}

function Breakdown({ type, titleKey, emptyKey, animationDelay = "animate-delay-400" }: BreakdownProps) {
  const { transactions, activeAccountId, categories } = useFika();
  const { convertAmount, formatCurrency, t, language } = useI18n();

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type]
  );

  const categoryData = useMemo(() => {
    // Determine current month/year from local date
    const todayLocal = getTodayLocalDate();
    const { month: currentMonth, year: currentYear } = getMonthYearFromLocalDate(todayLocal);

    // Filter this month's transactions
    const monthlyTransactions = transactions.filter((t) => {
      const transactionDate = t.local_date || t.date;
      const { month, year } = getMonthYearFromLocalDate(transactionDate);
      const matchesMonth = month === currentMonth && year === currentYear;
      const matchesAccount = activeAccountId
        ? t.account_id === activeAccountId
        : true;
      return t.type === type && matchesMonth && matchesAccount;
    });

    // Group by category with currency conversion
    const categoryTotals: Record<string, number> = {};
    monthlyTransactions.forEach((t) => {
      // Convert each transaction to preferred currency
      const convertedAmount = convertAmount(Number(t.amount), t.currency || "CNY", t.local_date || t.date);
      categoryTotals[t.category_id] =
        (categoryTotals[t.category_id] || 0) + convertedAmount;
    });

    // Convert to chart format
    const data = Object.entries(categoryTotals)
      .map(([categoryId, amount]) => {
        const category = filteredCategories.find((c) => c.id === categoryId);
        const categoryName = category?.name || "Other";
        return {
          id: categoryId,
          name: translateCategoryName(categoryName, language),
          value: amount,
          color: category?.color || "#C4A484",
          icon: category?.icon || "MoreHorizontal",
        };
      })
      .sort((a, b) => b.value - a.value);

    return data;
  }, [transactions, activeAccountId, filteredCategories, convertAmount, language, type]);

  const total = useMemo(
    () => categoryData.reduce((sum, c) => sum + c.value, 0),
    [categoryData]
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="glass-warm rounded-xl p-3 shadow-soft-layered">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="text-xs font-medium text-fika-espresso">{data.name}</span>
          </div>
          <p className="text-xs text-fika-cinnamon">
            {formatCurrency(data.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`animate-spring-in section-card ${animationDelay}`}
      style={{ animationFillMode: "both" }}
    >
      <h3 className="text-[11px] uppercase tracking-[0.15em] text-fika-cinnamon font-medium mb-6">
        {t(titleKey)}
      </h3>

      {categoryData.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-fika-latte flex items-center justify-center mb-3">
            <Icon name="PieChart" size={24} className="text-fika-cinnamon" />
          </div>
          <p className="text-sm text-fika-cinnamon">{t(emptyKey)}</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut Chart */}
          <div className="relative w-40 h-40 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label - Dramatic */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[9px] uppercase tracking-wider text-fika-cinnamon">{t("chart.total")}</p>
              <p className="number-display text-xl font-bold text-fika-espresso">
                {formatCurrency(total)}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 w-full grid grid-cols-2 gap-2">
            {categoryData.slice(0, 6).map((category) => {
              const percentage = (
                (category.value / total) *
                100
              ).toFixed(0);
              return (
                <div
                  key={category.id}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-fika-latte/30 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <Icon
                      name={category.icon}
                      size={16}
                      color={category.color}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-fika-espresso">
                      {category.name}
                    </p>
                    <p className="text-xs text-fika-cinnamon">{percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function ExpenseBreakdown() {
  return (
    <Breakdown
      type="expense"
      titleKey="chart.expenseBreakdown"
      emptyKey="chart.noExpenses"
      animationDelay="animate-delay-400"
    />
  );
}

export function IncomeBreakdown() {
  return (
    <Breakdown
      type="income"
      titleKey="chart.incomeBreakdown"
      emptyKey="chart.noIncome"
      animationDelay="animate-delay-500"
    />
  );
}

// Keep CategoryBreakdown for backwards compatibility (deprecated)
export function CategoryBreakdown() {
  return <ExpenseBreakdown />;
}
