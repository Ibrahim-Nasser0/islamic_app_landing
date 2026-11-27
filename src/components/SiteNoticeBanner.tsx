"use client";

import { useState } from "react";
import { AlertTriangle, ArrowUpRight, BellRing, Info, X } from "lucide-react";
import { buildLocalizedPath, CommonMessages, Locale } from "@/lib/i18n";
import { SiteNoticeItem } from "@/lib/supabase/config";

interface SiteNoticeBannerProps {
  notice: SiteNoticeItem | null;
  locale: Locale;
  messages: CommonMessages["siteNotice"];
}

function isSafeHref(url: string | null): url is string {
  if (!url) return false;
  return (
    url.startsWith("/") ||
    url.startsWith("#") ||
    url.startsWith("https://") ||
    url.startsWith("http://")
  );
}

export function SiteNoticeBanner({
  notice,
  locale,
  messages,
}: SiteNoticeBannerProps) {
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  if (!notice || dismissedId === notice.id) {
    return null;
  }

  const isAr = locale === "ar";
  const text = isAr
    ? notice.title_ar
    : notice.title_en?.trim() || notice.title_ar;
  const ctaLabel = isAr
    ? notice.cta_label_ar
    : notice.cta_label_en?.trim() || notice.cta_label_ar;

  const styleMap = {
    release: {
      wrapper:
        "border-[#D8B467]/35 bg-gradient-to-r from-[#1A2618] via-[#132922] to-[#1A2618] text-[#F6E2A8]",
      badge: "border-[#D8B467]/45 bg-[#D8B467]/15 text-[#F2D184]",
      icon: BellRing,
    },
    warning: {
      wrapper:
        "border-[#F59E0B]/35 bg-gradient-to-r from-[#241B0D] via-[#1B160D] to-[#241B0D] text-[#FDE68A]",
      badge: "border-[#F59E0B]/45 bg-[#F59E0B]/15 text-[#FCD34D]",
      icon: AlertTriangle,
    },
    info: {
      wrapper:
        "border-[#D8B467]/30 bg-gradient-to-r from-[#0A1E18] via-[#0F2A22] to-[#0A1E18] text-[#F2EFE9]",
      badge: "border-[#D8B467]/40 bg-[#D8B467]/15 text-[#E5C67E]",
      icon: Info,
    },
  } as const;

  const variant = styleMap[notice.variant] ?? styleMap.info;
  const Icon = variant.icon;

  const resolvedCtaUrl =
    notice.cta_url &&
    notice.cta_url.startsWith("/") &&
    !notice.cta_url.startsWith("/ar") &&
    !notice.cta_url.startsWith("/en")
      ? buildLocalizedPath(locale, notice.cta_url)
      : notice.cta_url;

  return (
    <div className={`border-b px-4 py-1.5 text-xs sm:px-8 ${variant.wrapper}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2.5 text-center sm:justify-start sm:text-start">
          <span
            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${variant.badge}`}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
          <p className="truncate font-medium sm:whitespace-normal">{text}</p>
          {ctaLabel && isSafeHref(resolvedCtaUrl) && (
            <a
              href={resolvedCtaUrl}
              target={resolvedCtaUrl.startsWith("http") ? "_blank" : undefined}
              rel={
                resolvedCtaUrl.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-lg border border-current/25 bg-black/20 px-2.5 py-1 text-[11px] font-bold transition-colors hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] sm:min-h-8"
            >
              <span>{ctaLabel}</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDismissedId(notice.id)}
          aria-label={messages.dismiss}
          className="-my-1.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-current/75 transition-colors hover:bg-white/10 hover:text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
