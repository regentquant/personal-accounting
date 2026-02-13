import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";
import { FikaProvider } from "@/context/FikaContext";
import { I18nProvider } from "@/context/I18nContext";
import { LanguageSetter } from "@/components/LanguageSetter";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fika · Personal Finance",
  description: "A minimalist personal accounting app inspired by Swedish coffee culture",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable}`}>
      <body className="font-sans min-h-screen bg-gradient-to-br from-background via-fika-cream to-fika-latte/30">
        <I18nProvider>
          <LanguageSetter />
          <FikaProvider>
            <div className="min-h-screen">
              {children}
            </div>
          </FikaProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

