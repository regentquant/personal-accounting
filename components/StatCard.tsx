"use client";

import type { ReactNode } from "react";
import { cn, formatCurrency as defaultFormatCurrency } from "@/lib/utils";
import { Icon } from "./ui/Icon";

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  trend?: number;
  topRight?: ReactNode;
  trendLabel?: string;
  color?: "default" | "income" | "expense";
  variant?: "primary" | "secondary";
  className?: string;
  animationDelay?: string;
  formatValue?: (value: number) => string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  topRight,
  trendLabel,
  color = "default",
  variant = "secondary",
  className,
  animationDelay,
  formatValue,
}: StatCardProps) {
  const formatCurrency = formatValue || defaultFormatCurrency;

  const colorClasses = {
    default: "text-fika-espresso",
    income: "text-fika-sage",
    expense: "text-fika-berry",
  };

  const iconBgClasses = {
    default: "bg-fika-latte/50 text-fika-espresso",
    income: "bg-fika-sage/15 text-fika-sage",
    expense: "bg-fika-berry/15 text-fika-berry",
  };

  const trendColor = trend && trend > 0 ? "text-fika-sage" : "text-fika-berry";

  return (
    <div
      className={cn(
        "animate-spring-in p-6",
        variant === "primary"
          ? "card-glass min-h-[200px] flex flex-col justify-between"
          : "section-card min-h-[160px]",
        animationDelay,
        className
      )}
      style={{ animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between">
        {/* Icon - smaller, more subtle */}
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl",
            iconBgClasses[color]
          )}
        >
          <Icon name={icon} size={20} />
        </div>

        {topRight ? (
          <div className="flex items-center justify-end shrink-0">
            {topRight}
          </div>
        ) : (
          trend !== undefined && (
            <div className={cn("flex items-center gap-1 text-sm font-medium", trendColor)}>
              <Icon name={trend > 0 ? "ArrowUpRight" : "ArrowDownRight"} size={14} />
              <span>{Math.abs(trend)}%</span>
            </div>
          )
        )}
      </div>

      <div className="mt-4">
        {/* Label - small, uppercase, tracked */}
        <p className="section-header mb-2">
          {title}
        </p>

        {/* Value - HUGE, serif */}
        <p className={cn(
          "number-display font-bold leading-none",
          variant === "primary" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
          colorClasses[color]
        )}>
          {formatCurrency(value)}
        </p>

        {/* Trend label */}
        {trendLabel && (
          <p className="text-[10px] uppercase tracking-wider text-fika-cinnamon/60 mt-2">
            {trendLabel}
          </p>
        )}
      </div>
    </div>
  );
}
