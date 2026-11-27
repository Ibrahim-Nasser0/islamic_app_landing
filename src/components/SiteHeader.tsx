"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, Globe, Menu, X } from "lucide-react";
import {
  buildLocalizedPath,
  CommonMessages,
  LOCALE_COOKIE_NAME,
  Locale,
  switchLocaleInPath,
} from "@/lib/i18n";
import { ManuscriptCorners, RubElHizbMark } from "./GeometricMotifs";

interface SiteHeaderProps {
  locale: Locale;
  messages: CommonMessages;
  activePage: "home" | "about" | "guide" | "privacy";
}

export function SiteHeader({ locale, messages, activePage }: SiteHeaderProps) {
  const pathname = usePathname();
  const isHome = activePage === "home";
  const isAr = locale === "ar";
  const nextLocale: Locale = isAr ? "en" : "ar";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const homePath = buildLocalizedPath(locale, "/");
  const downloadHref = isHome ? "#download" : buildLocalizedPath(locale, "/#download");

  // Top-level navigation strictly consists of real pages (Hick's & Jakob's Law)
  const navItems = [
    {
      id: "home" as const,
      href: homePath,
      label: messages.nav.home,
    },
    {
      id: "guide" as const,
      href: buildLocalizedPath(locale, "/guide"),
      label: messages.nav.guide,
    },
    {
      id: "about" as const,
      href: buildLocalizedPath(locale, "/about"),
      label: messages.nav.about,
    },
    {
      id: "privacy" as const,
      href: buildLocalizedPath(locale, "/privacy"),
      label: messages.nav.privacy,
    },
  ];

  const switchHref = switchLocaleInPath(pathname || homePath, nextLocale);

  const persistLocaleCookie = () => {
    document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#060E0B]/92 backdrop-blur-xl transition-all duration-300">
      {/* Top Sacred Basmala Threshold Frieze (gently collapses on scroll) */}
      <div
        className={`overflow-hidden border-b border-[#D8B467]/12 bg-[#040A08]/90 transition-all duration-300 ${
          scrolled ? "max-h-0 border-b-0 opacity-0" : "max-h-9 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-5 py-1.5 sm:px-8">
          <span className="h-px max-w-20 flex-1 bg-gradient-to-r from-transparent to-[#D8B467]/45" />
          <RubElHizbMark className="h-2.5 w-2.5 text-[#D8B467]/75" />
          <p
            lang="ar"
            dir="rtl"
            className="font-sacred text-[12px] tracking-wide text-[#E5C67E]/90"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <RubElHizbMark className="h-2.5 w-2.5 text-[#D8B467]/75" />
          <span className="h-px max-w-20 flex-1 bg-gradient-to-l from-transparent to-[#D8B467]/45" />
        </div>
      </div>

      {/* Main Architectural Sanctuary Bar */}
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 transition-all duration-300 sm:px-8 ${
          scrolled ? "py-2.5" : "py-3.5"
        }`}
      >
        {/* Illuminated Octagonal Medallion Crest + Calligraphic Brand */}
        <Link
          href={homePath}
          className="group flex items-center gap-3.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]"
        >
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
            <span
              aria-hidden="true"
              className="absolute inset-0.5 rotate-45 rounded-lg border border-[#D8B467]/30 bg-[#1B5E4F]/15 transition-transform duration-500 group-hover:rotate-[60deg]"
            />
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-[#D8B467]/50 bg-[#0D1E18] p-0.5 shadow-[inset_0_1px_0_rgba(245,223,164,0.22)]">
              <Image
                src="/images/app_logo.png"
                alt={messages.brand}
                width={36}
                height={36}
                priority
                className="h-full w-full rounded-[9px] object-cover"
              />
            </div>
          </div>
          <div>
            <span className="font-sacred block text-lg leading-tight font-bold tracking-normal text-[#F7F1E3] sm:text-[19px]">
              {messages.brand}
            </span>
            <span className="hidden text-[11px] text-[#8EA298] sm:block">
              {messages.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Unified Page Navigation Ribbon */}
        <nav
          aria-label={messages.brand}
          className="hidden items-center rounded-2xl border border-[#D8B467]/20 bg-[#0A1612]/90 px-2 py-1 shadow-[inset_0_1px_0_rgba(216,180,103,0.08)] lg:flex"
        >
          {navItems.map((item, idx) => {
            const isCurrent = activePage === item.id;
            return (
              <div key={item.id} className="flex items-center">
                {idx > 0 && (
                  <span
                    aria-hidden="true"
                    className="mx-1 h-1 w-1 rotate-45 bg-[#D8B467]/35"
                  />
                )}
                <Link
                  href={item.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${
                    isCurrent
                      ? "border border-[#D8B467]/40 bg-gradient-to-b from-[#1B5E4F]/75 to-[#124035]/75 text-[#F6E2A8]"
                      : "border border-transparent text-[#98ABA2] hover:bg-white/[0.03] hover:text-[#E5C67E]"
                  }`}
                >
                  {isCurrent && (
                    <RubElHizbMark className="h-2.5 w-2.5 shrink-0 text-[#E5C67E]" />
                  )}
                  <span>{item.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Actions: Locale Switcher, Download Section CTA & Mobile Drawer Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href={switchHref}
            hrefLang={nextLocale}
            onClick={persistLocaleCookie}
            aria-label={messages.nav.switchLocaleAria}
            className="flex h-11 items-center gap-1.5 rounded-xl border border-[#D8B467]/25 bg-[#0B1813] px-3 text-xs font-semibold text-[#F2EFE9] transition-colors hover:border-[#D8B467]/55 hover:bg-[#10221C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]"
          >
            <Globe className="h-3.5 w-3.5 text-[#D8B467]" />
            <span>{messages.nav.switchLocaleLabel}</span>
          </Link>

          <Link
            href={downloadHref}
            className="hidden h-11 items-center gap-2 rounded-xl border border-[#D8B467]/45 bg-gradient-to-b from-[#216E5C] to-[#13473B] px-4 text-xs font-bold text-[#FBF7ED] shadow-[inset_0_1px_0_rgba(245,223,164,0.22)] transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] active:scale-[0.98] sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5 text-[#F2D184]" />
            <span>{messages.nav.download}</span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={
              menuOpen ? messages.nav.closeMenuLabel : messages.nav.menuLabel
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D8B467]/25 bg-[#0B1813] text-[#E5C67E] transition-colors hover:border-[#D8B467]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] lg:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Sanctuary Drawer */}
      {menuOpen && (
        <div className="relative border-t border-[#D8B467]/15 bg-[#08130F]/98 px-5 py-4 lg:hidden">
          <ManuscriptCorners color="rgba(216, 180, 103, 0.35)" />
          <nav
            aria-label={messages.nav.menuLabel}
            className="relative mx-auto flex max-w-md flex-col gap-1.5"
          >
            {navItems.map((item) => {
              const isCurrent = activePage === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-11 items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${
                    isCurrent
                      ? "border border-[#D8B467]/35 bg-[#1B5E4F]/45 text-[#F6E2A8]"
                      : "text-[#C5D2CC] hover:bg-white/[0.04] hover:text-[#E5C67E]"
                  }`}
                >
                  <span>{item.label}</span>
                  <RubElHizbMark
                    className={`h-3 w-3 ${
                      isCurrent ? "text-[#E5C67E]" : "text-[#D8B467]/35"
                    }`}
                  />
                </Link>
              );
            })}
            <Link
              href={downloadHref}
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D8B467]/45 bg-gradient-to-b from-[#216E5C] to-[#13473B] text-sm font-bold text-[#FBF7ED] shadow-[inset_0_1px_0_rgba(245,223,164,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] sm:hidden"
            >
              <Download className="h-4 w-4 text-[#F2D184]" />
              <span>{messages.nav.download}</span>
            </Link>
          </nav>
        </div>
      )}

      {/* Bottom Gold Hairline with Central Rub el-Hizb Keystone */}
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-[#D8B467]/38 to-transparent">
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#D8B467]/40 bg-[#07100D]"
        >
          <RubElHizbMark className="h-2.5 w-2.5 text-[#D8B467]" />
        </span>
      </div>
    </header>
  );
}
