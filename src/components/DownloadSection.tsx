"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Download, ExternalLink, Share2 } from "lucide-react";
import { buildTrackedDownloadPath } from "@/lib/download-url";
import { Locale, landingCopy } from "@/lib/landing-content";
import { ReleaseDownloadInfo } from "@/lib/github-release";
import {
  GoldHairlineDivider,
  ManuscriptCorners,
  RubElHizbMark,
  SANCTUARY_PRIMARY_CTA,
  SANCTUARY_SECONDARY_BTN,
} from "./GeometricMotifs";

const emptySubscribe = () => () => {};

interface DownloadSectionProps {
  locale: Locale;
  release: ReleaseDownloadInfo;
  downloadCount: number;
}

export function DownloadSection({
  locale,
  release,
  downloadCount,
}: DownloadSectionProps) {
  const t = landingCopy[locale].downloadSection;
  const brand = landingCopy[locale].brand;
  const footer = landingCopy[locale].footer;
  const isAr = locale === "ar";
  const [sharedCopied, setSharedCopied] = useState(false);

  const origin = useSyncExternalStore(
    emptySubscribe,
    () => window.location.origin,
    () => ""
  );

  const trackedDownloadHref = buildTrackedDownloadPath({
    source: "download_section",
    locale,
    version: release.version,
  });

  const qrUrl = origin
    ? `${origin}${buildTrackedDownloadPath({
        source: "qr",
        locale,
        version: release.version,
      })}`
    : release.downloadUrl;

  const handleShareCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setSharedCopied(true);
      setTimeout(() => setSharedCopied(false), 2000);
    } catch {
      // Clipboard ignored if unsupported
    }
  };

  return (
    <>
      <section id="download" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="relative grid items-center gap-8 overflow-hidden rounded-[32px] border border-[var(--sanctuary-gold)]/40 bg-[var(--sanctuary-surface)] p-7 shadow-sm sm:p-10 lg:grid-cols-12">
          <ManuscriptCorners />

          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8B467]/30 bg-[var(--sanctuary-paper)] px-3.5 py-1 text-xs font-semibold text-[#E5C67E]">
                <RubElHizbMark className="h-3 w-3" />
                <span>
                  {t.badge} • {release.version}
                </span>
              </span>
              {downloadCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/35 bg-[#10B981]/10 px-3 py-1 text-xs font-bold text-[#6EE7B7]">
                  <Download className="h-3 w-3" />
                  <span>
                    {downloadCount.toLocaleString(isAr ? "ar-EG" : "en-US")}{" "}
                    {isAr ? "تحميل" : "downloads"}
                  </span>
                </span>
              )}
            </div>
            <h2 className="font-sacred mt-4 text-2xl leading-[1.35] font-bold text-[#F4EFE4] sm:text-4xl sm:leading-[1.28]">
              {t.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--sanctuary-muted)] sm:text-base">
              {t.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap gap-3.5">
              <a
                href={trackedDownloadHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-13 items-center gap-2.5 rounded-2xl px-6 py-3 text-sm font-bold ${SANCTUARY_PRIMARY_CTA}`}
              >
                <Download className="h-4 w-4 text-[#F2D184]" />
                <span>{t.primaryBtn}</span>
                {release.fileSizeMb && (
                  <span className="font-latin text-xs text-white/85">
                    ({release.fileSizeMb} MB)
                  </span>
                )}
              </a>

              <a
                href={release.releasesPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-13 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold ${SANCTUARY_SECONDARY_BTN}`}
              >
                <ExternalLink className="h-4 w-4 text-[var(--sanctuary-gold)]" />
                <span>{t.allReleases}</span>
              </a>

              <button
                type="button"
                onClick={() => void handleShareCopy()}
                className={`inline-flex min-h-13 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold ${SANCTUARY_SECONDARY_BTN}`}
              >
                {sharedCopied ? (
                  <Check className="h-4 w-4 text-[#10B981]" />
                ) : (
                  <Share2 className="h-4 w-4 text-[var(--sanctuary-gold)]" />
                )}
                <span>{sharedCopied ? t.shareCopied : t.shareBtn}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-paper)] p-6 text-center lg:col-span-4">
            <div className="rounded-2xl border border-[#D8B467]/30 bg-white p-3.5 shadow-xs">
              <QRCodeSVG value={qrUrl} size={150} level="M" />
            </div>
            <p className="mt-4 text-xs font-bold text-[var(--sanctuary-ink)]">
              {t.qrLabel}
            </p>
            <p className="mt-1 text-[11px] text-[var(--sanctuary-muted)]">
              <span className="font-latin">
                {release.fileName ??
                  (isAr ? "تحميل مباشر عبر GitHub Releases" : "GitHub Releases • APK")}
              </span>
            </p>
          </div>
        </div>
      </section>

      <GoldHairlineDivider />

      <footer className="bg-[#060E0B] py-12 text-center">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-5">
          {/* Symmetric Closing Brand Medallion Crest */}
          <div className="relative mb-4 flex h-12 w-12 items-center justify-center">
            <span
              aria-hidden="true"
              className="absolute inset-0.5 rotate-45 rounded-lg border border-[#D8B467]/35 bg-[#1B5E4F]/15"
            />
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[#D8B467]/50 bg-[#0D1E18] p-0.5">
              <Image
                src="/images/app_logo.png"
                alt={brand}
                width={40}
                height={40}
                className="h-full w-full rounded-[9px] object-cover"
              />
            </div>
          </div>
          <p className="font-sacred text-base leading-relaxed text-[#F2EFE9] sm:text-lg">
            {footer.waqf}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-[var(--sanctuary-muted)]">
            <RubElHizbMark className="h-3 w-3 text-[#D8B467]/70" />
            <span>{footer.builtWith}</span>
            <RubElHizbMark className="h-3 w-3 text-[#D8B467]/70" />
          </div>
        </div>
      </footer>
    </>
  );
}
