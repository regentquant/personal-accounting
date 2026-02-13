"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { useI18n } from "@/context/I18nContext";
import { useFika } from "@/context/FikaContext";
import { Icon } from "./ui/Icon";
import Image from "next/image";
import type { Language, Currency } from "@/lib/i18n";
import { translateCategoryName, formatCurrency } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { TIMEZONES, getTimezonesByRegion, formatTimezoneDisplay } from "@/lib/timezone";
import { readProfile, writeProfile } from "@/lib/storage";

type ImportRowPreview = {
  rowNumber: number; // 1-based (excluding header)
  raw: {
    date: string;
    amount: string;
    type: string;
    category: string;
    account: string;
    timezone?: string;
    currency?: string;
  };
  resolved?: {
    date: string; // YYYY-MM-DD (local_date)
    amount: number;
    type: "income" | "expense";
    category_id: string;
    account_id: string;
    timezone_id: string;
    local_date: string;
    currency: string;
  };
  errors: string[];
  warnings: string[];
};

export function SettingsModal() {
  const { isSettingsModalOpen, setIsSettingsModalOpen } = useFika();
  const { language, setLanguage, currency, setCurrency, homeTimezone, setHomeTimezone, deviceTimezone, t } = useI18n();
  const { profile, transactions, accounts, categories, addAccount, refreshAccounts, addTransactionsBatch } = useFika();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<ImportRowPreview[] | null>(null);
  const [autoCreateAccounts, setAutoCreateAccounts] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [isSavingName, setIsSavingName] = useState(false);

  // Update displayName when profile changes
  useEffect(() => {
    setDisplayName(profile?.display_name || "");
  }, [profile]);

  const timezonesByRegion = getTimezonesByRegion();

  const handleSaveName = async () => {
    setIsSavingName(true);
    try {
      const currentProfile = await readProfile();
      await writeProfile({
        ...currentProfile,
        display_name: displayName.trim() || null,
        updated_at: new Date().toISOString(),
      });
      setIsEditingName(false);
    } catch (error) {
      alert(t("settings.updateNameError") || "Failed to update name");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleCancelEditName = () => {
    setDisplayName(profile?.display_name || "");
    setIsEditingName(false);
  };

  const handleLanguageChange = async (lang: Language) => {
    await setLanguage(lang);
  };

  const handleCurrencyChange = async (curr: "CNY" | "USD") => {
    await setCurrency(curr);
  };

  const handleTimezoneChange = async (tz: string) => {
    await setHomeTimezone(tz);
  };

  const normalizedCategoryMap = useMemo(() => {
    const map = new Map<string, string>(); // normalized -> category_id
    const normalize = (s: string) => s.trim().toLowerCase();

    categories.forEach((c) => {
      map.set(normalize(c.id), c.id);
      map.set(normalize(c.name), c.id);
    });

    // Common aliases for CSVs like the one you shared.
    // e.g. CSV "Food" should map to default "Food & Dining" (id: food)
    map.set("food", map.get("food") ?? map.get("food & dining") ?? "food");
    map.set("food & dining", map.get("food") ?? "food");
    map.set("dining", map.get("food") ?? "food");
    map.set("bills", map.get("utilities") ?? "utilities");
    map.set("utilities", map.get("utilities") ?? "utilities");
    map.set("travel", map.get("travel") ?? "travel");

    // Chinese category names support
    // Expense categories
    map.set(normalize("餐饮"), "food");
    map.set(normalize("交通"), "transport");
    map.set(normalize("购物"), "shopping");
    map.set(normalize("娱乐"), "entertainment");
    map.set(normalize("账单"), "utilities");
    map.set(normalize("公用事业"), "utilities");
    map.set(normalize("健康"), "health");
    map.set(normalize("教育"), "education");
    map.set(normalize("其他"), "other-expense");
    map.set(normalize("生产力"), "productivity");
    map.set(normalize("旅行"), "travel");
    
    // Income categories
    map.set(normalize("工资"), "salary");
    map.set(normalize("奖金"), "bonus");
    map.set(normalize("投资"), "investment");
    map.set(normalize("礼品"), "gift");
    map.set(normalize("自由职业"), "freelance");

    return { map, normalize };
  }, [categories]);

  const normalizedAccountMap = useMemo(() => {
    const map = new Map<string, string>(); // normalized -> account_id
    const normalize = (s: string) => s.trim().toLowerCase();
    accounts.forEach((a) => {
      map.set(normalize(a.name), a.id);
    });
    return { map, normalize };
  }, [accounts]);

  const escapeCsvCell = (value: string) => {
    // CSV escaping for commas/quotes/newlines.
    if (/[",\n\r]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      alert(t("settings.exportError"));
      return;
    }

    setIsExporting(true);

    try {
      // Build CSV content with timezone and currency info
      const lines: string[] = [];
      // CSV Header - now includes Timezone and Currency
      lines.push("Date,Amount,Type,Category,Account,Timezone,Currency");

      // Add transactions
      transactions.forEach((transaction) => {
        const category = categories.find((c) => c.id === transaction.category_id);
        const account = accounts.find((a) => a.id === transaction.account_id);
        const amount = Number(transaction.amount);
        // Use local_date if available, fallback to date
        const date = transaction.local_date || transaction.date;
        const type = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
        const categoryName = category?.name || "Unknown";
        const accountName = account?.name || "Unknown";
        const timezone = transaction.timezone_id || "Asia/Shanghai";
        const transactionCurrency = transaction.currency || "CNY";

        // CSV row: Date,Amount,Type,Category,Account,Timezone,Currency
        lines.push(
          [
            escapeCsvCell(date),
            escapeCsvCell(String(amount)),
            escapeCsvCell(type),
            escapeCsvCell(categoryName),
            escapeCsvCell(accountName),
            escapeCsvCell(timezone),
            escapeCsvCell(transactionCurrency),
          ].join(",")
        );
      });

      const csvContent = lines.join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `transactions-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      alert(t("settings.exportSuccess"));
    } catch (error) {
      alert(t("settings.exportError"));
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadExample = () => {
    try {
      // Example CSV with all columns including Timezone and Currency
      // Use Chinese names when language is Chinese
      const isChinese = language === "zh";
      
      const typeExpense = isChinese ? "支出" : "Expense";
      const typeIncome = isChinese ? "收入" : "Income";
      
      // Get category names in the current language
      const categoryFood = translateCategoryName("Food & Dining", language);
      const categoryTransport = translateCategoryName("Transport", language);
      const categorySalary = translateCategoryName("Salary", language);
      
      const exampleLines = [
        "Date,Amount,Type,Category,Account,Timezone,Currency",
        `2025-01-15,100.50,${typeExpense},${categoryFood},Checking Account,Asia/Shanghai,CNY`,
        `2025-01-16,250.00,${typeIncome},${categorySalary},Checking Account,Asia/Shanghai,CNY`,
        `2025-01-17,50.00,${typeExpense},${categoryTransport},Checking Account,America/New_York,USD`,
        `2025-01-18,75.25,${typeExpense},${categoryFood},Cash,Asia/Shanghai,CNY`,
      ];

      const csvContent = exampleLines.join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", "example-transactions.csv");
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(t("settings.exportError"));
    }
  };

  const parseCsvLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === "\"") {
          const next = line[i + 1];
          if (next === "\"") {
            cur += "\"";
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cur += ch;
        }
      } else {
        if (ch === ",") {
          out.push(cur);
          cur = "";
        } else if (ch === "\"") {
          inQuotes = true;
        } else {
          cur += ch;
        }
      }
    }
    out.push(cur);
    return out;
  };

  const isIsoDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

  const buildImportPreview = (text: string, preferredCurrency: string): { preview: ImportRowPreview[]; missingAccounts: Set<string> } => {
    const lines = text
      .replace(/^\uFEFF/, "") // strip BOM
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const preview: ImportRowPreview[] = [];
    const missingAccounts = new Set<string>();

    // Detect CSV header
    const headerCols = parseCsvLine(lines[0] ?? "").map((c) => c.trim().toLowerCase());
    const isCSV =
      headerCols.length >= 5 &&
      headerCols[0] === "date" &&
      headerCols[1] === "amount" &&
      headerCols[2] === "type" &&
      headerCols[3] === "category" &&
      headerCols[4] === "account";

    if (!isCSV) {
      return { preview: [], missingAccounts };
    }

    // Check if CSV has timezone and currency columns
    const timezoneColIndex = headerCols.findIndex((c) => c === "timezone");
    const currencyColIndex = headerCols.findIndex((c) => c === "currency");
    const hasTimezoneCol = timezoneColIndex >= 0;
    const hasCurrencyCol = currencyColIndex >= 0;

    // Get valid timezone values for validation
    const validTimezones = new Set(TIMEZONES.map((tz) => tz.value));
    const validCurrencies = new Set(["CNY", "USD"]);

    for (let i = 1; i < lines.length; i++) {
      const rowNumber = i; // 1-based excluding header
      const cells = parseCsvLine(lines[i]);
      const [dateRaw = "", amountRaw = "", typeRaw = "", categoryRaw = "", accountRaw = ""] = cells;
      const timezoneRaw = hasTimezoneCol && cells[timezoneColIndex] ? cells[timezoneColIndex].trim() : "";
      const currencyRaw = hasCurrencyCol && cells[currencyColIndex] ? cells[currencyColIndex].trim() : "";

      // Require timezone from CSV - no fallback
      let rowTimezone: string | null = null;
      if (hasTimezoneCol && timezoneRaw) {
        if (validTimezones.has(timezoneRaw)) {
          rowTimezone = timezoneRaw;
        } else {
          // Will add error below
        }
      } else if (!hasTimezoneCol) {
        // CSV doesn't have timezone column - this is an error
        // Will add error below
      }

      // Validate and use currency from CSV if present, otherwise use preferred currency
      let rowCurrency = preferredCurrency;
      if (hasCurrencyCol && currencyRaw) {
        const currencyUpper = currencyRaw.toUpperCase();
        if (validCurrencies.has(currencyUpper)) {
          rowCurrency = currencyUpper;
        } else {
          // Will add error below
        }
      }

      const row: ImportRowPreview = {
        rowNumber,
        raw: {
          date: dateRaw.trim(),
          amount: amountRaw.trim(),
          type: typeRaw.trim(),
          category: categoryRaw.trim(),
          account: accountRaw.trim(),
          timezone: hasTimezoneCol ? timezoneRaw : undefined,
          currency: hasCurrencyCol ? currencyRaw : undefined,
        },
        errors: [],
        warnings: [],
      };

      // Validate timezone - required from CSV
      if (!hasTimezoneCol) {
        row.errors.push(`Missing timezone column. CSV must include a "Timezone" column with timezone values (e.g., Asia/Shanghai, America/New_York)`);
      } else if (!timezoneRaw) {
        row.errors.push(`Missing timezone value in row. Each row must have a timezone value in the Timezone column.`);
      } else if (!validTimezones.has(timezoneRaw)) {
        row.errors.push(`Invalid timezone: ${timezoneRaw}. Must be a supported timezone (e.g., Asia/Shanghai, America/New_York)`);
      }

      // Validate currency if provided in CSV
      if (hasCurrencyCol && currencyRaw) {
        const currencyUpper = currencyRaw.toUpperCase();
        if (!validCurrencies.has(currencyUpper)) {
          row.errors.push(`Invalid currency: ${currencyRaw}. Must be CNY or USD`);
        }
      }

      // Date
      const dateStr = row.raw.date;
      if (!isIsoDate(dateStr)) {
        row.errors.push(`Invalid date: ${dateStr}`);
      }

      // Amount
      const amount = parseFloat(row.raw.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        row.errors.push(`Invalid amount: ${row.raw.amount}`);
      }

      // Type
      const typeNorm = row.raw.type.trim().toLowerCase();
      const type =
        typeNorm === "income" ? ("income" as const) : typeNorm === "expense" ? ("expense" as const) : null;
      if (!type) {
        row.errors.push(`Invalid type: ${row.raw.type}`);
      }

      // Category: match case-insensitive, by id or name, with aliases (e.g. Food -> food)
      const catKey = normalizedCategoryMap.normalize(row.raw.category);
      const category_id = normalizedCategoryMap.map.get(catKey);
      if (!category_id) {
        row.errors.push(`Unknown category: ${row.raw.category}`);
      }

      // Account: match case-insensitive; optionally auto-create on confirm
      const accKey = normalizedAccountMap.normalize(row.raw.account);
      const account_id = normalizedAccountMap.map.get(accKey);
      if (!account_id) {
        missingAccounts.add(row.raw.account);
        row.warnings.push(`Account will be created: ${row.raw.account}`);
      }

      if (row.errors.length === 0 && type && category_id && rowTimezone) {
        // account_id might be missing for now; will be resolved after optional account creation
        if (account_id) {
          row.resolved = {
            date: dateStr,
            amount,
            type,
            category_id,
            account_id,
            timezone_id: rowTimezone,
            local_date: dateStr,
            currency: rowCurrency,
          };
        }
      }

      preview.push(row);
    }

    return { preview, missingAccounts };
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const text = await file.text();
      const { preview } = buildImportPreview(text, currency);

      if (preview.length === 0) {
        alert(t("settings.importInvalidFormat"));
        return;
      }

      setImportFileName(file.name);
      setImportPreview(preview);
    } catch (error) {
      alert(t("settings.importError"));
    } finally {
      setIsImporting(false);
    }
  };

  const clearImportPreview = () => {
    setImportPreview(null);
    setImportFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  const importCounts = useMemo(() => {
    if (!importPreview) return null;
    const valid = importPreview.filter((r) => r.errors.length === 0).length;
    const invalid = importPreview.length - valid;
    const missingAccounts = new Set<string>();
    importPreview.forEach((r) => {
      const accKey = normalizedAccountMap.normalize(r.raw.account);
      const has = normalizedAccountMap.map.get(accKey);
      if (!has) missingAccounts.add(r.raw.account);
    });
    return { total: importPreview.length, valid, invalid, missingAccounts };
  }, [importPreview, normalizedAccountMap]);

  const handleConfirmImport = async () => {
    if (!importPreview || !importCounts) return;

    setIsImporting(true);
    try {
      // 1) Optionally create missing accounts first
      if (autoCreateAccounts && importCounts.missingAccounts.size > 0) {
        const uniqueNames = Array.from(importCounts.missingAccounts)
          .map((n) => n.trim())
          .filter((n) => n.length > 0);
        for (const name of uniqueNames) {
          // Re-check with latest accounts map (in case multiple rows)
          const accKey = normalizedAccountMap.normalize(name);
          if (!normalizedAccountMap.map.get(accKey)) {
            await addAccount({ name });
          }
        }
        await refreshAccounts();
      }

      // 2) Re-resolve account/category ids and build final batch with timezone and currency
      const finalBatch: Array<{
        account_id: string;
        category_id: string;
        amount: number;
        type: "income" | "expense";
        date: string;
        note?: string | null;
        timezone_id: string;
        local_date: string;
        currency: string;
      }> = [];

      const previewNext: ImportRowPreview[] = importPreview.map((row) => {
        const next: ImportRowPreview = { ...row, errors: [...row.errors], warnings: [...row.warnings] };
        // Skip rows that already have parse errors (we still show them)
        if (next.errors.length > 0) return next;

        // Category
        const catKey = normalizedCategoryMap.normalize(next.raw.category);
        const category_id = normalizedCategoryMap.map.get(catKey);
        if (!category_id) {
          next.errors.push(`Unknown category: ${next.raw.category}`);
          return next;
        }

        // Account
        const accKey = normalizedAccountMap.normalize(next.raw.account);
        const account_id = normalizedAccountMap.map.get(accKey);
        if (!account_id) {
          next.errors.push(`Unknown account: ${next.raw.account}`);
          return next;
        }

        const typeNorm = next.raw.type.trim().toLowerCase();
        const type =
          typeNorm === "income" ? ("income" as const) : typeNorm === "expense" ? ("expense" as const) : null;
        const amount = parseFloat(next.raw.amount);
        const dateStr = next.raw.date;
        if (!type) next.errors.push(`Invalid type: ${next.raw.type}`);
        if (!Number.isFinite(amount) || amount <= 0) next.errors.push(`Invalid amount: ${next.raw.amount}`);
        if (!isIsoDate(dateStr)) next.errors.push(`Invalid date: ${dateStr}`);

        if (next.errors.length === 0 && type) {
          // Use timezone and currency from CSV - timezone is required
          let resolvedTimezone: string | null = null;
          let resolvedCurrency: "CNY" | "USD" = currency;
          
          if (next.raw.timezone) {
            // Validate timezone from CSV
            const validTimezones = new Set(TIMEZONES.map((tz) => tz.value));
            if (validTimezones.has(next.raw.timezone)) {
              resolvedTimezone = next.raw.timezone;
            } else {
              next.errors.push(`Invalid timezone: ${next.raw.timezone}`);
            }
          } else if (next.resolved?.timezone_id) {
            resolvedTimezone = next.resolved.timezone_id;
          } else {
            next.errors.push(`Missing timezone value in row`);
          }
          
          if (next.raw.currency) {
            // Validate currency from CSV
            const currencyUpper = next.raw.currency.toUpperCase();
            if (currencyUpper === "CNY" || currencyUpper === "USD") {
              resolvedCurrency = currencyUpper as "CNY" | "USD";
            }
          } else if (next.resolved?.currency) {
            resolvedCurrency = next.resolved.currency as "CNY" | "USD";
          }
          
          if (resolvedTimezone) {
            next.resolved = { 
              date: dateStr, 
              amount, 
              type, 
              category_id, 
              account_id,
              timezone_id: resolvedTimezone,
              local_date: dateStr,
              currency: resolvedCurrency,
            };
            finalBatch.push({
              date: dateStr,
              amount,
              type,
              category_id,
              account_id,
              timezone_id: resolvedTimezone,
              local_date: dateStr,
              currency: resolvedCurrency,
            });
          }
        }

        return next;
      });

      setImportPreview(previewNext);

      if (finalBatch.length === 0) {
        alert(t("settings.importNoTransactions"));
        return;
      }

      // 3) Batch insert (chunked) for reliability
      const { successCount, errorCount } = await addTransactionsBatch(finalBatch);

      if (successCount > 0) {
        alert(`${t("settings.importSuccess")}: ${successCount}${errorCount > 0 ? `, ${errorCount} failed` : ""}`);
      } else {
        alert(t("settings.importError"));
      }

      clearImportPreview();
    } catch (_e) {
      alert(t("settings.importError"));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Modal
      isOpen={isSettingsModalOpen}
      onClose={() => setIsSettingsModalOpen(false)}
      title={t("settings.title")}
    >
      <div className="space-y-6">
        {/* User Info Section */}
        <div>
          <h3 className="text-sm font-semibold text-fika-espresso mb-3">
            {t("settings.userInfo")}
          </h3>
          <div className="p-4 rounded-xl bg-fika-latte/30">
            {isEditingName ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="User"
                  className="w-full p-2 rounded-lg border-2 border-fika-latte bg-white text-sm text-fika-espresso focus:outline-none focus:border-fika-honey"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveName}
                    disabled={isSavingName}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      isSavingName
                        ? "bg-fika-latte/30 text-fika-cinnamon/50 cursor-not-allowed"
                        : "bg-fika-honey/20 text-fika-espresso hover:bg-fika-honey/30"
                    )}
                  >
                    {isSavingName ? t("common.loading") : t("common.save")}
                  </button>
                  <button
                    onClick={handleCancelEditName}
                    disabled={isSavingName}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-fika-latte/50 text-fika-cinnamon hover:bg-fika-latte transition-all"
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
            <p className="text-sm font-medium text-fika-espresso">
                    {displayName || "User"}
            </p>
                </div>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-2 rounded-lg hover:bg-fika-latte/50 transition-colors"
                  title={t("common.edit")}
                >
                  <Icon name="Edit" size={16} className="text-fika-cinnamon" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <h3 className="text-sm font-semibold text-fika-espresso mb-3">
            {t("settings.language")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleLanguageChange("zh")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                language === "zh"
                  ? "border-fika-honey bg-fika-honey/10"
                  : "border-fika-latte hover:border-fika-caramel"
              )}
            >
              <Image
                src="/china.svg"
                alt="中文"
                width={32}
                height={24}
                className="rounded-sm"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-fika-espresso">
                  {t("lang.zh")}
                </p>
              </div>
            </button>
            <button
              onClick={() => handleLanguageChange("en")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                language === "en"
                  ? "border-fika-honey bg-fika-honey/10"
                  : "border-fika-latte hover:border-fika-caramel"
              )}
            >
              <Image
                src="/usa.svg"
                alt="English"
                width={32}
                height={24}
                className="rounded-sm"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-fika-espresso">
                  {t("lang.en")}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Timezone Selection */}
        <div>
          <h3 className="text-sm font-semibold text-fika-espresso mb-3">
            {t("settings.timezone")}
          </h3>
          <p className="text-xs text-fika-cinnamon mb-3">
            {t("settings.timezoneDescription")}
          </p>

          {/* Timezone Mismatch Alert */}
          {deviceTimezone !== homeTimezone && (
            <div className="mb-3 p-4 rounded-xl bg-fika-honey/10 border-2 border-fika-honey/30 animate-spring-in">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-fika-honey/20 flex items-center justify-center shrink-0">
                  <Icon name="MapPin" size={16} className="text-fika-honey" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-fika-espresso mb-1">
                    {t("settings.timezoneMismatch")}
                  </p>
                  <p className="text-xs text-fika-cinnamon mb-3">
                    {t("settings.deviceTimezone")}: <span className="font-medium text-fika-espresso">{formatTimezoneDisplay(deviceTimezone)}</span>
                  </p>
                  <button
                    onClick={() => handleTimezoneChange(deviceTimezone)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-fika-honey text-white text-sm font-medium hover:bg-fika-honey/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="RefreshCw" size={14} />
                    <span>{t("settings.syncToDevice")}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <select
              value={homeTimezone}
              onChange={(e) => handleTimezoneChange(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-fika-latte bg-white text-sm text-fika-espresso focus:outline-none focus:border-fika-honey"
            >
              {Object.entries(timezonesByRegion).map(([region, tzs]) => (
                <optgroup key={region} label={region}>
                  {tzs.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label} ({tz.offset})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="flex items-center gap-2 text-xs text-fika-cinnamon">
              <Icon name="Info" size={14} />
              <span>
                {t("settings.deviceTimezone")}: {formatTimezoneDisplay(deviceTimezone)}
              </span>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h3 className="text-sm font-semibold text-fika-espresso mb-3">
            {t("settings.dataManagement")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Export Data */}
              <button
                onClick={handleExport}
                disabled={isExporting || transactions.length === 0}
                className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                  isExporting || transactions.length === 0
                    ? "border-fika-latte bg-fika-latte/30 cursor-not-allowed"
                  : "border-fika-latte hover:border-fika-caramel"
                )}
              >
              <div className="w-8 h-6 rounded-lg bg-fika-latte/50 flex items-center justify-center flex-shrink-0">
                  <Icon 
                    name={isExporting ? "Loader2" : "Download"} 
                  size={16} 
                    className={cn(
                      "text-fika-cinnamon",
                      isExporting && "animate-spin"
                    )}
                  />
                </div>
              <div className="text-left">
                  <p className="text-sm font-medium text-fika-espresso">
                  {isExporting ? t("common.loading") : t("settings.exportData")}
                  </p>
                </div>
              </button>

            {/* Import Data */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleImport}
                disabled={isImporting}
                className="hidden"
                id="import-file-input"
              />
              <label
                htmlFor="import-file-input"
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer h-full",
                  isImporting
                    ? "border-fika-latte bg-fika-latte/30 cursor-not-allowed"
                    : "border-fika-latte hover:border-fika-caramel"
                )}
              >
                <div className="w-8 h-6 rounded-lg bg-fika-latte/50 flex items-center justify-center flex-shrink-0">
                  <Icon 
                    name={isImporting ? "Loader2" : "Upload"} 
                    size={16} 
                    className={cn(
                      "text-fika-cinnamon",
                      isImporting && "animate-spin"
                    )}
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-fika-espresso">
                    {isImporting ? t("common.loading") : t("settings.importData")}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Download Example File */}
          <div className="mt-3">
            <button
              onClick={handleDownloadExample}
              className="flex items-center gap-2 text-xs text-fika-cinnamon hover:text-fika-espresso transition-colors"
            >
              <Icon name="FileText" size={14} />
              <span>{t("settings.downloadExample")}</span>
            </button>
            </div>

            {/* Import Preview + Confirm */}
            {importPreview && importCounts && (
            <div className="p-4 rounded-xl bg-fika-latte/20 border-2 border-fika-latte mt-3">
                <div>
                  <p className="text-sm font-semibold text-fika-espresso">
                    {t("settings.importPreview")} {importFileName ? `(${importFileName})` : ""}
                  </p>
                  <p className="text-xs text-fika-cinnamon mt-1">
                    {t("settings.importPreviewSummary")
                      .replace("{total}", String(importCounts.total))
                      .replace("{valid}", String(importCounts.valid))
                      .replace("{invalid}", String(importCounts.invalid))}
                  </p>
                  {importCounts.missingAccounts.size > 0 && (
                    <p className="text-xs text-fika-cinnamon mt-1">
                      {t("settings.importWillCreateAccounts").replace(
                        "{count}",
                        String(importCounts.missingAccounts.size)
                      )}
                    </p>
                  )}
                </div>


                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAutoCreateAccounts((v) => !v)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      autoCreateAccounts
                        ? "bg-fika-sage/15 text-fika-sage"
                        : "bg-fika-latte/50 text-fika-cinnamon hover:bg-fika-latte"
                    )}
                  >
                    {autoCreateAccounts ? t("settings.autoCreateAccountsOn") : t("settings.autoCreateAccountsOff")}
                  </button>
                </div>

                {/* Preview Cards - Similar to Recent Transactions */}
                <div className="mt-3 max-h-96 overflow-auto space-y-2">
                    {importPreview.map((row) => {
                      const ok = row.errors.length === 0;
                      const systemDate = row.resolved?.local_date || row.raw.date;
                    const rowTimezone = row.resolved?.timezone_id || row.raw.timezone || "";
                    const systemTz = rowTimezone ? formatTimezoneDisplay(rowTimezone).split(' ')[0] : "";
                    const category = categories.find((c) => c.id === row.resolved?.category_id);
                    const account = accounts.find((a) => a.id === row.resolved?.account_id);
                    const amount = parseFloat(row.raw.amount);
                    const rowCurrency = (row.resolved?.currency || row.raw.currency || currency) as Currency;
                    const type = row.raw.type.trim().toLowerCase() as "income" | "expense";
                      
                      return (
                        <div
                          key={row.rowNumber}
                          className={cn(
                          "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all",
                          ok ? "bg-white/60 hover:bg-white/80" : "bg-fika-berry/5 border border-fika-berry/20"
                          )}
                        >
                        {/* Row Number */}
                        <div className="flex-shrink-0 w-5 text-xs text-fika-cinnamon font-medium">
                          #{row.rowNumber}
                        </div>

                        {/* Category Icon */}
                        {category && ok ? (
                          <div
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${category.color}15` }}
                          >
                            <Icon
                              name={category.icon}
                              size={18}
                              color={category.color}
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-fika-latte/50">
                            <Icon name="X" size={16} className="text-fika-berry" />
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {category && ok ? (
                              <p className="text-xs sm:text-sm font-medium text-fika-espresso truncate">
                                {translateCategoryName(category.name, language)}
                              </p>
                            ) : (
                              <p className="text-xs sm:text-sm font-medium text-fika-berry truncate">
                                {row.raw.category || "Unknown"}
                              </p>
                            )}
                            {ok && (
                              <span
                                className={cn(
                                  "text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0",
                                  type === "income"
                                    ? "bg-fika-sage/10 text-fika-sage"
                                    : "bg-fika-berry/10 text-fika-berry"
                                )}
                              >
                                {type === "income" ? t("transaction.income") : t("transaction.expense")}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-fika-cinnamon/70 mt-0.5 flex-wrap">
                            {ok && account ? (
                              <>
                                <span className="truncate">{account.name}</span>
                                <span>·</span>
                              </>
                            ) : (
                              <span className="text-fika-berry">{row.raw.account || "Unknown"}</span>
                            )}
                            <span className="truncate">
                              {systemDate}
                              {ok && <span className="text-fika-cinnamon/50"> ({systemTz})</span>}
                            </span>
                          </div>

                          {/* Errors and Warnings */}
                          {(row.errors.length > 0 || row.warnings.length > 0) && (
                            <div className="mt-1.5 space-y-0.5">
                              {row.errors.map((e, idx) => (
                                <div key={`e-${idx}`} className="text-[10px] text-fika-berry flex items-start gap-1">
                                  <Icon name="X" size={10} className="flex-shrink-0 mt-0.5" />
                                  <span>{e}</span>
                                </div>
                              ))}
                              {row.warnings.map((w, idx) => (
                                <div key={`w-${idx}`} className="text-[10px] text-fika-cinnamon/80 flex items-start gap-1">
                                  <Icon name="HelpCircle" size={10} className="flex-shrink-0 mt-0.5" />
                                  <span>{w}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Amount & Date */}
                        {ok && (
                          <div className="text-right flex-shrink-0">
                            <p
                              className={cn(
                                "text-sm sm:text-base font-semibold",
                                type === "income"
                                  ? "text-fika-sage"
                                  : "text-fika-berry"
                              )}
                            >
                              {type === "income" ? "+" : "-"}
                              {formatCurrency(amount, rowCurrency)}
                            </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* Cancel and Confirm buttons - below table, left aligned */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={clearImportPreview}
                    className="px-3 py-2 rounded-xl bg-fika-latte/50 text-fika-cinnamon hover:bg-fika-latte hover:text-fika-espresso transition-all text-sm font-medium"
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    disabled={isImporting || importCounts.valid === 0}
                    className={cn(
                      "px-3 py-2 rounded-xl transition-all text-sm font-medium flex items-center gap-2",
                      isImporting || importCounts.valid === 0
                        ? "bg-fika-latte/30 text-fika-cinnamon/50 cursor-not-allowed"
                        : "bg-fika-honey/20 text-fika-espresso hover:bg-fika-honey/30"
                    )}
                  >
                    <Icon name={isImporting ? "Loader2" : "Check"} size={16} className={cn(isImporting && "animate-spin")} />
                    {t("settings.importConfirm")}
                  </button>
                </div>
              </div>
            )}
        </div>

        {/* Preferred Currency Selection */}
        <div>
          <h3 className="text-sm font-semibold text-fika-espresso mb-3">
            {t("settings.preferredCurrency")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleCurrencyChange("CNY")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                currency === "CNY"
                  ? "border-fika-honey bg-fika-honey/10"
                  : "border-fika-latte hover:border-fika-caramel"
              )}
            >
              <Image
                src="/china.svg"
                alt="CNY"
                width={32}
                height={24}
                className="rounded-sm"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-fika-espresso">
                  {t("currency.cny")}
                </p>
              </div>
            </button>
            <button
              onClick={() => handleCurrencyChange("USD")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                currency === "USD"
                  ? "border-fika-honey bg-fika-honey/10"
                  : "border-fika-latte hover:border-fika-caramel"
              )}
            >
              <Image
                src="/usa.svg"
                alt="USD"
                width={32}
                height={24}
                className="rounded-sm"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-fika-espresso">
                  {t("currency.usd")}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
