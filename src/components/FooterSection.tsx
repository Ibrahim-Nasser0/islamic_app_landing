import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Download,
  MessageSquarePlus,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { buildLocalizedPath, CommonMessages, Locale } from "@/lib/i18n";
import {
  GoldHairlineDivider,
  ManuscriptCorners,
  RubElHizbMark,
} from "./GeometricMotifs";
import { LiveDownloadNumber } from "./LandingStateProvider";

interface FooterSectionProps {
  locale: Locale;
  messages: CommonMessages;
  releaseVersion?: string;
  downloadCount?: number;
}

export function FooterSection({
  locale,
  messages,
  releaseVersion,
  downloadCount,
}: FooterSectionProps) {
  const f = messages.footer;
  const homePath = buildLocalizedPath(locale, "/");

  const sectionLinks = [
    { href: `${homePath}#features`, label: messages.nav.features },
    { href: `${homePath}#lockscreen`, label: messages.nav.lockscreen },
    { href: `${homePath}#tour`, label: messages.nav.tour },
    { href: `${homePath}#reliability`, label: messages.nav.reliability },
    { href: `${homePath}#download`, label: messages.nav.download },
    { href: `${homePath}#timeline`, label: messages.nav.releases },
  ];

  const pageLinks = [
    {
      href: buildLocalizedPath(locale, "/about"),
      label: f.links.about,
      icon: BookOpen,
    },
    {
      href: buildLocalizedPath(locale, "/guide"),
      label: f.links.guide,
      icon: Smartphone,
    },
    {
      href: buildLocalizedPath(locale, "/privacy"),
      label: f.links.privacy,
      icon: ShieldCheck,
    },
    {
      href: `${homePath}#feedback`,
      label: f.links.feedback,
      icon: MessageSquarePlus,
    },
  ];

  return (
    <>
      <GoldHairlineDivider />

      <footer className="relative overflow-hidden bg-[#060D0B] pt-14 pb-10">
        {/* Subtle warm gold zenith glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[520px] -translate-x-1/2 rounded-full bg-[#D8B467]/[0.04] blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          {/* Balanced 3-Column Sanctuary Grid */}
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Column 1: Brand & Waqf Summary */}
            <div className="lg:col-span-5">
              <Link
                href={homePath}
                className="group inline-flex items-center gap-3.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]"
              >
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0.5 rotate-45 rounded-lg border border-[#D8B467]/40 bg-[#0D1915] transition-transform duration-500 group-hover:rotate-[60deg]"
                  />
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[#D8B467]/55 bg-[#08120F] p-0.5 shadow-[inset_0_1px_0_rgba(245,223,164,0.2)]">
                    <Image
                      src="/images/app_logo.png"
                      alt={messages.brand}
                      width={40}
                      height={40}
                      className="h-full w-full rounded-[9px] object-cover"
                    />
                  </div>
                </div>
                <div>
                  <span className="font-sacred block text-xl font-bold text-[#F7F1E3]">
                    {messages.brand}
                  </span>
                  <span className="block text-xs text-[#D8B467]">
                    {messages.tagline}
                  </span>
                </div>
              </Link>

              <p className="mt-4 max-w-md text-xs leading-relaxed text-[#9BB0A6] sm:text-sm">
                {f.brandDesc}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {releaseVersion && (
                  <span className="font-latin inline-flex items-center gap-1.5 rounded-full border border-[#D8B467]/35 bg-[#0C1713] px-3 py-1 text-[11px] font-bold text-[#F5DFA4]">
                    <RubElHizbMark className="h-2.5 w-2.5 text-[#D8B467]" />
                    {releaseVersion}
                  </span>
                )}
                {(downloadCount ?? 0) > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8B467]/30 bg-[#0C1713] px-3 py-1 text-[11px] font-bold text-[#E5C67E]">
                    <Download className="h-3 w-3 text-[#D8B467]" />
                    <span>
                      <LiveDownloadNumber
                        initialCount={downloadCount ?? 0}
                        locale={locale}
                      />{" "}
                      {f.downloadsLabel}
                    </span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8B467]/25 bg-[#0C1713] px-3 py-1 text-[11px] font-semibold text-[#D8B467]">
                  <RubElHizbMark className="h-2.5 w-2.5 text-[#D8B467]" />
                  <span>{f.freeBadge}</span>
                </span>
              </div>
            </div>

            {/* Column 2: On This Page (2-Column Pill Links) */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2">
                <RubElHizbMark className="h-3 w-3 text-[#D8B467]" />
                <h3 className="text-xs font-bold tracking-wide text-[#F5DFA4]">
                  {f.colSections}
                </h3>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {sectionLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl border border-[#D8B467]/15 bg-[#0A1511]/80 px-3 py-2 text-xs font-medium text-[#A6B8B0] transition-colors hover:border-[#D8B467]/40 hover:bg-[#0E1D17] hover:text-[#F6E2A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 3: Pages & Guides (Uniform Gold Icons) */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2">
                <RubElHizbMark className="h-3 w-3 text-[#D8B467]" />
                <h3 className="text-xs font-bold tracking-wide text-[#F5DFA4]">
                  {f.colPages}
                </h3>
              </div>
              <ul className="mt-4 space-y-2">
                {pageLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group flex items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2 text-xs font-medium text-[#A6B8B0] transition-colors hover:border-[#D8B467]/25 hover:bg-[#0A1511] hover:text-[#F6E2A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]"
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 text-[#D8B467] transition-transform group-hover:scale-105" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Closing Framed Waqf Crest */}
          <div className="relative mt-10 overflow-hidden rounded-2xl border border-[#D8B467]/20 bg-[#0A1410]/90 px-5 py-6 text-center sm:px-8">
            <ManuscriptCorners color="rgba(216, 180, 103, 0.28)" />
            <p className="font-sacred mx-auto max-w-3xl text-sm leading-relaxed text-[#F4EFE4] sm:text-base">
              {f.waqf}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold text-[#D8B467]/90">
              <RubElHizbMark className="h-2.5 w-2.5" />
              <span>{f.builtWith}</span>
              <RubElHizbMark className="h-2.5 w-2.5" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
