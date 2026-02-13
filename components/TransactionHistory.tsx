"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useFika } from "@/context/FikaContext";
import { useI18n } from "@/context/I18nContext";
import { Icon } from "./ui/Icon";
import { cn, formatRelativeDate } from "@/lib/utils";
import { formatCurrency as formatCurrencyUtil, translateCategoryName } from "@/lib/i18n";
import type { Currency } from "@/lib/i18n";

export function TransactionHistory() {
  const {
    filteredTransactions,
    accounts,
    categories,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    setIsTransactionModalOpen,
    setEditingTransaction,
    deleteTransaction,
    deleteTransactionsBatch,
    isExcludedAccount,
    hasExcludedAccounts,
  } = useFika();
  const { t, language } = useI18n();
  const [showAll, setShowAll] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);
  const getAccountById = (id: string) => accounts.find((a) => a.id === id);

  // Get visible transactions (respecting showAll)
  const visibleTransactions = useMemo(() => {
    return filteredTransactions.slice(0, showAll ? filteredTransactions.length : 10);
  }, [filteredTransactions, showAll]);

  // Check if all visible transactions are selected
  const allSelected = useMemo(() => {
    if (visibleTransactions.length === 0) return false;
    return visibleTransactions.every((t) => selectedIds.has(t.id));
  }, [visibleTransactions, selectedIds]);

  const handleEdit = (transaction: (typeof filteredTransactions)[0]) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction(id);
    }
  };

  const toggleSelection = (id: string, index?: number, shiftKey?: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      
      // Handle shift-click for range selection
      if (shiftKey && index !== undefined && lastSelectedIndex !== null) {
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        
        // Select all transactions in the range
        for (let i = start; i <= end; i++) {
          if (i < visibleTransactions.length) {
            next.add(visibleTransactions[i].id);
          }
        }
      } else {
        // Normal toggle
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      
      return next;
    });
    
    // Update last selected index
    if (index !== undefined) {
      setLastSelectedIndex(index);
    }
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleTransactions.map((t) => t.id)));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    
    const count = selectedIds.size;
    if (!confirm(`Are you sure you want to delete ${count} transaction${count > 1 ? 's' : ''}?`)) {
      return;
    }

    const idsToDelete = Array.from(selectedIds);
    
    // Start fade-out animation
    setDeletingIds(new Set(idsToDelete));

    // Wait for animation to complete
    setTimeout(async () => {
      // Delete all selected transactions in one batch operation
      await deleteTransactionsBatch(idsToDelete);
      
      // Reset state
      setSelectedIds(new Set());
      setDeletingIds(new Set());
      setEditMode(false);
    }, 300); // Match animation duration
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedIds(new Set());
    setLastSelectedIndex(null);
  };

  const handleEnterEditMode = () => {
    setEditMode(true);
    setSelectedIds(new Set());
  };

  return (
    <div
      className="card-glass receipt-edge animate-spring-in animate-delay-300 pb-8"
      style={{ animationFillMode: "both" }}
    >
      {/* Receipt Header */}
      <div className="border-b border-dashed border-fika-caramel/50 pb-4 mb-4">
        {/* Header Row: Title and Select button */}
        <div className="flex items-center justify-between mb-2 sm:mb-0 sm:hidden">
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-fika-cinnamon font-medium">
            {t("transaction.history")}
          </h3>
          {!editMode ? (
            <button
              onClick={handleEnterEditMode}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-fika-cinnamon hover:text-fika-espresso hover:bg-fika-latte/50 transition-colors flex items-center gap-1.5"
            >
              <Icon name="Edit2" size={16} />
              Edit
            </button>
          ) : editMode ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-fika-cinnamon">
                {selectedIds.size} selected
              </span>
              {selectedIds.size > 0 && (
                <button
                  onClick={handleBatchDelete}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-fika-berry text-white hover:bg-fika-berry/90 transition-colors flex items-center gap-1.5"
                >
                  <Icon name="Trash2" size={14} />
                  Delete
                </button>
              )}
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-fika-cinnamon hover:bg-fika-latte/50 hover:text-fika-espresso transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : null}
        </div>

        {/* Desktop Header Row */}
        <div className="hidden sm:flex sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-[11px] uppercase tracking-[0.15em] text-fika-cinnamon font-medium">
              {t("transaction.history")}
            </h3>
            {editMode && (
              <button
                onClick={toggleSelectAll}
                className="text-sm font-medium text-fika-honey hover:text-fika-espresso transition-colors"
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            )}
          </div>

          <div className="flex flex-row gap-2 items-center">
            {!editMode ? (
              <>
                {/* Search */}
                <div className="relative">
                  <Icon
                    name="Search"
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-fika-cinnamon"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("transaction.search")}
                    className="input-field pl-10 pr-4 py-2 text-sm w-48"
                  />
                </div>

                {/* Filter */}
                <div className="flex gap-1 p-1 bg-fika-latte/50 rounded-xl">
                  {(["all", "income", "expense"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTypeFilter(filter)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                        typeFilter === filter
                          ? "bg-white text-fika-espresso shadow-sm"
                          : "text-fika-cinnamon hover:text-fika-espresso"
                      )}
                    >
                      {filter === "all" 
                        ? t("transaction.filterAll")
                        : filter === "income"
                        ? t("transaction.filterIncome")
                        : t("transaction.filterExpense")}
                    </button>
                  ))}
                </div>

                {/* Edit Button */}
                <button
                  onClick={handleEnterEditMode}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-fika-cinnamon hover:text-fika-espresso hover:bg-fika-latte/50 transition-colors flex items-center gap-1.5"
                >
                  <Icon name="Edit2" size={16} />
                  Edit
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-fika-cinnamon">
                  {selectedIds.size} selected
                </span>
                {selectedIds.size > 0 && (
                  <button
                    onClick={handleBatchDelete}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-fika-berry text-white hover:bg-fika-berry/90 transition-colors flex items-center gap-1.5"
                  >
                    <Icon name="Trash2" size={16} />
                    Delete ({selectedIds.size})
                  </button>
                )}
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-fika-cinnamon hover:bg-fika-latte/50 hover:text-fika-espresso transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: Search Bar - Full width below header */}
        {!editMode && (
          <div className="relative mb-2 sm:hidden">
            <Icon
              name="Search"
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-fika-cinnamon"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("transaction.search")}
              className="input-field pl-10 pr-4 py-2 text-sm w-full"
            />
          </div>
        )}

        {/* Mobile: Filter Controls - Unified segmented control below search */}
        {!editMode && (
          <div className="sm:hidden">
            <div className="flex gap-1 p-1 bg-fika-latte/50 rounded-xl">
              {(["all", "income", "expense"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTypeFilter(filter)}
                  className={cn(
                    "flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                    typeFilter === filter
                      ? "bg-white text-fika-espresso shadow-sm"
                      : "text-fika-cinnamon hover:text-fika-espresso"
                  )}
                >
                  {filter === "all" 
                    ? t("transaction.filterAll")
                    : filter === "income"
                    ? t("transaction.filterIncome")
                    : t("transaction.filterExpense")}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile: Edit mode actions */}
        {editMode && (
          <div className="sm:hidden flex items-center gap-2 mb-2">
            <button
              onClick={toggleSelectAll}
              className="text-sm font-medium text-fika-honey hover:text-fika-espresso transition-colors"
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-fika-latte flex items-center justify-center mb-4">
              <Icon name="Search" size={28} className="text-fika-cinnamon" />
            </div>
            <p className="text-fika-cinnamon font-medium">
              {t("transaction.noTransactions")}
            </p>
            <p className="text-sm text-fika-cinnamon/70 mt-1">
              {searchQuery || typeFilter !== "all"
                ? t("transaction.tryAdjusting")
                : t("transaction.addFirst")}
            </p>
          </div>
        ) : (
          visibleTransactions.map((transaction, index) => {
            const category = getCategoryById(transaction.category_id);
            const account = getAccountById(transaction.account_id);
            const isSelected = selectedIds.has(transaction.id);
            const isDeleting = deletingIds.has(transaction.id);

            const handleRowClick = (e: React.MouseEvent) => {
              // Only handle row clicks in edit mode
              if (!editMode) return;
              
              // Don't trigger if clicking on buttons or checkbox
              const target = e.target as HTMLElement;
              if (
                target.closest('button') ||
                target.closest('[role="button"]') ||
                target.closest('.flex-shrink-0')
              ) {
                return;
              }
              
              toggleSelection(transaction.id, index, e.shiftKey);
            };

            const handleMouseDown = (e: React.MouseEvent) => {
              // Prevent text selection when shift-clicking for range selection
              if (editMode && e.shiftKey) {
                e.preventDefault();
              }
            };

            return (
              <div
                key={transaction.id}
                onClick={handleRowClick}
                onMouseDown={handleMouseDown}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl transition-all duration-300 group",
                  !editMode && "hover:bg-fika-latte/30",
                  editMode && "cursor-pointer select-none",
                  isDeleting && "opacity-0 scale-95 pointer-events-none",
                  isSelected && editMode && "bg-fika-latte/50"
                )}
                style={{
                  transition: "all 0.3s ease",
                  ...(editMode && { userSelect: 'none' as const }),
                }}
              >
                {/* Selection Checkbox - appears in edit mode with smooth animation */}
                <div
                  className={cn(
                    "flex-shrink-0 transition-all duration-300 ease-in-out",
                    editMode
                      ? "w-5 opacity-100 translate-x-0 mr-0"
                      : "w-0 opacity-0 -translate-x-3 mr-0 overflow-hidden"
                  )}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelection(transaction.id, index, e.shiftKey);
                    }}
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      "focus:outline-none focus:ring-2 focus:ring-fika-honey/50",
                      isSelected
                        ? "border-fika-honey bg-fika-honey"
                        : "border-fika-cinnamon/30 hover:border-fika-cinnamon/50 bg-transparent"
                    )}
                    aria-label={isSelected ? "Deselect transaction" : "Select transaction"}
                  >
                    {isSelected && (
                      <Icon
                        name="Check"
                        size={12}
                        className="text-white"
                      />
                    )}
                  </button>
                </div>

                {/* Category Icon */}
                <div
                  className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 relative",
                    hasExcludedAccounts && isExcludedAccount(transaction.account_id) && "opacity-60"
                  )}
                  style={{ backgroundColor: `${category?.color}15` }}
                >
                  <Icon
                    name={category?.icon || "MoreHorizontal"}
                    size={18}
                    color={category?.color}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-medium text-fika-espresso truncate">
                      {category ? translateCategoryName(category.name, language) : "Unknown"}
                    </p>
                    {hasExcludedAccounts && isExcludedAccount(transaction.account_id) && (
                      <span className="text-[9px] px-1 py-0.5 rounded-full bg-fika-berry/10 text-fika-berry font-medium border border-fika-berry/20 flex-shrink-0">
                        {t("account.external")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-fika-cinnamon/70">
                    <Image
                      src={(transaction.currency as Currency) === "USD" ? "/circle-us.svg" : "/circle-cn.svg"}
                      alt={(transaction.currency as Currency) === "USD" ? "USD" : "CNY"}
                      width={12}
                      height={12}
                      className="flex-shrink-0"
                    />
                    <span className="truncate">
                      {transaction.note || "No note"}
                    </span>
                    <span>·</span>
                    <span className="flex-shrink-0">
                      {account?.name}
                    </span>
                  </div>
                </div>

                {/* Amount & Date */}
                <div className="text-right flex-shrink-0">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      transaction.type === "income"
                        ? "text-fika-sage"
                        : "text-fika-berry"
                    )}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrencyUtil(Number(transaction.amount), (transaction.currency as Currency) || "CNY")}
                  </p>
                  <p className="text-[10px] text-fika-cinnamon/70">
                    {formatRelativeDate(transaction.local_date || transaction.date)}
                  </p>
                </div>

                {/* Actions - only shown in edit mode */}
                {editMode && (
                  <div className="flex items-center gap-0.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-1.5 rounded-lg text-fika-cinnamon hover:bg-fika-latte hover:text-fika-espresso transition-colors"
                    >
                      <Icon name="Edit2" size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-1.5 rounded-lg text-fika-cinnamon hover:bg-fika-berry/10 hover:text-fika-berry transition-colors"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* View All / Show Less */}
      {filteredTransactions.length > 10 && (
        <div className="text-center mt-4 pt-4 border-t border-fika-latte">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-fika-honey hover:text-fika-espresso transition-colors"
          >
            {showAll
              ? "Show less ↑"
              : `View all ${filteredTransactions.length} transactions →`}
          </button>
        </div>
      )}
    </div>
  );
}
