"use client";

import { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Icon } from "./ui/Icon";
import { useFika } from "@/context/FikaContext";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";

const ACCOUNT_ICONS = [
  { icon: "MessageCircle", label: "Message" },
  { icon: "Wallet", label: "Wallet" },
  { icon: "CreditCard", label: "Card" },
  { icon: "Banknote", label: "Cash" },
  { icon: "Building2", label: "Bank" },
  { icon: "Landmark", label: "Savings" },
  { icon: "PiggyBank", label: "Piggy" },
  { icon: "Bitcoin", label: "Crypto" },
  { icon: "Smartphone", label: "Mobile" },
  { icon: "Coins", label: "Coins" },
  { icon: "WalletCards", label: "Cards" },
  { icon: "Receipt", label: "Receipt" },
  { icon: "TrendingUp", label: "Invest" },
  { icon: "Briefcase", label: "Business" },
  { icon: "Gift", label: "Gift" },
  { icon: "Heart", label: "Personal" },
];

const ACCOUNT_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#22C55E", // Green
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#38BDF8", // Sky
  "#4F46E5", // Indigo
  "#A855F7", // Purple
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#F43F5E", // Rose
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#FACC15", // Yellow
  "#84CC16", // Lime
  "#92400E", // Brown
  "#64748B", // Slate
  "#374151", // Charcoal
  "#0F172A", // Navy
];

export function AccountModal() {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    addAccount,
    updateAccount,
    editingAccount,
    setEditingAccount,
  } = useFika();
  const { t, currency } = useI18n();

  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Wallet");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [balance, setBalance] = useState("");
  const [excludeFromEquity, setExcludeFromEquity] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingAccount) {
      setName(editingAccount.name);
      setSelectedIcon(editingAccount.icon);
      setSelectedColor(editingAccount.color);
      setBalance(editingAccount.balance.toString());
      setExcludeFromEquity(editingAccount.exclude_from_equity || false);
    } else {
      resetForm();
    }
  }, [editingAccount]);

  const resetForm = () => {
    setName("");
    setSelectedIcon("Wallet");
    setSelectedColor("#3B82F6");
    setBalance("");
    setExcludeFromEquity(false);
  };

  const handleClose = () => {
    setIsAccountModalOpen(false);
    setEditingAccount(null);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingAccount) {
        await updateAccount(editingAccount.id, {
          name: name.trim(),
          icon: selectedIcon,
          color: selectedColor,
          exclude_from_equity: excludeFromEquity,
        });
        // Ensure state update completes before closing
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        await addAccount({
          name: name.trim(),
          icon: selectedIcon,
          color: selectedColor,
          balance: balance ? parseFloat(balance) : 0,
          exclude_from_equity: excludeFromEquity,
        });
      }
      handleClose();
    } catch (error) {
      console.error("Error saving account:", error);
    } finally {
      setLoading(false);
    }
  };

  const isValid = name.trim().length > 0;

  return (
    <Modal
      isOpen={isAccountModalOpen}
      onClose={handleClose}
      title={editingAccount ? t("account.edit") : t("account.new")}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-fika-espresso mb-2">
            {t("account.name")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Investment Account"
            className="input-field"
            autoFocus
          />
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium text-fika-espresso mb-2">
            {t("account.icon")}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {ACCOUNT_ICONS.map(({ icon, label }) => (
              <button
                key={icon}
                type="button"
                onClick={() => setSelectedIcon(icon)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300",
                  selectedIcon === icon
                    ? "bg-fika-honey/20 border-2 border-fika-honey"
                    : "bg-fika-latte/50 border-2 border-transparent hover:bg-fika-latte"
                )}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedColor}20` }}
                >
                  <Icon name={icon} size={20} color={selectedColor} />
                </div>
                <span className="text-xs font-medium text-fika-espresso">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-fika-espresso mb-2">
            {t("account.color")}
          </label>
          <div className="flex gap-2 flex-wrap">
            {ACCOUNT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "w-10 h-10 rounded-xl transition-all duration-300",
                  selectedColor === color
                    ? "ring-2 ring-offset-2 ring-fika-honey scale-110"
                    : "hover:scale-105"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Exclude from Personal Equity Toggle */}
        <div className="p-4 rounded-xl bg-fika-latte/30 border border-fika-latte/50">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2">
                <Icon name="TrendingUp" size={16} className="text-fika-cinnamon" />
                <span className="text-sm font-medium text-fika-espresso">
                  {t("account.excludeFromEquity")}
                </span>
              </div>
              <p className="text-xs text-fika-cinnamon/80 mt-1.5 leading-relaxed">
                {t("account.excludeFromEquityDesc")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setExcludeFromEquity(!excludeFromEquity)}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0",
                excludeFromEquity ? "bg-fika-berry" : "bg-fika-latte"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                  excludeFromEquity ? "right-1 left-auto" : "left-1 right-auto"
                )}
              />
            </button>
          </div>
          {excludeFromEquity && (
            <div className="mt-3 flex items-center gap-2 px-2 py-1.5 rounded-lg bg-fika-berry/10 border border-fika-berry/20">
              <Icon name="AlertCircle" size={14} className="text-fika-berry flex-shrink-0" />
              <span className="text-xs text-fika-berry/90">
                {t("account.excludeFromEquityWarning")}
              </span>
            </div>
          )}
        </div>

        {/* Initial Balance - only show when creating new account */}
        {!editingAccount && (
          <div>
            <label className="block text-sm font-medium text-fika-espresso mb-2">
              {t("account.initialBalance")}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fika-cinnamon text-lg">
                {currency === "CNY" ? "¥" : "$"}
              </span>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="input-field pl-10"
              />
            </div>
          </div>
        )}

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-fika-espresso mb-2">
            {t("account.preview")}
          </label>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-fika-latte/30">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center relative"
              style={{ backgroundColor: `${selectedColor}20` }}
            >
              <Icon name={selectedIcon} size={24} color={selectedColor} />
              {excludeFromEquity && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-fika-berry rounded-full flex items-center justify-center">
                  <Icon name="X" size={10} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-fika-espresso">
                  {name || t("account.name")}
                </p>
                {excludeFromEquity && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-fika-berry/10 text-fika-berry font-medium">
                    {t("account.external")}
                  </span>
                )}
              </div>
              <p className="text-sm text-fika-cinnamon">
                {currency === "CNY" ? "¥" : "$"}{balance || "0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
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
              ? editingAccount
                ? t("account.updating")
                : t("account.creating")
              : editingAccount
              ? t("account.update")
              : t("account.create")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
