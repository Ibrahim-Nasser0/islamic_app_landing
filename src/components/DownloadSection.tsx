"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Check,
  Cpu,
  Download,
  ExternalLink,
  RotateCcw,
  Share2,
  ShieldCheck,
} from "lucide-react";
import {
  ApkArch,
  DeviceDetectionResult,
  resolveApkVariant,
} from "@/lib/device-apk";
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
  detection: DeviceDetectionResult | null;
  downloadCount: number;
  onDownloadClick: () => void;
}

export function DownloadSection({
  locale,
  release,
  detection,
  downloadCount,
  onDownloadClick,
}: DownloadSectionProps) {
  const t = landingCopy[locale].downloadSection;
  const brand = landingCopy[locale].brand;
  const footer = landingCopy[locale].footer;
  const isAr = locale === "ar";
  const [sharedCopied, setSharedCopied] = useState(false);
  const [selectedArchOverride, setSelectedArchOverride] = useState<ApkArch | null>(null);

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
    <>
      <section id="download" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
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
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/35 bg-[#10B981]/10 px-3 py-1 text-xs font-bold text-[#6EE7B7]">
                  <Download className="h-3 w-3" />
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
                    {selectedArchOverride === null ? `${t.recommendedArchLabel}: ` : ""}
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
                onClick={onDownloadClick}
                className={`inline-flex min-h-13 items-center gap-2.5 rounded-2xl px-6 py-3 text-sm font-bold ${SANCTUARY_PRIMARY_CTA}`}
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
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#D8B467]/35 bg-[#0D1915] px-3 py-1.5 text-[11px] font-semibold text-[#E5C67E] transition-colors hover:border-[#D8B467]/60 hover:text-[#F6E2A8]"
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
                        className={`flex flex-col justify-between rounded-2xl border p-3.5 text-start transition-all ${
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
                                  ? "border-[#10B981]/50 bg-[#10B981]/15 text-[#6EE7B7]"
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
                              <span className="text-[#92A49B]">• {variant.sizeMb} MB</span>
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
              <QRCodeSVG value={qrUrl} size={150} level="M" />
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
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D8B467]/25 bg-[#0D1915] px-4 py-1.5 font-semibold text-[#E5C67E] transition-colors hover:border-[#D8B467]/55 hover:text-[#F6E2A8]"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
              <span>{footer.privacyLink}</span>
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
