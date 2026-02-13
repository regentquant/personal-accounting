"use client";

import { useEffect } from "react";
import { useI18n } from "@/context/I18nContext";

export function LanguageSetter() {
  const { language } = useI18n();

  useEffect(() => {
    // Update html lang attribute based on current language
    document.documentElement.lang = language === "zh" ? "zh" : "en";
  }, [language]);

  return null;
}

