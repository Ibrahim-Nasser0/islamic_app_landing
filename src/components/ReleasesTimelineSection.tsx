"use client";

import {
  Calendar,
  Download,
  ExternalLink,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { buildTrackedDownloadPath } from "@/lib/download-url";
import { ReleaseDownloadInfo } from "@/lib/github-release";
import { Locale } from "@/lib/landing-content";
import {
  AppReleaseItem,
  ReleaseHighlight,
  ReleaseHighlightType,
  ReleaseType,
} from "@/lib/supabase/config";
import {
  ManuscriptCorners,
  RubElHizbMark,
  SANCTUARY_PRIMARY_CTA,
  SANCTUARY_SECONDARY_BTN,
  SectionSanctuaryHeader,
} from "./GeometricMotifs";

interface ReleasesTimelineSectionProps {
  locale: Locale;
  releases: AppReleaseItem[];
  latestFallback: ReleaseDownloadInfo;
}

function getReleaseTypeLabel(type: ReleaseType, isAr: boolean): string {
  const labels: Record<ReleaseType, { ar: string; en: string }> = {
    major: { ar: "إصدار رئيسي", en: "Major" },
    minor: { ar: "تحديث ميزات", en: "Minor" },
    patch: { ar: "تحديث فرعي", en: "Patch" },
    hotfix: { ar: "إصلاح عاجل", en: "Hotfix" },
  };
  return isAr ? labels[type].ar : labels[type].en;
}

function getHighlightBadge(type: ReleaseHighlightType, isAr: boolean) {
  switch (type) {
    case "fix":
      return {
        label: isAr ? "إصلاح" : "Fix",
        icon: Wrench,
        className:
          "border-[#38BDF8]/35 bg-[#38BDF8]/10 text-[#7DD3FC]",
      };
    case "improvement":
      return {
        label: isAr ? "تحسين" : "Improved",
        icon: Zap,
        className:
          "border-[#D8B467]/40 bg-[#D8B467]/12 text-[#F2D184]",
      };
    case "feature":
    default:
      return {
        label: isAr ? "جديد" : "New",
        icon: Sparkles,
        className:
          "border-[#10B981]/40 bg-[#10B981]/12 text-[#6EE7B7]",
      };
  }
}

export function ReleasesTimelineSection({
  locale,
  releases,
  latestFallback,
}: ReleasesTimelineSectionProps) {
  const isAr = locale === "ar";

  const items: AppReleaseItem[] =
    releases.length > 0
      ? releases
      : [
          {
            id: "github-latest-fallback",
            version: latestFallback.version,
            release_type: "minor",
            title_ar: "الإصدار الحالي من زاد المسلم",
            title_en: "Current Release of Zad Al-Muslim",
            summary_ar:
              latestFallback.releaseNotes ??
              "يتضمن الأذان الأصلي فوق شاشة القفل، مواقيت الصلاة الفلكية، المصحف العثماني، الأذكار، وبوصلة القبلة.",
            summary_en:
              latestFallback.releaseNotes ??
              "Includes native lockscreen Adhan & Azkar, astronomical prayer times, Uthmani Quran, and Qibla compass.",
            highlights_ar: [],
            highlights_en: [],
            apk_url: latestFallback.hasDirectApk ? latestFallback.downloadUrl : null,
            github_release_url: latestFallback.releasesPageUrl,
            is_featured: true,
            is_published: true,
            released_at:
              latestFallback.publishedAt ?? new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];

  return (
    <section
      id="timeline"
      className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <SectionSanctuaryHeader
        centered
        eyebrow={isAr ? "سجل التطور والإصدارات" : "Release Timeline"}
        title={
          isAr
            ? "خط زمني يوثّق رحلة تطوير زاد المسلم"
            : "A living timeline of every Zad Al-Muslim release"
        }
        subtitle={
          isAr
            ? "تابع الميزات الجديدة والتحسينات وإصلاحات الموثوقية في كل نسخة تصدر من التطبيق."
            : "Follow new features, refinements, and reliability improvements shipped in each version."
        }
      />

      <div className="relative mt-12">
        {/* Vertical Gold Timeline Spine */}
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 start-4 w-px bg-gradient-to-b from-[#D8B467]/60 via-[#D8B467]/25 to-transparent sm:start-6"
        />

        <div className="space-y-7">
          {items.map((item, idx) => {
            const title = isAr
              ? item.title_ar
              : item.title_en?.trim() || item.title_ar;
            const summary = isAr
              ? item.summary_ar
              : item.summary_en?.trim() || item.summary_ar;
            const highlights: ReleaseHighlight[] = isAr
              ? item.highlights_ar
              : item.highlights_en?.length > 0
                ? item.highlights_en
                : item.highlights_ar;

            const dateStr = new Date(item.released_at).toLocaleDateString(
              isAr ? "ar-EG" : "en-US",
              { year: "numeric", month: "short", day: "numeric" }
            );

            const isLatest = idx === 0 || item.is_featured;
            const downloadHref = item.apk_url
              ? buildTrackedDownloadPath({
                  source: "timeline",
                  locale,
                  version: item.version,
                  target: item.apk_url,
                })
              : null;

            return (
              <article
                key={item.id}
                className="relative ps-11 sm:ps-16"
              >
                {/* Timeline Node */}
                <span
                  aria-hidden="true"
                  className={`absolute start-0.5 top-6 flex h-7 w-7 items-center justify-center rounded-full border sm:start-2.5 ${
                    isLatest
                      ? "border-[#D8B467] bg-[#163C31] shadow-[0_0_16px_rgba(216,180,103,0.35)]"
                      : "border-[#D8B467]/40 bg-[#0D1915]"
                  }`}
                >
                  <RubElHizbMark
                    className={`h-3.5 w-3.5 ${
                      isLatest ? "text-[#F2D184]" : "text-[#D8B467]/75"
                    }`}
                  />
                </span>

                <div
                  className={`relative overflow-hidden rounded-[26px] border p-5 shadow-sm transition-colors sm:p-7 ${
                    isLatest
                      ? "border-[#D8B467]/45 bg-gradient-to-br from-[#0F211B] via-[#0D1915] to-[#091310]"
                      : "border-[var(--sanctuary-border)] bg-[#0D1915]/95 hover:border-[#D8B467]/30"
                  }`}
                >
                  {isLatest && <ManuscriptCorners />}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-latin inline-flex items-center gap-1.5 rounded-xl border border-[#D8B467]/45 bg-[#132922] px-3 py-1 text-xs font-extrabold text-[#F5DFA4]">
                        {item.version}
                      </span>
                      <span className="rounded-xl border border-[#D8B467]/20 bg-[#07100D] px-2.5 py-1 text-[11px] font-semibold text-[#D8B467]">
                        {getReleaseTypeLabel(item.release_type, isAr)}
                      </span>
                      {idx === 0 && (
                        <span className="rounded-xl border border-[#10B981]/35 bg-[#10B981]/15 px-2.5 py-1 text-[11px] font-bold text-[#6EE7B7]">
                          {isAr ? "الأحدث" : "Latest"}
                        </span>
                      )}
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs text-[#92A49B]">
                      <Calendar className="h-3.5 w-3.5 text-[#D8B467]" />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <h3 className="font-sacred mt-3.5 text-xl font-bold text-[#F4EFE4] sm:text-2xl">
                    {title}
                  </h3>

                  {summary && (
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#9FB0A8]">
                      {summary}
                    </p>
                  )}

                  {highlights.length > 0 && (
                    <ul className="mt-4 space-y-2.5 border-t border-[#D8B467]/12 pt-4">
                      {highlights.map((h, hIdx) => {
                        const badge = getHighlightBadge(h.type, isAr);
                        const BadgeIcon = badge.icon;
                        return (
                          <li
                            key={`${item.id}-h-${hIdx}`}
                            className="flex items-start gap-2.5 text-sm text-[#E2E8E5]"
                          >
                            <span
                              className={`mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-bold ${badge.className}`}
                            >
                              <BadgeIcon className="h-3 w-3" />
                              <span>{badge.label}</span>
                            </span>
                            <span className="leading-relaxed">{h.text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {(downloadHref || item.github_release_url) && (
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {downloadHref && (
                        <a
                          href={downloadHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-bold ${SANCTUARY_PRIMARY_CTA}`}
                        >
                          <Download className="h-3.5 w-3.5 text-[#F2D184]" />
                          <span>
                            {isAr ? "تحميل هذا الإصدار" : "Download Build"}
                          </span>
                        </a>
                      )}
                      {item.github_release_url && (
                        <a
                          href={item.github_release_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-3.5 text-xs font-semibold ${SANCTUARY_SECONDARY_BTN}`}
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-[#D8B467]" />
                          <span>
                            {isAr ? "التفاصيل على GitHub" : "View on GitHub"}
                          </span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
