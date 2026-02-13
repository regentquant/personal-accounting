"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { readProfile, writeProfile, readData } from "@/lib/storage";
import type { Language, Currency } from "@/lib/i18n";
import { getTranslation, formatCurrency as formatCurrencyUtil } from "@/lib/i18n";
import { getTodayLocalDate } from "@/lib/timezone";
import type { CurrencyRate, Profile } from "@/types/database";

interface I18nContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => Promise<void>;
  setCurrency: (curr: Currency) => Promise<void>;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  convertAmount: (amount: number, fromCurrency: string, date?: string) => number;
  formatConvertedCurrency: (amount: number, fromCurrency: string, date?: string) => string;
  loading: boolean;
  currencyRates: CurrencyRate[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  children,
  initialLanguage = "en",
  initialCurrency = "CNY"
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
  initialCurrency?: Currency;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);
  const [loading, setLoading] = useState(true);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);

  // Load user preferences and currency rates on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const profile = await readProfile();
        if (profile) {
          setLanguageState((profile.language as Language) || "en");
          setCurrencyState((profile.currency as Currency) || "CNY");
        }
      } catch {
        // Profile may not exist yet on first load
      }

      try {
        const rates = await readData<CurrencyRate>("currency_rates");
        // Sort by date descending
        rates.sort((a, b) => b.date.localeCompare(a.date));
        setCurrencyRates(rates);
      } catch {
        // Currency rates may not exist yet
      }

      setLoading(false);
    };

    loadPreferences();
  }, []);

  // Build a sorted rates map for quick lookup
  const ratesMap = useMemo(() => {
    const map = new Map<string, CurrencyRate[]>();

    currencyRates.forEach((rate) => {
      const key = `${rate.from_currency}-${rate.to_currency}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(rate);
    });

    return map;
  }, [currencyRates]);

  // Get the rate for a specific date
  const getRateForDate = useCallback((fromCurrency: string, toCurrency: string, date: string): number | null => {
    const key = `${fromCurrency}-${toCurrency}`;
    const rates = ratesMap.get(key);

    if (!rates || rates.length === 0) return null;

    for (const rate of rates) {
      if (rate.date <= date) {
        return rate.rate;
      }
    }

    return rates[rates.length - 1].rate;
  }, [ratesMap]);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);

    try {
      const profile = await readProfile();
      await writeProfile({ ...profile, language: lang, updated_at: new Date().toISOString() });
    } catch (error) {
      console.error("Failed to save language preference:", error);
    }
  }, []);

  const setCurrency = useCallback(async (curr: Currency) => {
    setCurrencyState(curr);

    try {
      const profile = await readProfile();
      await writeProfile({ ...profile, currency: curr, updated_at: new Date().toISOString() });
    } catch (error) {
      console.error("Failed to save currency preference:", error);
    }
  }, []);

  const t = useCallback((key: string) => {
    return getTranslation(key, language);
  }, [language]);

  const formatCurrency = useCallback((amount: number) => {
    return formatCurrencyUtil(amount, currency);
  }, [currency]);

  const convertAmount = useCallback((amount: number, fromCurrency: string, date?: string): number => {
    if (fromCurrency === currency) {
      return amount;
    }

    const targetDate = date || getTodayLocalDate();

    if (fromCurrency === "USD" && currency === "CNY") {
      const rate = getRateForDate("USD", "CNY", targetDate);
      if (rate) {
        return amount * rate;
      }
    } else if (fromCurrency === "CNY" && currency === "USD") {
      const rate = getRateForDate("USD", "CNY", targetDate);
      if (rate) {
        return amount / rate;
      }
    }

    return amount;
  }, [currency, getRateForDate]);

  const formatConvertedCurrency = useCallback((amount: number, fromCurrency: string, date?: string): string => {
    const converted = convertAmount(amount, fromCurrency, date);
    return formatCurrencyUtil(converted, currency);
  }, [convertAmount, currency]);

  return (
    <I18nContext.Provider
      value={{
        language,
        currency,
        setLanguage,
        setCurrency,
        t,
        formatCurrency,
        convertAmount,
        formatConvertedCurrency,
        loading,
        currencyRates,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
