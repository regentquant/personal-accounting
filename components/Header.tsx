"use client";

import { Plus, Settings, HelpCircle } from "lucide-react";
import { useFika } from "@/context/FikaContext";
import { useI18n } from "@/context/I18nContext";
import { Logo } from "@/components/Logo";

export function Header() {
  const { setIsTransactionModalOpen, profile, setIsSettingsModalOpen, setIsHelpModalOpen } = useFika();
  const { t } = useI18n();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-auto">
      <div className="island flex items-center gap-3">
        {/* Logo - compact */}
        <div className="flex items-center gap-2">
          <Logo size="sm" variant="icon" />
          <span className="font-display text-lg font-bold text-fika-espresso hidden sm:block">
            Fika
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-fika-caramel/30 hidden sm:block" />

        {/* Add Transaction - Ticket Button */}
        <button
          onClick={() => setIsTransactionModalOpen(true)}
          className="btn-receipt group"
        >
          {/* Left Stub: The Icon */}
          <span className="pr-5 z-10 opacity-90 group-hover:opacity-100">
            <Plus size={18} strokeWidth={2.5} />
          </span>

          {/* Right Body: The Text */}
          <span className="pl-3 hidden sm:inline tracking-wide">
            {t("transaction.add")}
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-fika-caramel/30" />

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="p-2 rounded-full text-fika-cinnamon hover:bg-fika-latte/50 hover:text-fika-espresso transition-colors"
          title={t("settings.title")}
        >
          <Settings size={18} />
        </button>

        {/* Help Button */}
        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="p-2 rounded-full text-fika-cinnamon hover:bg-fika-latte/50 hover:text-fika-espresso transition-colors"
          title={t("help.title")}
        >
          <HelpCircle size={18} />
        </button>

        {/* User Avatar */}
        <div
          className="w-8 h-8 rounded-full bg-fika-espresso flex items-center justify-center text-fika-cream text-sm font-medium"
        >
          {(profile?.display_name || "U")[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
