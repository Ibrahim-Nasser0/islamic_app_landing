"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Globe,
  Laptop,
  Lock,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { Locale } from "@/lib/landing-content";
import { privacyCopy } from "@/lib/privacy-content";
import {
  GoldHairlineDivider,
  ManuscriptCorners,
  OctagonalIconFrame,
  OctagramPatternOverlay,
  RubElHizbMark,
  SANCTUARY_PRIMARY_CTA,
  SANCTUARY_SECONDARY_BTN,
  SectionSanctuaryHeader,
} from "./GeometricMotifs";

export function PrivacyPageClient() {
  const [locale, setLocale] = useState<Locale>("ar");
  const isAr = locale === "ar";
  const t = privacyCopy[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isAr ? "rtl" : "ltr";
  }, [locale, isAr]);

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#07100D] text-[#F2EFE9]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#D8B467]/20 bg-[#060E0B]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-xl border border-[#D8B467]/50 bg-[#0D1E18] p-0.5">
              <Image
                src="/images/app_logo.png"
                alt={isAr ? siteConfig.appNameAr : siteConfig.appNameEn}
                width={36}
                height={36}
                className="h-full w-full rounded-[9px] object-cover"
              />
            </div>
            <div>
              <span className="font-sacred block text-base font-bold text-[#F7F1E3]">
                {isAr ? siteConfig.appNameAr : siteConfig.appNameEn}
              </span>
              <span className="block text-[11px] text-[#D8B467]">
                {t.headerSubtitle}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLocale((l) => (l === "ar" ? "en" : "ar"))}
              className="flex h-10 items-center gap-1.5 rounded-xl border border-[#D8B467]/25 bg-[#0B1813] px-3 text-xs font-semibold text-[#F2EFE9] transition-colors hover:border-[#D8B467]/55 hover:bg-[#10221C]"
            >
              <Globe className="h-3.5 w-3.5 text-[#D8B467]" />
              <span>{isAr ? "EN" : "عربي"}</span>
            </button>

            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#D8B467]/35 bg-[#0B1813] px-3.5 text-xs font-bold text-[#F6E2A8] transition-colors hover:bg-[#132922]"
            >
              {isAr ? (
                <ArrowRight className="h-3.5 w-3.5 text-[#D8B467]" />
              ) : (
                <ArrowLeft className="h-3.5 w-3.5 text-[#D8B467]" />
              )}
              <span>{t.backHome}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-[var(--sanctuary-border)] bg-gradient-to-b from-[#07100D] via-[#0B1713] to-[#07100D] py-14 sm:py-20">
        <div className="text-[#2A8772]">
          <OctagramPatternOverlay />
        </div>
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B467]/35 bg-[#0D1915] px-4 py-1.5 text-xs font-semibold text-[#E0B866]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t.eyebrow}</span>
          </div>

          <h1 className="font-sacred mt-5 text-3xl font-bold text-[#F4EFE4] sm:text-5xl">
            {t.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#92A49B] sm:text-base">
            {t.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {t.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3.5 py-1 text-xs font-semibold text-[#6EE7B7]"
              >
                <RubElHizbMark className="h-2.5 w-2.5 text-[#6EE7B7]" />
                <span>{badge}</span>
              </span>
            ))}
          </div>

          <p className="mt-4 text-xs text-[#7D8F87]">{t.lastUpdated}</p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="#app-privacy"
              className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-xs font-bold ${SANCTUARY_PRIMARY_CTA}`}
            >
              <Smartphone className="h-4 w-4 text-[#F2D184]" />
              <span>{t.quickNavApp}</span>
            </a>
            <a
              href="#web-privacy"
              className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-xs font-semibold ${SANCTUARY_SECONDARY_BTN}`}
            >
              <Laptop className="h-4 w-4 text-[#D8B467]" />
              <span>{t.quickNavWeb}</span>
            </a>
            <a
              href="#rights"
              className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-xs font-semibold ${SANCTUARY_SECONDARY_BTN}`}
            >
              <Lock className="h-4 w-4 text-[#D8B467]" />
              <span>{t.quickNavRights}</span>
            </a>
          </div>
        </div>
      </section>

      <main>
        {/* Part 1: Mobile App Privacy */}
        <section id="app-privacy" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <SectionSanctuaryHeader
            eyebrow={t.appSection.eyebrow}
            title={t.appSection.title}
            subtitle={t.appSection.subtitle}
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {t.appSection.cards.map((card, idx) => (
              <div
                key={card.title}
                className="relative overflow-hidden rounded-[26px] border border-[#D8B467]/25 bg-[#0D1915] p-6 shadow-sm"
              >
                {idx === 0 && <ManuscriptCorners color="rgba(216, 180, 103, 0.35)" />}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <OctagonalIconFrame active>
                      <Smartphone className="h-4 w-4" />
                    </OctagonalIconFrame>
                    <h2 className="text-base font-bold text-[#F4EFE4] sm:text-lg">
                      {card.title}
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#10B981]/35 bg-[#10B981]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#6EE7B7]">
                    {card.badge}
                  </span>
                </div>

                <ul className="mt-4 space-y-2.5 border-t border-[#D8B467]/12 pt-4">
                  {card.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-[#A8B8B0] sm:text-sm"
                    >
                      <RubElHizbMark className="mt-1.5 h-2.5 w-2.5 shrink-0 text-[#D8B467]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <GoldHairlineDivider />

        {/* Part 2: Web Privacy */}
        <section id="web-privacy" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <SectionSanctuaryHeader
            eyebrow={t.webSection.eyebrow}
            title={t.webSection.title}
            subtitle={t.webSection.subtitle}
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {t.webSection.cards.map((card, idx) => (
              <div
                key={card.title}
                className="relative overflow-hidden rounded-[26px] border border-[var(--sanctuary-border)] bg-[#0D1915] p-6 shadow-sm"
              >
                {idx === 1 && <ManuscriptCorners color="rgba(216, 180, 103, 0.35)" />}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <OctagonalIconFrame>
                      <Laptop className="h-4 w-4" />
                    </OctagonalIconFrame>
                    <h2 className="text-base font-bold text-[#F4EFE4] sm:text-lg">
                      {card.title}
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#D8B467]/35 bg-[#132922] px-2.5 py-0.5 text-[11px] font-bold text-[#F2D184]">
                    {card.badge}
                  </span>
                </div>

                <ul className="mt-4 space-y-2.5 border-t border-[#D8B467]/12 pt-4">
                  {card.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-[#A8B8B0] sm:text-sm"
                    >
                      <RubElHizbMark className="mt-1.5 h-2.5 w-2.5 shrink-0 text-[#D8B467]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <GoldHairlineDivider />

        {/* Part 3: Your Rights & Contact */}
        <section id="rights" className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <div className="relative overflow-hidden rounded-[32px] border border-[#D8B467]/35 bg-[#0D1915] p-6 shadow-lg sm:p-10">
            <ManuscriptCorners />
            <SectionSanctuaryHeader
              eyebrow={t.rightsSection.eyebrow}
              title={t.rightsSection.title}
              subtitle={t.rightsSection.subtitle}
            />

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {t.rightsSection.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#07100D] p-5"
                >
                  <h3 className="text-sm font-bold text-[#E5C67E]">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#92A49B]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#feedback"
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-xs font-bold ${SANCTUARY_PRIMARY_CTA}`}
              >
                <span>{t.rightsSection.feedbackCta}</span>
              </Link>
              <a
                href={siteConfig.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-xs font-semibold ${SANCTUARY_SECONDARY_BTN}`}
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#D8B467]" />
                <span>{t.rightsSection.githubCta}</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
