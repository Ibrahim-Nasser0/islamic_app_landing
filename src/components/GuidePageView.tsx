import Link from "next/link";
import { BellRing, Download, MessageSquarePlus } from "lucide-react";
import {
  buildLocalizedPath,
  CommonMessages,
  GuideMessages,
  Locale,
} from "@/lib/i18n";
import { FooterSection } from "./FooterSection";
import {
  GoldHairlineDivider,
  ManuscriptCorners,
  OctagonalIconFrame,
  OctagramPatternOverlay,
  SANCTUARY_PRIMARY_CTA,
  SANCTUARY_SECONDARY_BTN,
  SectionSanctuaryHeader,
} from "./GeometricMotifs";
import { GuideBrandSection } from "./GuideBrandSection";
import { SiteHeader } from "./SiteHeader";

export function GuidePageView({
  locale,
  common,
  messages: t,
}: {
  locale: Locale;
  common: CommonMessages;
  messages: GuideMessages;
}) {
  const homePath = buildLocalizedPath(locale, "/");

  return (
    <div className="min-h-screen bg-[#07100D] text-[#F2EFE9]">
      <SiteHeader locale={locale} messages={common} activePage="guide" />

      <main id="main-content">
        {/* Hero Banner */}
        <section className="relative overflow-hidden border-b border-[var(--sanctuary-border)] bg-gradient-to-b from-[#07100D] via-[#0B1713] to-[#07100D] py-14 sm:py-20">
          <div className="text-[#2A8772]">
            <OctagramPatternOverlay />
          </div>
          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B467]/35 bg-[#0D1915] px-4 py-1.5 text-xs font-semibold text-[#E0B866]">
              <BellRing className="h-3.5 w-3.5" />
              <span>{t.eyebrow}</span>
            </div>

            <h1 className="font-sacred mt-5 text-3xl font-bold text-[#F4EFE4] sm:text-5xl">
              {t.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#92A49B] sm:text-base">
              {t.subtitle}
            </p>
          </div>
        </section>

        {/* 3 Core Android Permissions */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <SectionSanctuaryHeader
            centered
            eyebrow={t.checklistSection.eyebrow}
            title={t.checklistSection.title}
            subtitle={t.checklistSection.subtitle}
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {t.checklistSection.items.map((item) => (
              <div
                key={item.code}
                className="rounded-[26px] border border-[var(--sanctuary-border)] bg-[#0D1915] p-6"
              >
                <OctagonalIconFrame active>
                  <span className="font-sacred text-sm font-bold text-[#F5DFA4]">
                    {item.code}
                  </span>
                </OctagonalIconFrame>
                <h2 className="mt-4 text-base font-bold text-[#F4EFE4]">
                  {item.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-[#92A49B] sm:text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <GoldHairlineDivider />

        {/* Interactive Brand-by-Brand Filter & Cards */}
        <GuideBrandSection messages={t.brandsSection} />

        <GoldHairlineDivider />

        {/* 10-Second Verification */}
        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <div className="relative overflow-hidden rounded-[32px] border border-[#D8B467]/35 bg-[#0D1915] p-6 sm:p-10">
            <ManuscriptCorners />
            <SectionSanctuaryHeader
              eyebrow={t.verifySection.eyebrow}
              title={t.verifySection.title}
            />

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {t.verifySection.steps.map((step, idx) => (
                <div
                  key={step}
                  className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#07100D] p-5"
                >
                  <span className="font-latin inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#D8B467]/40 bg-[#132922] text-xs font-bold text-[#F5DFA4]">
                    {idx + 1}
                  </span>
                  <p className="mt-3 text-xs leading-relaxed text-[#D7E0DC] sm:text-sm">
                    {step}
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
                <span>{t.verifySection.downloadCta}</span>
              </Link>
              <Link
                href={`${homePath}#feedback`}
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${SANCTUARY_SECONDARY_BTN}`}
              >
                <MessageSquarePlus className="h-3.5 w-3.5 text-[#D8B467]" />
                <span>{t.verifySection.feedbackCta}</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterSection locale={locale} messages={common} />
    </div>
  );
}
