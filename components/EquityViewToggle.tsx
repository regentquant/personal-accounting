"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";

type EquityViewMode = "all-time" | "monthly";

interface EquityViewToggleProps {
  value: EquityViewMode;
  onChange: (mode: EquityViewMode) => void;
  className?: string;
}

export function EquityViewToggle({ value, onChange, className }: EquityViewToggleProps) {
  const { t } = useI18n();

  return (
    <div className={cn("flex gap-1.5 p-1 bg-fika-latte rounded-xl", className)}>
      <button
        type="button"
        onClick={() => onChange("all-time")}
        className={cn(
          "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300",
          value === "all-time"
            ? "bg-white text-fika-espresso shadow-soft"
            : "text-fika-cinnamon hover:text-fika-espresso hover:bg-fika-latte/70"
        )}
      >
        {t("dashboard.equity.allTime")}
      </button>
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={cn(
          "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300",
          value === "monthly"
            ? "bg-white text-fika-espresso shadow-soft"
            : "text-fika-cinnamon hover:text-fika-espresso hover:bg-fika-latte/70"
        )}
      >
        {t("dashboard.equity.monthly")}
      </button>
    </div>
  );
}
