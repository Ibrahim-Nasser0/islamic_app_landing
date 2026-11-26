"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Download, Globe, Menu, X } from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";
import { ManuscriptCorners, RubElHizbMark } from "./GeometricMotifs";

interface NavbarProps {
  locale: Locale;
  downloadUrl: string;
  onDownloadClick?: () => void;
  onToggleLocale: () => void;
}

const SECTION_IDS = [
  "tour",
  "features",
  "lockscreen",
  "reliability",
  "timeline",
  "feedback",
] as const;

export function Navbar({
  locale,
  downloadUrl,
  onDownloadClick,
  onToggleLocale,
}: NavbarProps) {
  const t = landingCopy[locale];
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-32% 0px -52% 0px", threshold: [0.1, 0.4] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: "tour", label: t.nav.tour },
    { id: "features", label: t.nav.features },
    { id: "lockscreen", label: t.nav.lockscreen },
    { id: "reliability", label: t.nav.reliability },
    { id: "timeline", label: locale === "ar" ? "الإصدارات" : "Releases" },
    { id: "feedback", label: t.nav.feedback },
  ];

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
        <a
          href="#top"
          className="group flex items-center gap-3.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]/60"
        >
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
            <span
              aria-hidden="true"
              className="absolute inset-0.5 rotate-45 rounded-lg border border-[#D8B467]/30 bg-[#1B5E4F]/15 transition-transform duration-500 group-hover:rotate-[60deg]"
            />
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-[#D8B467]/50 bg-[#0D1E18] p-0.5 shadow-[inset_0_1px_0_rgba(245,223,164,0.22)]">
              <Image
                src="/images/app_logo.png"
                alt={t.brand}
                width={36}
                height={36}
                priority
                className="h-full w-full rounded-[9px] object-cover"
              />
            </div>
          </div>
          <div>
            <span className="font-sacred block text-lg leading-tight font-bold tracking-normal text-[#F7F1E3] sm:text-[19px]">
              {t.brand}
            </span>
            <span className="hidden text-[11px] text-[#8EA298] sm:block">
              {t.tagline}
            </span>
          </div>
        </a>

        {/* Desktop Mihrab Manuscript Navigation Ribbon */}
        <nav
          aria-label={t.brand}
          className="hidden items-center rounded-2xl border border-[#D8B467]/20 bg-[#0A1612]/90 px-2 py-1 shadow-[inset_0_1px_0_rgba(216,180,103,0.08)] lg:flex"
        >
          {navItems.map((item, idx) => {
            const isActive = activeId === item.id;
            return (
              <div key={item.id} className="flex items-center">
                {idx > 0 && (
                  <span
                    aria-hidden="true"
                    className="mx-1 h-1 w-1 rotate-45 bg-[#D8B467]/35"
                  />
                )}
                <a
                  href={`#${item.id}`}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "border border-[#D8B467]/40 bg-gradient-to-b from-[#1B5E4F]/75 to-[#124035]/75 text-[#F6E2A8]"
                      : "border border-transparent text-[#98ABA2] hover:bg-white/[0.03] hover:text-[#E5C67E]"
                  }`}
                >
                  {isActive && (
                    <RubElHizbMark className="h-2.5 w-2.5 shrink-0 text-[#E5C67E]" />
                  )}
                  <span>{item.label}</span>
                </a>
              </div>
            );
          })}
        </nav>

        {/* Actions: Locale Toggle, Emerald-Gold APK Button & Mobile Drawer Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLocale}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-[#D8B467]/25 bg-[#0B1813] px-3 text-xs font-semibold text-[#F2EFE9] transition-colors hover:border-[#D8B467]/55 hover:bg-[#10221C]"
          >
            <Globe className="h-3.5 w-3.5 text-[#D8B467]" />
            <span>{locale === "ar" ? "EN" : "عربي"}</span>
          </button>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDownloadClick}
            className="hidden h-10 items-center gap-2 rounded-xl border border-[#D8B467]/45 bg-gradient-to-b from-[#216E5C] to-[#13473B] px-4 text-xs font-bold text-[#FBF7ED] shadow-[inset_0_1px_0_rgba(245,223,164,0.22)] transition-all hover:brightness-110 active:scale-[0.98] sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5 text-[#F2D184]" />
            <span>{t.nav.download}</span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.nav.closeMenuLabel : t.nav.menuLabel}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8B467]/25 bg-[#0B1813] text-[#E5C67E] transition-colors hover:border-[#D8B467]/55 lg:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Sanctuary Drawer */}
      {menuOpen && (
        <div className="relative border-t border-[#D8B467]/15 bg-[#08130F]/98 px-5 py-4 lg:hidden">
          <ManuscriptCorners color="rgba(216, 180, 103, 0.35)" />
          <nav className="relative mx-auto flex max-w-md flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "border border-[#D8B467]/35 bg-[#1B5E4F]/45 text-[#F6E2A8]"
                      : "text-[#C5D2CC] hover:bg-white/[0.04] hover:text-[#E5C67E]"
                  }`}
                >
                  <span>{item.label}</span>
                  <RubElHizbMark
                    className={`h-3 w-3 ${
                      isActive ? "text-[#E5C67E]" : "text-[#D8B467]/35"
                    }`}
                  />
                </a>
              );
            })}
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                onDownloadClick?.();
                setMenuOpen(false);
              }}
              className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D8B467]/45 bg-gradient-to-b from-[#216E5C] to-[#13473B] text-sm font-bold text-[#FBF7ED] shadow-[inset_0_1px_0_rgba(245,223,164,0.22)] sm:hidden"
            >
              <Download className="h-4 w-4 text-[#F2D184]" />
              <span>{t.nav.download}</span>
            </a>
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
