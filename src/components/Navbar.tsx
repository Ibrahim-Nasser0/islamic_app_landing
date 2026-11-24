"use client";

import Image from "next/image";
import { Download, Globe } from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";

interface NavbarProps {
  locale: Locale;
  downloadUrl: string;
  onToggleLocale: () => void;
}

export function Navbar({
  locale,
  downloadUrl,
  onToggleLocale,
}: NavbarProps) {
  const t = landingCopy[locale];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--sanctuary-border)] bg-[#07100D]/88 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#top" className="flex items-center gap-3">
          <Image
            src="/images/app_logo.png"
            alt={t.brand}
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-xl border border-[#D8B467]/35 object-cover shadow-xs"
          />
          <div>
            <span className="block text-base font-bold tracking-tight text-[#F2EFE9]">
              {t.brand}
            </span>
            <span className="hidden text-[11px] text-[#92A49B] sm:block">
              {t.tagline}
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-xs font-semibold text-[#92A49B] lg:flex">
          <a href="#tour" className="transition-colors hover:text-[#E0B866]">
            {t.nav.tour}
          </a>
          <a href="#features" className="transition-colors hover:text-[#E0B866]">
            {t.nav.features}
          </a>
          <a href="#lockscreen" className="transition-colors hover:text-[#E0B866]">
            {t.nav.lockscreen}
          </a>
          <a href="#reliability" className="transition-colors hover:text-[#E0B866]">
            {t.nav.reliability}
          </a>
          <a href="#feedback" className="transition-colors hover:text-[#E0B866]">
            {t.nav.feedback}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLocale}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-[var(--sanctuary-border)] bg-[#0D1915] px-3.5 text-xs font-semibold text-[#F2EFE9] transition-colors hover:border-[#D8B467]"
          >
            <Globe className="h-3.5 w-3.5 text-[#D8B467]" />
            <span>{locale === "ar" ? "EN" : "عربي"}</span>
          </button>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 items-center gap-2 rounded-xl bg-[#1B5E4F] px-4 text-xs font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5 text-[#E0B866]" />
            <span>{t.nav.download}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
