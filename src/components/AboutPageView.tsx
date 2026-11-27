import Link from "next/link";
import {
  BellRing,
  BookOpen,
  Compass,
  Download,
  ExternalLink,
  HeartHandshake,
  MapPin,
  ScrollText,
  Volume2,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import {
  AboutMessages,
  buildLocalizedPath,
  CommonMessages,
  Locale,
} from "@/lib/i18n";
import { FooterSection } from "./FooterSection";
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
import { SiteHeader } from "./SiteHeader";

const SOURCE_ICONS: Record<string, typeof BookOpen> = {
  quran: BookOpen,
  hadith: ScrollText,
  prayers: Compass,
  audio: Volume2,
  mosques: MapPin,
  native: BellRing,
};

export function AboutPageView({
  locale,
  common,
  messages: t,
}: {
  locale: Locale;
  common: CommonMessages;
  messages: AboutMessages;
}) {
  const homePath = buildLocalizedPath(locale, "/");

  return (
    <div className="min-h-screen bg-[#07100D] text-[#F2EFE9]">
      <SiteHeader locale={locale} messages={common} activePage="about" />

      <main id="main-content">
        {/* Hero Banner */}
        <section className="relative overflow-hidden border-b border-[var(--sanctuary-border)] bg-gradient-to-b from-[#07100D] via-[#0B1713] to-[#07100D] py-14 sm:py-20">
          <div className="text-[#2A8772]">
            <OctagramPatternOverlay />
          </div>
          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B467]/35 bg-[#0D1915] px-4 py-1.5 text-xs font-semibold text-[#E0B866]">
              <HeartHandshake className="h-3.5 w-3.5" />
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D8B467]/30 bg-[#0C1713] px-3.5 py-1 text-xs font-semibold text-[#F5DFA4]"
                >
                  <RubElHizbMark className="h-2.5 w-2.5 text-[#D8B467]" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Story & Mission */}
        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <div className="relative overflow-hidden rounded-[32px] border border-[#D8B467]/35 bg-[#0D1915] p-6 sm:p-10">
            <ManuscriptCorners />
            <SectionSanctuaryHeader
              eyebrow={t.storySection.eyebrow}
              title={t.storySection.title}
            />

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#B2C2BA] sm:text-base">
              {t.storySection.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-[#D8B467]/25 bg-[#07100D] px-6 py-5 text-center">
              <p
                lang="ar"
                dir="rtl"
                className="font-sacred text-xl text-[#F5DFA4] sm:text-2xl"
              >
                {t.storySection.waqfQuote}
              </p>
              <p className="mt-1.5 text-xs text-[#92A49B]">
                {t.storySection.waqfSource}
              </p>
            </div>
          </div>
        </section>

        <GoldHairlineDivider />

        {/* 4 Core Pillars */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <SectionSanctuaryHeader
            centered
            eyebrow={t.pillarsSection.eyebrow}
            title={t.pillarsSection.title}
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {t.pillarsSection.items.map((item) => (
              <div
                key={item.metric}
                className="rounded-[26px] border border-[var(--sanctuary-border)] bg-[#0D1915] p-6"
              >
                <OctagonalIconFrame active>
                  <span className="font-sacred text-sm font-bold text-[#F5DFA4]">
                    {item.metric}
                  </span>
                </OctagonalIconFrame>
                <h2 className="mt-4 text-base font-bold text-[#F4EFE4]">
                  {item.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-[#92A49B]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <GoldHairlineDivider />

        {/* Verified Sources & Stack */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <SectionSanctuaryHeader
            eyebrow={t.sourcesSection.eyebrow}
            title={t.sourcesSection.title}
            subtitle={t.sourcesSection.subtitle}
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {t.sourcesSection.items.map((item) => {
              const Icon = SOURCE_ICONS[item.id] ?? BookOpen;
              return (
                <div
                  key={item.id}
                  className="rounded-[26px] border border-[#D8B467]/25 bg-[#0D1915] p-6 transition-colors hover:border-[#D8B467]/45"
                >
                  <div className="flex items-center justify-between gap-2">
                    <OctagonalIconFrame>
                      <Icon className="h-4 w-4 text-[#E0B866]" />
                    </OctagonalIconFrame>
                    <span className="rounded-full border border-[#D8B467]/25 bg-[#07100D] px-3 py-1 text-[11px] font-semibold text-[#D8B467]">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#F4EFE4]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#92A49B] sm:text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <GoldHairlineDivider />

        {/* Contribute / Sadaqah Jariyah */}
        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <div className="relative overflow-hidden rounded-[32px] border border-[#D8B467]/35 bg-[#0D1915] p-6 sm:p-10">
            <ManuscriptCorners />
            <SectionSanctuaryHeader
              eyebrow={t.contributeSection.eyebrow}
              title={t.contributeSection.title}
              subtitle={t.contributeSection.subtitle}
            />

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {t.contributeSection.ways.map((way) => (
                <div
                  key={way.title}
                  className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#07100D] p-5"
                >
                  <h3 className="text-sm font-bold text-[#E5C67E]">
                    {way.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#92A49B]">
                    {way.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`${homePath}#download`}
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${SANCTUARY_PRIMARY_CTA}`}
              >
                <Download className="h-3.5 w-3.5 text-[#F2D184]" />
                <span>{t.contributeSection.downloadCta}</span>
              </Link>
              <a
                href={siteConfig.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${SANCTUARY_SECONDARY_BTN}`}
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#D8B467]" />
                <span>{t.contributeSection.githubCta}</span>
              </a>
              <Link
                href={`${homePath}#feedback`}
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${SANCTUARY_SECONDARY_BTN}`}
              >
                <span>{t.contributeSection.feedbackCta}</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterSection locale={locale} messages={common} />
    </div>
  );
}
