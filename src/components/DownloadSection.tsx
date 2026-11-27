"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";
import {
  Check,
  Cpu,
  Download,
  ExternalLink,
  RotateCcw,
  Share2,
} from "lucide-react";
import { ApkArch, resolveApkVariant } from "@/lib/device-apk";
import { buildTrackedDownloadPath } from "@/lib/download-url";
import { ReleaseDownloadInfo } from "@/lib/github-release";
import { HomeMessages, Locale } from "@/lib/i18n";
import {
  ManuscriptCorners,
  RubElHizbMark,
  SANCTUARY_PRIMARY_CTA,
  SANCTUARY_SECONDARY_BTN,
} from "./GeometricMotifs";
import { useLandingState } from "./LandingStateProvider";

const QrCodeBox = dynamic(
  () => import("./QrCodeBox").then((m) => m.QrCodeBox),
  { ssr: false }
);

const emptySubscribe = () => () => {};

interface DownloadSectionProps {
  locale: Locale;
  messages: HomeMessages["downloadSection"];
  release: ReleaseDownloadInfo;
  initialDownloadCount: number;
}

export function DownloadSection({
  locale,
  messages: t,
  release,
  initialDownloadCount,
}: DownloadSectionProps) {
  const ctx = useLandingState();
  const detection = ctx?.detection ?? null;
  const downloadCount = ctx?.downloadCount ?? initialDownloadCount;

  const isAr = locale === "ar";
  const [sharedCopied, setSharedCopied] = useState(false);
  const [selectedArchOverride, setSelectedArchOverride] =
    useState<ApkArch | null>(null);

  const origin = useSyncExternalStore(
    emptySubscribe,
    () => window.location.origin,
    () => ""
  );

  const detectedArch = detection?.arch ?? null;
  const effectiveArch = selectedArchOverride ?? detectedArch;
  const activeVariant = effectiveArch
    ? resolveApkVariant(release.variants, effectiveArch)
    : null;
  const displaySizeMb = activeVariant?.sizeMb ?? release.fileSizeMb;
  const displayFileName = activeVariant?.fileName ?? release.fileName;

  const trackedDownloadHref = buildTrackedDownloadPath({
    source: "download_section",
    locale,
    version: release.version,
    arch: effectiveArch,
  });

  // Omit desktop arch from QR URL so scanning on a phone resolves the phone's own arch
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

  const detectionStatusBanner =
    selectedArchOverride !== null
      ? t.manualOverrideBanner
      : detection?.source !== "fallback" && detection
        ? t.matchedBanner
        : t.universalFallbackBanner;

  return (
    <section
      id="download"
      className="scroll-mt-28 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="relative grid items-start gap-8 overflow-hidden rounded-[32px] border border-[var(--sanctuary-gold)]/40 bg-[var(--sanctuary-surface)] p-7 shadow-sm sm:p-10 lg:grid-cols-12">
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
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8B467]/30 bg-[#0C1713] px-3 py-1 text-xs font-bold text-[#E5C67E]">
                <Download className="h-3 w-3 text-[#D8B467]" />
                <span>
                  {downloadCount.toLocaleString(isAr ? "ar-EG" : "en-US")}{" "}
                  {t.downloadsLabel}
                </span>
              </span>
            )}
            {activeVariant && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8B467]/35 bg-[#132922] px-3 py-1 text-xs font-semibold text-[#F5DFA4]">
                <Cpu className="h-3 w-3 text-[#D8B467]" />
                <span>
                  {selectedArchOverride === null
                    ? `${t.recommendedArchLabel}: `
                    : ""}
                  <span className="font-latin">{activeVariant.arch}</span>
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
              onClick={ctx?.incrementDownloadCount}
              className={`inline-flex min-h-13 items-center gap-2.5 rounded-2xl px-6 py-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${SANCTUARY_PRIMARY_CTA}`}
            >
              <Download className="h-4 w-4 text-[#F2D184]" />
              <span>{t.primaryBtn}</span>
              {displaySizeMb && (
                <span className="font-latin text-xs text-white/85">
                  ({displaySizeMb} MB)
                </span>
              )}
            </a>

            <a
              href={release.releasesPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-13 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${SANCTUARY_SECONDARY_BTN}`}
            >
              <ExternalLink className="h-4 w-4 text-[var(--sanctuary-gold)]" />
              <span>{t.allReleases}</span>
            </a>

            <button
              type="button"
              onClick={() => void handleShareCopy()}
              className={`inline-flex min-h-13 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${SANCTUARY_SECONDARY_BTN}`}
            >
              {sharedCopied ? (
                <Check className="h-4 w-4 text-[#10B981]" />
              ) : (
                <Share2 className="h-4 w-4 text-[var(--sanctuary-gold)]" />
              )}
              <span>{sharedCopied ? t.shareCopied : t.shareBtn}</span>
            </button>
          </div>

          {release.variants.length > 1 && (
            <div className="mt-6 rounded-2xl border border-[#D8B467]/25 bg-[var(--sanctuary-paper)]/85 p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-[#F4EFE4]">
                    {t.selectArchTitle}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#92A49B]">
                    {detectionStatusBanner}
                  </p>
                </div>
                {selectedArchOverride !== null && (
                  <button
                    type="button"
                    onClick={() => setSelectedArchOverride(null)}
                    className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-[#D8B467]/35 bg-[#0D1915] px-3 py-1.5 text-[11px] font-semibold text-[#E5C67E] transition-colors hover:border-[#D8B467]/60 hover:text-[#F6E2A8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>{t.resetAutoBtn}</span>
                  </button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {release.variants.map((variant) => {
                  const isSelected = activeVariant?.arch === variant.arch;
                  const archInfo = t.archLabels[variant.arch];
                  return (
                    <button
                      key={variant.arch}
                      type="button"
                      onClick={() => setSelectedArchOverride(variant.arch)}
                      className={`flex flex-col justify-between rounded-2xl border p-3.5 text-start transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${
                        isSelected
                          ? "border-[#D8B467]/70 bg-gradient-to-br from-[#173D32] to-[#0D1D18] shadow-sm"
                          : "border-[var(--sanctuary-border)] bg-[#07100D]/90 hover:border-[#D8B467]/40"
                      }`}
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#F4EFE4]">
                            {archInfo.label}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                              isSelected
                                ? "border-[#D8B467]/55 bg-[#D8B467]/15 text-[#F5DFA4]"
                                : "border-[#D8B467]/25 bg-[#10201A] text-[#D8B467]"
                            }`}
                          >
                            {isSelected ? t.selectedBadge : archInfo.badge}
                          </span>
                        </div>

                        <div className="mt-1.5 flex items-center gap-2 font-latin text-[11px] text-[#E5C67E]">
                          <span className="rounded bg-black/30 px-1.5 py-0.5 font-semibold">
                            {variant.arch}
                          </span>
                          {variant.sizeMb && (
                            <span className="text-[#92A49B]">
                              • {variant.sizeMb} MB
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-[11px] leading-relaxed text-[#A8B8B0]">
                          {archInfo.audience}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-paper)] p-6 text-center lg:col-span-4">
          <div className="rounded-2xl border border-[#D8B467]/30 bg-white p-3.5 shadow-xs">
            <QrCodeBox value={qrUrl} size={150} />
          </div>
          <p className="mt-4 text-xs font-bold text-[var(--sanctuary-ink)]">
            {t.qrLabel}
          </p>
          <p className="mt-1 text-[11px] text-[var(--sanctuary-muted)]">
            <span className="font-latin">
              {displayFileName ?? t.directDownloadFallback}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
