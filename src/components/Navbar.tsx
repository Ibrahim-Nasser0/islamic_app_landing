"use client";

import Image from "next/image";
import { Download, Globe, Moon, Sun } from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";

interface NavbarProps {
  locale: Locale;
  isDark: boolean;
  downloadUrl: string;
  onToggleLocale: () => void;
  onToggleTheme: () => void;
}

export function Navbar({
  locale,
  isDark,
  downloadUrl,
  onToggleLocale,
  onToggleTheme,
}: NavbarProps) {
  const t = landingCopy[locale];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--sanctuary-border)] bg-[var(--sanctuary-paper)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#top" className="flex items-center gap-3">
          <Image
            src="/images/app_logo.png"
            alt={t.brand}
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-xl border border-[var(--sanctuary-border)] object-cover shadow-sm"
          />
          <div>
            <span className="block text-base font-bold tracking-tight text-[var(--sanctuary-ink)]">
              {t.brand}
            </span>
            <span className="hidden text-xs text-[var(--sanctuary-muted)] sm:block">
              {t.tagline}
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-[var(--sanctuary-muted)] md:flex">
          <a
            href="#features"
            className="transition-colors hover:text-[var(--sanctuary-emerald)]"
          >
            {t.nav.features}
          </a>
          <a
            href="#lockscreen"
            className="transition-colors hover:text-[var(--sanctuary-emerald)]"
          >
            {t.nav.lockscreen}
          </a>
          <a
            href="#download"
            className="transition-colors hover:text-[var(--sanctuary-emerald)]"
          >
            {t.nav.download}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)] text-[var(--sanctuary-ink)] transition-colors hover:border-[var(--sanctuary-gold)]"
          >
            {isDark ? <Sun className="h-4 w-4 text-[#E0B866]" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onToggleLocale}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)] px-3 text-xs font-semibold text-[var(--sanctuary-ink)] transition-colors hover:border-[var(--sanctuary-gold)]"
          >
            <Globe className="h-3.5 w-3.5 text-[var(--sanctuary-gold)]" />
            <span>{locale === "ar" ? "EN" : "عربي"}</span>
          </button>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 items-center gap-2 rounded-xl bg-[var(--sanctuary-emerald)] px-4 text-xs font-bold text-white transition-transform hover:opacity-95 active:scale-[0.98] sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{t.nav.download}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
