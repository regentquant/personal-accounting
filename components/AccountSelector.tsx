"use client";

import { useState } from "react";
import { useFika } from "@/context/FikaContext";
import { useI18n } from "@/context/I18nContext";
import { Icon } from "./ui/Icon";
import { cn } from "@/lib/utils";

export function AccountSelector() {
  const {
    accounts,
    activeAccountId,
    setActiveAccountId,
    setIsAccountModalOpen,
    setEditingAccount,
    deleteAccount,
    resetAccounts,
    personalAccounts,
    excludedAccounts,
    hasExcludedAccounts,
    getAccountBalance,
  } = useFika();
  const { t, formatCurrency } = useI18n();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleEdit = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    if (account) {
      setEditingAccount(account);
      setIsAccountModalOpen(true);
    }
  };

  const handleDelete = async (accountId: string) => {
    if (!confirm(t("account.deleteConfirm"))) {
      return;
    }

    setDeletingId(accountId);
    try {
      await deleteAccount(accountId);
    } catch (error: any) {
      alert(error.message || t("account.cannotDelete"));
    } finally {
      setDeletingId(null);
    }
  };

  const handleReset = async () => {
    if (!confirm(t("accounts.resetWarning"))) {
      setShowResetConfirm(false);
      return;
    }

    setResetting(true);
    try {
      await resetAccounts();
      setShowResetConfirm(false);
    } catch (error) {
      console.error("Error resetting accounts:", error);
      alert(t("common.error"));
    } finally {
      setResetting(false);
    }
  };

  return (
    <div
      className="animate-spring-in animate-delay-100 section-card"
      style={{ animationFillMode: "both" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[11px] uppercase tracking-[0.15em] text-fika-cinnamon font-medium">
            {t("accounts.title")}
          </h3>
          <p className="text-[10px] text-fika-cinnamon/50 mt-0.5">
            {t("accounts.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingAccount(null);
              setIsAccountModalOpen(true);
            }}
            className="text-sm font-medium text-fika-honey hover:text-fika-honey/80 transition-colors flex items-center gap-1"
          >
            <Icon name="Plus" size={16} />
            {t("accounts.add")}
          </button>
          {accounts.length > 0 && (
            <button
              onClick={() => setShowResetConfirm(!showResetConfirm)}
              className="text-sm font-medium text-fika-cinnamon hover:text-fika-espresso transition-colors flex items-center gap-1"
              title={t("accounts.reset")}
            >
              <Icon name="RotateCcw" size={16} />
            </button>
          )}
          <button
            onClick={() => setActiveAccountId(null)}
            className={cn(
              "text-sm font-medium transition-colors",
              activeAccountId === null
                ? "text-fika-honey"
                : "text-fika-cinnamon hover:text-fika-espresso"
            )}
          >
            {t("accounts.viewAll")}
          </button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="mb-4 p-3 bg-fika-latte/50 rounded-xl border border-fika-honey/20">
          <p className="text-sm text-fika-espresso mb-2">
            {t("accounts.resetConfirm")}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              disabled={resetting}
              className="btn-primary text-xs py-1 px-3 flex-1"
            >
              {resetting ? t("accounts.resetting") : t("accounts.confirmReset")}
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="btn-secondary text-xs py-1 px-3 flex-1"
              disabled={resetting}
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-fika-cinnamon text-sm mb-3">{t("accounts.noAccounts")}</p>
          <button
            onClick={() => {
              setEditingAccount(null);
              setIsAccountModalOpen(true);
            }}
            className="btn-primary text-sm py-2 px-4"
          >
            <Icon name="Plus" size={16} className="mr-1" />
            {t("accounts.addFirst")}
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {accounts.map((account) => {
            const isExcluded = account.exclude_from_equity || false;
            return (
              <div
                key={account.id}
                className="relative group"
              >
                <button
                  onClick={() =>
                    setActiveAccountId(
                      activeAccountId === account.id ? null : account.id
                    )
                  }
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 relative",
                    activeAccountId === account.id
                      ? "account-chip-active"
                      : "account-chip-inactive",
                    isExcluded && activeAccountId !== account.id && "border-dashed opacity-70 hover:opacity-100"
                  )}
                  style={isExcluded && activeAccountId !== account.id ? { borderWidth: "2px", borderStyle: "dashed" } : undefined}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${account.color}20` }}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center",
                        isExcluded && "grayscale"
                      )}
                      style={isExcluded ? { filter: "grayscale(100%)" } : {}}
                    >
                      <Icon 
                        name={account.icon} 
                        size={14} 
                        color={account.color}
                      />
                    </div>
                  </div>
                  <span className="font-medium">{account.name}</span>
                  <span className="text-fika-cinnamon/70 text-xs">
                    {formatCurrency(getAccountBalance(account.id))}
                  </span>
                </button>

                {/* Tooltip for excluded accounts */}
                {isExcluded && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-fika-espresso text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg">
                    {t("accounts.excludedTooltip")}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-fika-espresso rotate-45"></div>
                  </div>
                )}

                {/* Edit/Delete buttons */}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white rounded-lg shadow-sm p-1 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(account.id);
                    }}
                    className="p-1 hover:bg-fika-latte rounded transition-colors"
                    title="Edit account"
                  >
                    <Icon name="Pencil" size={14} className="text-fika-espresso" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(account.id);
                    }}
                    disabled={deletingId === account.id}
                    className="p-1 hover:bg-fika-berry/10 rounded transition-colors disabled:opacity-50"
                    title="Delete account"
                  >
                    <Icon
                      name={deletingId === account.id ? "Loader2" : "Trash2"}
                      size={14}
                      className={cn(
                        deletingId === account.id
                          ? "text-fika-cinnamon animate-spin"
                          : "text-fika-berry"
                      )}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
