"use client";

import { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Icon } from "./ui/Icon";
import { useFika } from "@/context/FikaContext";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { Currency } from "@/lib/i18n";
import { SubscriptionList } from "./SubscriptionList";

const SUBSCRIPTION_ICONS = [
  { icon: "Tv", label: "Streaming" },
  { icon: "Music", label: "Music" },
  { icon: "Cloud", label: "Cloud" },
  { icon: "Gamepad2", label: "Gaming" },
  { icon: "Laptop", label: "Software" },
  { icon: "Newspaper", label: "News" },
  { icon: "Dumbbell", label: "Fitness" },
  { icon: "GraduationCap", label: "Learning" },
  { icon: "CreditCard", label: "Service" },
  { icon: "Shield", label: "Security" },
  { icon: "Smartphone", label: "Phone" },
  { icon: "Wifi", label: "Internet" },
];

const SUBSCRIPTION_COLORS = [
  "#E50914", // Netflix red
  "#1DB954", // Spotify green
  "#FF9900", // Amazon orange
  "#00A8E1", // Prime blue
  "#9146FF", // Twitch purple
  "#A855F7", // Purple
  "#3B82F6", // Blue
  "#10B981", // Emerald
];

export function SubscriptionModal() {
  const {
    isSubscriptionModalOpen,
    setIsSubscriptionModalOpen,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    editingSubscription,
    setEditingSubscription,
    activeSubscriptions,
  } = useFika();
  const { t, currency } = useI18n();

  const [showForm, setShowForm] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [cost, setCost] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currency);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("CreditCard");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [note, setNote] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (editingSubscription) {
      setServiceName(editingSubscription.service_name);
      setCost(editingSubscription.cost.toString());
      setSelectedCurrency(editingSubscription.currency as Currency);
      setBillingCycle(editingSubscription.billing_cycle);
      setNextPaymentDate(editingSubscription.next_payment_date);
      setSelectedIcon(editingSubscription.icon);
      setSelectedColor(editingSubscription.color);
      setNote(editingSubscription.note || "");
      setIsActive(editingSubscription.is_active);
      setShowForm(true);
    } else {
      resetForm();
    }
  }, [editingSubscription]);

  const resetForm = () => {
    setServiceName("");
    setCost("");
    setSelectedCurrency(currency);
    setBillingCycle("monthly");
    setNextPaymentDate(getTodayDate());
    setSelectedIcon("CreditCard");
    setSelectedColor("#3B82F6");
    setNote("");
    setIsActive(true);
    setShowDeleteConfirm(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleClose = () => {
    setIsSubscriptionModalOpen(false);
    setEditingSubscription(null);
    setShowForm(false);
    resetForm();
  };

  const handleBackToList = () => {
    setEditingSubscription(null);
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingSubscription) {
        await updateSubscription(editingSubscription.id, {
          service_name: serviceName.trim(),
          cost: parseFloat(cost),
          currency: selectedCurrency,
          billing_cycle: billingCycle,
          next_payment_date: nextPaymentDate,
          icon: selectedIcon,
          color: selectedColor,
          note: note.trim() || null,
          is_active: isActive,
        });
      } else {
        await addSubscription({
          service_name: serviceName.trim(),
          cost: parseFloat(cost),
          currency: selectedCurrency,
          billing_cycle: billingCycle,
          next_payment_date: nextPaymentDate,
          icon: selectedIcon,
          color: selectedColor,
          note: note.trim() || null,
          is_active: isActive,
        });
      }
      handleBackToList();
    } catch (error) {
      console.error("Error saving subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingSubscription) return;
    setLoading(true);
    try {
      await deleteSubscription(editingSubscription.id);
      handleBackToList();
    } catch (error) {
      console.error("Error deleting subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const isValid = serviceName.trim().length > 0 && parseFloat(cost) > 0 && nextPaymentDate;

  // Calculate days until next payment
  const calculateDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const paymentDate = new Date(dateStr);
    paymentDate.setHours(0, 0, 0, 0);
    return Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Form view
  if (showForm) {
    return (
      <Modal
        isOpen={isSubscriptionModalOpen}
        onClose={handleClose}
        title={editingSubscription ? t("subscription.edit") : t("subscription.new")}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Back button for list view */}
          {activeSubscriptions.length > 0 && !editingSubscription && (
            <button
              type="button"
              onClick={handleBackToList}
              className="flex items-center gap-1 text-sm text-fika-cinnamon hover:text-fika-espresso transition-colors"
            >
              <Icon name="ChevronLeft" size={16} />
              {t("subscriptions.viewAll")}
            </button>
          )}

          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-fika-espresso mb-2">
              {t("subscription.serviceName")}
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder={t("subscription.serviceNamePlaceholder")}
              className="input-field"
              autoFocus
            />
          </div>

          {/* Cost and Currency */}
          <div>
            <label className="block text-sm font-medium text-fika-espresso mb-2">
              {t("subscription.cost")}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fika-cinnamon text-lg">
                  {selectedCurrency === "CNY" ? "¥" : "$"}
                </span>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="input-field pl-10"
                />
              </div>
              <div className="flex rounded-xl overflow-hidden border-2 border-fika-latte">
                <button
                  type="button"
                  onClick={() => setSelectedCurrency("CNY")}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1.5",
                    selectedCurrency === "CNY"
                      ? "bg-fika-honey text-white"
                      : "bg-white text-fika-cinnamon hover:bg-fika-latte/50"
                  )}
                >
                  <Image src="/china.svg" alt="CNY" width={16} height={12} className="rounded-sm" />
                  ¥
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCurrency("USD")}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1.5",
                    selectedCurrency === "USD"
                      ? "bg-fika-honey text-white"
                      : "bg-white text-fika-cinnamon hover:bg-fika-latte/50"
                  )}
                >
                  <Image src="/usa.svg" alt="USD" width={16} height={12} className="rounded-sm" />
                  $
                </button>
              </div>
            </div>
          </div>

          {/* Billing Cycle */}
          <div>
            <label className="block text-sm font-medium text-fika-espresso mb-2">
              {t("subscription.billingCycle")}
            </label>
            <div className="flex rounded-xl overflow-hidden border-2 border-fika-latte">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
                  billingCycle === "monthly"
                    ? "bg-fika-honey text-white"
                    : "bg-white text-fika-cinnamon hover:bg-fika-latte/50"
                )}
              >
                {t("subscription.monthly")}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={cn(
                  "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
                  billingCycle === "annual"
                    ? "bg-fika-honey text-white"
                    : "bg-white text-fika-cinnamon hover:bg-fika-latte/50"
                )}
              >
                {t("subscription.annual")}
              </button>
            </div>
          </div>

          {/* Next Payment Date */}
          <div>
            <label className="block text-sm font-medium text-fika-espresso mb-2">
              {t("subscription.nextPayment")}
            </label>
            <input
              type="date"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-fika-espresso mb-2">
              {t("subscription.icon")}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SUBSCRIPTION_ICONS.map(({ icon, label }) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-300",
                    selectedIcon === icon
                      ? "bg-fika-honey/20 border-2 border-fika-honey"
                      : "bg-fika-latte/50 border-2 border-transparent hover:bg-fika-latte"
                  )}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedColor}20` }}
                  >
                    <Icon name={icon} size={18} color={selectedColor} />
                  </div>
                  <span className="text-[10px] font-medium text-fika-espresso truncate w-full text-center">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-fika-espresso mb-2">
              {t("subscription.color")}
            </label>
            <div className="flex gap-2 flex-wrap">
              {SUBSCRIPTION_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-9 h-9 rounded-xl transition-all duration-300",
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-fika-honey scale-110"
                      : "hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-fika-espresso mb-2">
              {t("subscription.note")}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("transaction.notePlaceholder")}
              className="input-field resize-none h-20"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-fika-latte/30">
            <span className="text-sm font-medium text-fika-espresso">
              {t("subscription.active")}
            </span>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors duration-300",
                isActive ? "bg-fika-sage" : "bg-fika-latte"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                  isActive ? "right-1 left-auto" : "left-1 right-auto"
                )}
              />
            </button>
          </div>

          {/* Preview */}
          {serviceName && cost && (
            <div className="p-4 rounded-xl bg-fika-latte/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedColor}20` }}
                  >
                    <Icon name={selectedIcon} size={20} color={selectedColor} />
                  </div>
                  <div>
                    <p className="font-medium text-fika-espresso">{serviceName}</p>
                    <p className="text-xs text-fika-cinnamon">
                      {selectedCurrency === "CNY" ? "¥" : "$"}{cost} / {billingCycle === "monthly" ? t("subscription.monthly").toLowerCase() : t("subscription.annual").toLowerCase()}
                    </p>
                  </div>
                </div>
                {nextPaymentDate && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-fika-espresso">
                      {calculateDaysUntil(nextPaymentDate)} {t("subscriptions.days")}
                    </p>
                    <p className="text-xs text-fika-cinnamon">
                      {new Date(nextPaymentDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delete button for edit mode */}
          {editingSubscription && (
            <div className="pt-2">
              {showDeleteConfirm ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn-secondary flex-1"
                    disabled={loading}
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-fika-berry text-white font-medium hover:bg-fika-berry/90 transition-colors"
                    disabled={loading}
                  >
                    {t("subscription.delete")}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-2.5 px-4 rounded-xl border-2 border-fika-berry/30 text-fika-berry font-medium hover:bg-fika-berry/10 transition-colors"
                  disabled={loading}
                >
                  {t("subscription.delete")}
                </button>
              )}
            </div>
          )}

          {/* Submit buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={editingSubscription ? handleBackToList : handleClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className="btn-primary flex-1"
            >
              {loading
                ? editingSubscription
                  ? t("subscription.updating")
                  : t("subscription.creating")
                : editingSubscription
                ? t("subscription.update")
                : t("subscription.create")}
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  // List view (default)
  return (
    <Modal
      isOpen={isSubscriptionModalOpen}
      onClose={handleClose}
      title={t("subscriptions.title")}
    >
      <div className="space-y-4">
        <SubscriptionList onAddNew={() => setShowForm(true)} />
      </div>
    </Modal>
  );
}
