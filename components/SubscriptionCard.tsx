"use client";

import { useFika } from "@/context/FikaContext";
import { useI18n } from "@/context/I18nContext";
import { Icon } from "./ui/Icon";
import { cn } from "@/lib/utils";

export function SubscriptionCard() {
  const {
    activeSubscriptions,
    totalAnnualSubscriptionCost,
    totalMonthlySubscriptionCost,
    upcomingSubscription,
    setIsSubscriptionModalOpen,
  } = useFika();
  const { t, formatCurrency, convertAmount } = useI18n();

  // Calculate days until next payment
  const calculateDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const paymentDate = new Date(dateStr);
    paymentDate.setHours(0, 0, 0, 0);
    return Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysUntilNext = upcomingSubscription
    ? calculateDaysUntil(upcomingSubscription.next_payment_date)
    : null;

  const getDaysUntilLabel = (days: number) => {
    if (days === 0) return t("subscriptions.dueToday");
    if (days === 1) return t("subscriptions.dueTomorrow");
    if (days < 0) return t("subscriptions.overdue");
    return `${days} ${t("subscriptions.days")}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fika-berry/15 flex items-center justify-center">
            <Icon name="RefreshCw" size={20} className="text-fika-berry" />
          </div>
          <div>
            <p className="section-header">
              {t("subscriptions.title")}
            </p>
            <p className="text-xs text-fika-cinnamon/70">
              {activeSubscriptions.length} {t("subscriptions.active")}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsSubscriptionModalOpen(true)}
          className="btn-icon"
          aria-label={t("subscriptions.add")}
        >
          <Icon name="Plus" size={20} className="text-fika-cinnamon" />
        </button>
      </div>

      {/* Annual Total */}
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-wider text-fika-cinnamon/60">{t("subscriptions.annualTotal")}</p>
        <p className="number-display text-3xl font-bold text-fika-berry">
          {formatCurrency(totalAnnualSubscriptionCost)}
        </p>
        <p className="text-[10px] text-fika-cinnamon/50 mt-1">
          ~{formatCurrency(totalMonthlySubscriptionCost)}/{t("subscription.monthly").toLowerCase()}
        </p>
      </div>

      {/* Next Payment Alert */}
      {upcomingSubscription && daysUntilNext !== null && (
        <div
          className={cn(
            "p-3 rounded-xl",
            daysUntilNext <= 3 && daysUntilNext >= 0
              ? "bg-fika-honey/10"
              : daysUntilNext < 0
              ? "bg-fika-berry/10"
              : "bg-fika-latte/50"
          )}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${upcomingSubscription.color}20` }}
            >
              <Icon
                name={upcomingSubscription.icon}
                size={14}
                color={upcomingSubscription.color}
              />
            </div>
            <span className="text-sm font-medium text-fika-espresso truncate flex-1">
              {upcomingSubscription.service_name}
            </span>
          </div>
          <p
            className={cn(
              "text-xs mt-1.5",
              daysUntilNext <= 3 && daysUntilNext >= 0
                ? "text-fika-honey"
                : daysUntilNext < 0
                ? "text-fika-berry"
                : "text-fika-cinnamon"
            )}
          >
            {getDaysUntilLabel(daysUntilNext)}
          </p>
        </div>
      )}

      {/* Empty State */}
      {activeSubscriptions.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-fika-cinnamon mb-2">{t("subscriptions.noSubscriptions")}</p>
          <button
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="text-sm text-fika-honey hover:text-fika-espresso transition-colors"
          >
            {t("subscriptions.addFirst")}
          </button>
        </div>
      )}

      {/* View All Link */}
      {activeSubscriptions.length > 0 && (
        <button
          onClick={() => setIsSubscriptionModalOpen(true)}
          className="w-full mt-4 py-2 text-sm text-fika-honey hover:text-fika-espresso transition-colors"
        >
          {t("subscriptions.viewAll")} →
        </button>
      )}
    </div>
  );
}
