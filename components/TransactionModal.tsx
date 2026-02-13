"use client";

import { useState, useEffect, useRef } from "react";
import { Modal } from "./ui/Modal";
import { Icon } from "./ui/Icon";
import { CalculatorKeypad } from "./CalculatorKeypad";
import { useFika } from "@/context/FikaContext";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";
import { getTodayLocalDate } from "@/lib/timezone";
import Image from "next/image";
import type { Currency } from "@/lib/i18n";
import { translateCategoryName } from "@/lib/i18n";

type TransactionType = "income" | "expense";

export function TransactionModal() {
  const {
    isTransactionModalOpen,
    setIsTransactionModalOpen,
    editingTransaction,
    setEditingTransaction,
    addTransaction,
    updateTransaction,
    accounts,
    categories,
  } = useFika();
  const { t, currency, formatCurrency: formatCurrencyFn, language } = useI18n();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(getTodayLocalDate());
  const [transactionCurrency, setTransactionCurrency] = useState<Currency>(currency);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [continuousEntry, setContinuousEntry] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  
  const amountInputRef = useRef<HTMLInputElement>(null);

  const filteredCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (editingTransaction) {
      // Pre-fill all fields when editing
      setType(editingTransaction.type);
      // Ensure amount is properly formatted as string, preserving decimal places
      const amountNum = typeof editingTransaction.amount === 'number' 
        ? editingTransaction.amount 
        : parseFloat(String(editingTransaction.amount || '0')) || 0;
      // Convert to string, preserving up to 2 decimal places
      const amountValue = amountNum % 1 === 0 
        ? amountNum.toString() 
        : amountNum.toFixed(2).replace(/\.?0+$/, ''); // Remove trailing zeros
      setAmount(amountValue);
      setCategoryId(editingTransaction.category_id);
      setAccountId(editingTransaction.account_id);
      // Use local_date if available, fallback to date
      setDate(editingTransaction.local_date || editingTransaction.date);
      setTransactionCurrency((editingTransaction.currency as Currency) || currency);
      // Pre-fill note, using empty string if note is null/undefined
      setNote(editingTransaction.note || "");
    } else if (!isTransactionModalOpen) {
      // Only reset form when modal is closed (not just when editingTransaction is null)
      resetForm();
    }
  }, [editingTransaction, currency, isTransactionModalOpen]);

  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  // Update date when modal opens (for new transactions only)
  useEffect(() => {
    if (isTransactionModalOpen && !editingTransaction) {
      setDate(getTodayLocalDate());
      setTransactionCurrency(currency); // Reset to user's preferred currency for new transactions
    }
  }, [isTransactionModalOpen, editingTransaction, currency]);

  const resetForm = () => {
    setType("expense");
    setAmount("");
    setCategoryId("");
    setAccountId(accounts[0]?.id || "");
    setDate(getTodayLocalDate());
    setTransactionCurrency(currency);
    setNote("");
  };

  const handleClose = () => {
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
    setShowCalculator(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const transactionData = {
      amount: parseFloat(amount),
      type,
      category_id: categoryId,
      account_id: accountId,
      note: note.trim() || null,
      date: date,
      local_date: date,
      currency: transactionCurrency,
    };

    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2000);

      if (!continuousEntry || editingTransaction) {
        setTimeout(() => {
          handleClose();
        }, 300);
      } else {
        // Reset form but keep modal open for continuous entry
        // Only reset amount, keep category and all other fields the same
        setAmount("0");
        // Keep category, date, timezone, note, account, type, currency the same
        // Focus back on amount field
        if (amountInputRef.current) {
          amountInputRef.current.focus();
        }
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Failed to save transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculatorChange = (val: string) => {
    setAmount(val);
  };

  // Handle calculator done
  const handleCalculatorDone = (finalValue: number) => {
    setAmount(finalValue.toString());
    setShowCalculator(false);
  };

  // Format amount for display in the input field - preserve decimal points
  const displayAmount = amount || "0.00";

  const isValid =
    amount && parseFloat(amount) > 0 && categoryId && accountId && date;

  return (
    <>
      <Modal
        isOpen={isTransactionModalOpen}
        onClose={handleClose}
        title={editingTransaction ? t("transaction.edit") : t("transaction.new")}
        className="lg:max-w-5xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto min-h-0 space-y-3 sm:space-y-6 pr-1">
          {/* Mobile: Single column layout (unchanged) */}
          <div className="lg:hidden space-y-3 sm:space-y-6">
            {/* Type Toggle */}
            <div className="flex gap-1 sm:gap-2 p-0.5 sm:p-1 bg-fika-latte rounded-lg sm:rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setType("expense");
                  setCategoryId("");
                }}
                className={cn(
                  "flex-1 py-1.5 sm:py-3 px-3 sm:px-4 rounded-md sm:rounded-xl text-xs sm:text-base font-medium transition-all flex items-center justify-center gap-1 sm:gap-2",
                  type === "expense"
                    ? "bg-white text-fika-berry shadow-sm sm:shadow-soft"
                    : "text-fika-cinnamon hover:text-fika-espresso"
                )}
              >
                <Icon name="Minus" size={14} className="sm:w-[18px] sm:h-[18px]" />
                {t("transaction.expense")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setType("income");
                  setCategoryId("");
                }}
                className={cn(
                  "flex-1 py-1.5 sm:py-3 px-3 sm:px-4 rounded-md sm:rounded-xl text-xs sm:text-base font-medium transition-all flex items-center justify-center gap-1 sm:gap-2",
                  type === "income"
                    ? "bg-white text-fika-sage shadow-sm sm:shadow-soft"
                    : "text-fika-cinnamon hover:text-fika-espresso"
                )}
              >
                <Icon name="Plus" size={14} className="sm:w-[18px] sm:h-[18px]" />
                {t("transaction.income")}
              </button>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-fika-espresso mb-1 sm:mb-2">
                {t("transaction.amount")}
              </label>
              <button
                type="button"
                onClick={() => setShowCalculator(true)}
                className="w-full text-left relative group"
              >
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-fika-cinnamon text-sm sm:text-lg">
                  {transactionCurrency === "CNY" ? "¥" : "$"}
                </span>
                <div
                  className={cn(
                    "w-full pl-7 sm:pl-10 pr-10 sm:pr-14 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 bg-white text-lg sm:text-2xl font-semibold transition-all",
                    amount 
                      ? "text-fika-espresso border-fika-latte" 
                      : "text-fika-cinnamon/60 border-fika-latte",
                    "group-hover:border-fika-honey group-focus:border-fika-honey"
                  )}
                >
                  {displayAmount || "0.00"}
                </div>
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-fika-cinnamon/50 group-hover:text-fika-honey transition-colors">
                  <Icon name="Calculator" size={16} className="sm:w-[20px] sm:h-[20px]" />
                </div>
              </button>
              <p className="mt-1 text-[10px] sm:text-xs text-fika-cinnamon/60">
                {t("transaction.calculatorHint")}
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-fika-espresso mb-1 sm:mb-2">
                {t("transaction.category")}
              </label>
              <div className="flex gap-2 overflow-x-auto px-2 pt-2 pb-2 scrollbar-hide">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setCategoryId(category.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-lg transition-all flex-shrink-0 w-[60px]",
                      categoryId === category.id
                        ? "bg-fika-honey/20 ring-2 ring-fika-honey"
                        : "bg-fika-latte/50"
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon name={category.icon} size={18} color={category.color} />
                    </div>
                    <span className="text-[10px] font-medium text-fika-espresso text-center truncate w-full">
                      {translateCategoryName(category.name, language)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Account */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-fika-espresso mb-1 sm:mb-2">
                {t("transaction.account")}
              </label>
              <div className="flex gap-2 overflow-x-auto px-2 pt-2 pb-2 scrollbar-hide">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setAccountId(account.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-lg transition-all flex-shrink-0 w-[60px]",
                      accountId === account.id
                        ? "bg-fika-honey/20 ring-2 ring-fika-honey"
                        : "bg-fika-latte/50"
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${account.color}20` }}
                    >
                      <Icon name={account.icon} size={18} color={account.color} />
                    </div>
                    <span className="text-[10px] font-medium text-fika-espresso text-center truncate w-full">
                      {account.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Note - Side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="min-w-0">
                <label className="block text-xs font-medium text-fika-espresso mb-1">
                  {t("transaction.date")}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full min-w-0 h-9 px-2 rounded-lg border-2 border-fika-latte bg-white text-xs text-fika-espresso focus:outline-none focus:border-fika-honey appearance-none"
                />
              </div>
              <div className="min-w-0">
                <label className="block text-xs font-medium text-fika-espresso mb-1">
                  {t("transaction.note")}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add note..."
                  className="w-full min-w-0 h-9 px-2 rounded-lg border-2 border-fika-latte bg-white text-xs text-fika-espresso placeholder:text-fika-cinnamon/60 focus:outline-none focus:border-fika-honey"
                />
              </div>
            </div>

            {/* Currency Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-fika-espresso mb-1 sm:mb-2">
                {t("select.currency")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTransactionCurrency("CNY")}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border-2 transition-all",
                    transactionCurrency === "CNY"
                      ? "border-fika-honey bg-fika-honey/10"
                      : "border-fika-latte hover:border-fika-caramel"
                  )}
                >
                  <Image
                    src="/china.svg"
                    alt="CNY"
                    width={24}
                    height={18}
                    className="rounded-sm"
                  />
                  <span className="text-xs font-medium text-fika-espresso">
                    {t("currency.cny")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionCurrency("USD")}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border-2 transition-all",
                    transactionCurrency === "USD"
                      ? "border-fika-honey bg-fika-honey/10"
                      : "border-fika-latte hover:border-fika-caramel"
                  )}
                >
                  <Image
                    src="/usa.svg"
                    alt="USD"
                    width={24}
                    height={18}
                    className="rounded-sm"
                  />
                  <span className="text-xs font-medium text-fika-espresso">
                    {t("currency.usd")}
                  </span>
                </button>
              </div>
            </div>

            {/* Continuous Entry Toggle */}
            {!editingTransaction && (
              <div className="flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4 bg-fika-latte/50 rounded-lg sm:rounded-xl">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Icon name="RefreshCw" size={14} className="sm:w-[18px] sm:h-[18px] text-fika-cinnamon" />
                  <span className="text-xs sm:text-sm font-medium text-fika-espresso">
                    {t("transaction.continuousEntry")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setContinuousEntry(!continuousEntry)}
                  className={cn(
                    "relative w-9 sm:w-12 h-5 sm:h-6 rounded-full transition-colors duration-300",
                    continuousEntry ? "bg-fika-honey" : "bg-fika-latte"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                      continuousEntry ? "right-0.5 sm:right-1 left-auto" : "left-0.5 sm:left-1 right-auto"
                    )}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Desktop: Two-column layout (lg breakpoint) */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
            {/* Left Column: Core Entry */}
            <div className="space-y-4">
              {/* Type Toggle */}
              <div className="flex gap-2 p-1 bg-fika-latte rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setType("expense");
                    setCategoryId("");
                  }}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl text-base font-medium transition-all flex items-center justify-center gap-2",
                    type === "expense"
                      ? "bg-white text-fika-berry shadow-soft"
                      : "text-fika-cinnamon hover:text-fika-espresso"
                  )}
                >
                  <Icon name="Minus" size={18} />
                  {t("transaction.expense")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType("income");
                    setCategoryId("");
                  }}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl text-base font-medium transition-all flex items-center justify-center gap-2",
                    type === "income"
                      ? "bg-white text-fika-sage shadow-soft"
                      : "text-fika-cinnamon hover:text-fika-espresso"
                  )}
                >
                  <Icon name="Plus" size={18} />
                  {t("transaction.income")}
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="form-label">
                  {t("transaction.amount")}
                </label>
                <button
                  type="button"
                  onClick={() => setShowCalculator(true)}
                  className="w-full text-left relative group"
                >
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fika-cinnamon text-lg">
                    {transactionCurrency === "CNY" ? "¥" : "$"}
                  </span>
                  <div
                    className={cn(
                      "w-full pl-10 pr-14 py-3 rounded-xl border-2 bg-white text-2xl font-semibold transition-all",
                      amount 
                        ? "text-fika-espresso border-fika-latte" 
                        : "text-fika-cinnamon/60 border-fika-latte",
                      "group-hover:border-fika-honey group-focus:border-fika-honey"
                    )}
                  >
                    {displayAmount || "0.00"}
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-fika-cinnamon/50 group-hover:text-fika-honey transition-colors">
                    <Icon name="Calculator" size={20} />
                  </div>
                </button>
                <p className="mt-1 text-xs text-fika-cinnamon/60">
                  {t("transaction.calculatorHint")}
                </p>
              </div>

              {/* Category Grid */}
              <div>
                <label className="form-label mb-1.5">
                  {t("transaction.category")}
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setCategoryId(category.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300",
                        categoryId === category.id
                          ? "bg-fika-honey/20 border-2 border-fika-honey"
                          : "bg-fika-latte/50 border-2 border-transparent hover:bg-fika-latte"
                      )}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <Icon name={category.icon} size={16} color={category.color} />
                      </div>
                      <span className="text-[10px] font-medium text-fika-espresso text-center truncate w-full">
                        {translateCategoryName(category.name, language)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Grid */}
              <div>
                <label className="form-label mb-1.5">
                  {t("transaction.account")}
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {accounts.map((account) => (
                    <button
                      key={account.id}
                      type="button"
                      onClick={() => setAccountId(account.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300",
                        accountId === account.id
                          ? "bg-fika-honey/20 border-2 border-fika-honey"
                          : "bg-fika-latte/50 border-2 border-transparent hover:bg-fika-latte"
                      )}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${account.color}20` }}
                      >
                        <Icon name={account.icon} size={16} color={account.color} />
                      </div>
                      <span className="text-[10px] font-medium text-fika-espresso text-center truncate w-full">
                        {account.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Transaction Details */}
            <div className="space-y-4">
              {/* Date */}
              <div>
                <label className="form-label">
                  {t("transaction.date")}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Currency Selection - Compact Pill Toggle */}
              <div>
                <label className="form-label mb-1.5">
                  {t("select.currency")}
                </label>
                <div className="flex items-center gap-1 p-1 bg-fika-latte/50 rounded-lg w-fit">
                  <button
                    type="button"
                    onClick={() => setTransactionCurrency("CNY")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                      transactionCurrency === "CNY"
                        ? "bg-white shadow-sm text-fika-espresso"
                        : "text-fika-cinnamon hover:bg-white/50"
                    )}
                  >
                    <Image
                      src="/china.svg"
                      alt="CNY"
                      width={18}
                      height={14}
                      className="rounded-sm"
                    />
                    <span>¥ CNY</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionCurrency("USD")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                      transactionCurrency === "USD"
                        ? "bg-white shadow-sm text-fika-espresso"
                        : "text-fika-cinnamon hover:bg-white/50"
                    )}
                  >
                    <Image
                      src="/usa.svg"
                      alt="USD"
                      width={18}
                      height={14}
                      className="rounded-sm"
                    />
                    <span>$ USD</span>
                  </button>
                </div>
              </div>

              {/* Notes - Multi-line textarea for desktop */}
              <div>
                <label className="form-label">
                  {t("transaction.note")}
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t("transaction.notePlaceholder")}
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              {/* Continuous Entry Toggle */}
              {!editingTransaction && (
                <div className="flex items-center justify-between py-3 px-4 bg-fika-latte/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Icon name="RefreshCw" size={18} className="text-fika-cinnamon" />
                    <span className="text-sm font-medium text-fika-espresso">
                      {t("transaction.continuousEntry")}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContinuousEntry(!continuousEntry)}
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors duration-300",
                      continuousEntry ? "bg-fika-honey" : "bg-fika-latte"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                        continuousEntry ? "right-1 left-auto" : "left-1 right-auto"
                      )}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
          </div>

          {/* Submit Buttons - Fixed at bottom, outside scrollable area */}
          <div className="flex-shrink-0 pt-4 mt-auto border-t border-fika-latte/30 bg-white">
          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1 py-2 sm:py-3 px-3 sm:px-6 text-xs sm:text-base rounded-lg sm:rounded-2xl"
              disabled={loading}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className="btn-primary flex-1 py-2 sm:py-3 px-3 sm:px-6 text-xs sm:text-base rounded-lg sm:rounded-2xl"
            >
              {loading
                ? t("transaction.saving")
                : editingTransaction
                ? t("transaction.update")
                : continuousEntry
                ? t("transaction.addContinue")
                : t("transaction.add")}
            </button>
          </div>
          </div>

          {/* Saved Toast */}
          <div
            className={cn(
              "fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 bg-fika-sage text-white rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 z-50 text-sm",
              showSavedToast
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            )}
          >
            <Icon name="Check" size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="font-medium">{t("transaction.saved")}</span>
          </div>
        </form>
      </Modal>

      {/* Calculator Keypad */}
      <CalculatorKeypad
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        value={amount}
        onChange={handleCalculatorChange}
        onDone={handleCalculatorDone}
        currency={transactionCurrency}
      />
    </>
  );
}
