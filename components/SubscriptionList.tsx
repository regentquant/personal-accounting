"use client";

import { useFika } from "@/context/FikaContext";
import { useI18n } from "@/context/I18nContext";
import { Icon } from "./ui/Icon";
import { cn, formatCurrency as formatCurrencyUtil } from "@/lib/utils";

interface SubscriptionListProps {
  onAddNew: () => void;
}

export function SubscriptionList({ onAddNew }: SubscriptionListProps) {
  const {
    subscriptions,
    setEditingSubscription,
    totalAnnualSubscriptionCost,
    totalMonthlySubscriptionCost,
  } = useFika();
  const { t, formatCurrency } = useI18n();

  const calculateDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const paymentDate = new Date(dateStr);
    paymentDate.setHours(0, 0, 0, 0);
    return Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getDaysUntilLabel = (days: number) => {
    if (days === 0) return t("subscriptions.dueToday");
    if (days === 1) return t("subscriptions.dueTomorrow");
    if (days < 0) return t("subscriptions.overdue");
    return `${days} ${t("subscriptions.days")}`;
  };

  // Sort by next_payment_date ascending
  const sortedSubscriptions = [...subscriptions].sort(
    (a, b) => new Date(a.next_payment_date).getTime() - new Date(b.next_payment_date).getTime()
  );

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-fika-latte/50 flex items-center justify-center">
          <Icon name="RefreshCw" size={32} className="text-fika-cinnamon/50" />
        </div>
        <p className="text-fika-cinnamon mb-4">{t("subscriptions.noSubscriptions")}</p>
        <button
          onClick={onAddNew}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Icon name="Plus" size={18} />
          {t("subscriptions.addFirst")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="p-4 rounded-xl bg-fika-berry/5 border border-fika-berry/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-fika-cinnamon">{t("subscriptions.annualTotal")}</p>
            <p className="text-2xl font-bold text-fika-berry">
              {formatCurrency(totalAnnualSubscriptionCost)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-fika-cinnamon">{t("subscriptions.monthlyAvg")}</p>
            <p className="text-lg font-semibold text-fika-espresso">
              {formatCurrency(totalMonthlySubscriptionCost)}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription List */}
      <div className="space-y-2">
        {sortedSubscriptions.map((sub) => {
          const daysUntil = calculateDaysUntil(sub.next_payment_date);
          const isUrgent = daysUntil <= 3 && daysUntil >= 0;
          const isOverdue = daysUntil < 0;

          return (
            <button
              key={sub.id}
              onClick={() => setEditingSubscription(sub)}
              className={cn(
                "w-full p-4 rounded-xl border-2 transition-all text-left",
                sub.is_active
                  ? "bg-white border-fika-latte hover:border-fika-honey"
                  : "bg-fika-latte/30 border-fika-latte opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${sub.color}20` }}
                  >
                    <Icon name={sub.icon} size={20} color={sub.color} />
                  </div>
                  <div>
                    <p className="font-medium text-fika-espresso">{sub.service_name}</p>
                    <p className="text-xs text-fika-cinnamon">
                      {formatCurrencyUtil(sub.cost, sub.currency === "CNY" ? "¥" : "$")} /{" "}
                      {sub.billing_cycle === "monthly"
                        ? t("subscription.monthly").toLowerCase()
                        : t("subscription.annual").toLowerCase()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isOverdue
                        ? "text-fika-berry"
                        : isUrgent
                        ? "text-fika-honey"
                        : "text-fika-cinnamon"
                    )}
                  >
                    {getDaysUntilLabel(daysUntil)}
                  </p>
                  <p className="text-xs text-fika-cinnamon/60">
                    {new Date(sub.next_payment_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Add Button */}
      <button
        onClick={onAddNew}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Icon name="Plus" size={20} />
        {t("subscriptions.add")}
      </button>
    </div>
  );
}
