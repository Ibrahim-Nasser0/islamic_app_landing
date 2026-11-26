"use client";

import Image from "next/image";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  BellRing,
  Clock,
  Download,
  FileText,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";
import { ReleaseDownloadInfo } from "@/lib/github-release";
import { buildTrackedDownloadPath } from "@/lib/download-url";
import { appScreenshots } from "@/config/screenshots";
import {
  BreathingRosette,
  ManuscriptCorners,
  OctagramPatternOverlay,
  RubElHizbMark,
  SANCTUARY_PRIMARY_CTA,
  SANCTUARY_SECONDARY_BTN,
} from "./GeometricMotifs";

interface HeroSectionProps {
  locale: Locale;
  release: ReleaseDownloadInfo;
  downloadCount: number;
  onDownloadClick: () => void;
  onOpenReleaseNotes: () => void;
}

export function HeroSection({
  locale,
  release,
  downloadCount,
  onDownloadClick,
  onOpenReleaseNotes,
}: HeroSectionProps) {
  const t = landingCopy[locale].hero;
  const isAr = locale === "ar";
  const [showQr, setShowQr] = useState(false);
  const trackedDownloadHref = buildTrackedDownloadPath({
    source: "hero",
    locale,
    version: release.version,
  });
  const qrHref =
    typeof window !== "undefined"
      ? `${window.location.origin}${buildTrackedDownloadPath({
          source: "qr",
          locale,
          version: release.version,
        })}`
      : release.downloadUrl;

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-[var(--sanctuary-border)] bg-gradient-to-b from-[#07100D] via-[#0B1713] to-[#07100D] py-14 sm:py-20 lg:py-24"
    >
      <div className="text-[#2A8772]">
        <OctagramPatternOverlay />
      </div>

      {/* Subtle zenith ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[640px] -translate-x-1/2 rounded-full bg-[#1B5E4F]/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D8B467]/35 bg-[#0D1915] px-4 py-1.5 text-xs font-semibold text-[#E0B866]">
            <RubElHizbMark className="h-3.5 w-3.5 text-[#E0B866]" />
            <span>{t.waqfBadge}</span>
          </div>

          <div className="relative mb-6 rounded-2xl border border-[#D8B467]/30 bg-[#0D1915]/90 px-6 py-4 backdrop-blur-xs">
            <ManuscriptCorners />
            <p
              dir="rtl"
              className="font-sacred text-xl leading-relaxed text-[#F2EFE9] sm:text-2xl"
            >
              {t.verse}
            </p>
            <p className="mt-1 text-xs font-medium text-[#D8B467]">
              [ {t.verseSource} ]
            </p>
          </div>

          <h1 className="font-sacred text-3xl leading-[1.34] font-bold tracking-normal text-[#F4EFE4] sm:text-5xl sm:leading-[1.26]">
            {t.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#92A49B] sm:text-lg">
            {t.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href={trackedDownloadHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onDownloadClick}
              className={`inline-flex min-h-14 items-center gap-3 rounded-2xl px-6 py-3.5 text-sm font-bold ${SANCTUARY_PRIMARY_CTA}`}
            >
              <Download className="h-5 w-5 text-[#F2D184]" />
              <div className="text-start">
                <span className="block">
                  {release.hasDirectApk ? t.downloadApk : t.releaseFallback}
                </span>
                <span className="block text-[11px] font-medium text-[#FBF7ED]/80">
                  <span className="font-latin">
                    {release.version}
                    {release.fileSizeMb ? ` • ${release.fileSizeMb} MB` : ""}
                  </span>{" "}
                  • {isAr ? "أندرويد 8.0 فأحدث" : "Android 8.0+"}
                </span>
              </div>
            </a>

            <button
              type="button"
              onClick={onOpenReleaseNotes}
              className={`inline-flex min-h-14 items-center gap-2 rounded-2xl px-4 py-3.5 text-xs font-semibold ${SANCTUARY_SECONDARY_BTN}`}
            >
              <FileText className="h-4 w-4 text-[#D8B467]" />
              <span>{t.whatsNew}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQr((prev) => !prev)}
              className={`inline-flex min-h-14 items-center gap-2 rounded-2xl px-4 py-3.5 text-xs font-semibold ${SANCTUARY_SECONDARY_BTN}`}
            >
              <QrCode className="h-4 w-4 text-[#D8B467]" />
              <span>{t.scanQr}</span>
            </button>
          </div>

          {showQr && (
            <div className="mt-4 inline-flex items-center gap-4 rounded-2xl border border-[#D8B467]/40 bg-[#0D1915] p-4 shadow-lg">
              <div className="rounded-xl bg-white p-2">
                <QRCodeSVG value={qrHref} size={96} level="M" />
              </div>
              <div className="max-w-[215px] text-xs leading-relaxed text-[#92A49B]">
                <p className="font-bold text-[#F2EFE9]">{t.scanQr}</p>
                <p className="mt-1 break-all">{release.downloadUrl.replace("https://", "")}</p>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#92A49B]">
            <div className="inline-flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-[#D8B467]" />
              <span>{t.storesSoon}</span>
            </div>
            {downloadCount > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D8B467]/30 bg-[#0D1915] px-3 py-1 text-[11px] font-semibold text-[#E5C67E]">
                <Download className="h-3 w-3 text-[#D8B467]" />
                <span>
                  {downloadCount.toLocaleString(isAr ? "ar-EG" : "en-US")}{" "}
                  {isAr ? "تحميل" : "downloads"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Layered Architectural Mihrab Composition */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto max-w-[340px]">
            <div
              aria-hidden="true"
              className="absolute -inset-x-6 -top-6 bottom-6 rounded-t-full border border-[#D8B467]/25 bg-gradient-to-b from-[#D8B467]/10 to-transparent"
            />

            <div className="relative overflow-hidden rounded-[38px] border-[6px] border-[#162721] bg-gradient-to-b from-[#07141A] via-[#0D2530] to-[#143B4A] p-5 text-white shadow-2xl">
              <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/20" />

              {appScreenshots.heroLockscreen ? (
                <Image
                  src={appScreenshots.heroLockscreen}
                  alt={t.floatingLockOk}
                  width={300}
                  height={620}
                  priority
                  className="h-auto w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-center">
                  <span className="rounded-full border border-[#E0B866]/35 bg-white/10 px-3 py-1 text-[10px] font-semibold">
                    ★ {isAr ? "الآن موعد صلاة الفجر • 05:04 ص" : "Fajr Prayer • 05:04 AM"}
                  </span>

                  <div className="my-1 scale-90">
                    <BreathingRosette isPlaying />
                  </div>

                  <p className="font-sacred text-2xl font-bold text-[#FBF7EE]">
                    {isAr ? "صلاة الفجر" : "Fajr Prayer"}
                  </p>
                  <p className="mt-1 text-[11px] text-[#E0B866]">
                    {isAr ? "أذان الحرم المكي • مكة المكرمة" : "Makkah Sanctuary"}
                  </p>

                  <div className="mt-4 w-full rounded-2xl border border-[#E0B866]/25 bg-white/5 p-3 text-center">
                    <p dir="rtl" className="font-sacred text-xs leading-[1.9] text-[#FBF7EE]/90">
                      اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ القَائِمَةِ، آتِ مُحَمَّدًا الوَسِيلَةَ وَالفَضِيلَةَ
                    </p>
                  </div>

                  <div className="mt-4 w-full rounded-full bg-[#B91C1C] py-2.5 text-xs font-bold text-white">
                    {isAr ? "إيقاف الأذان" : "Stop Adhan"}
                  </div>
                  <div className="mt-2 grid w-full grid-cols-2 gap-2 text-[10px] font-semibold text-white/90">
                    <span className="rounded-full border border-white/15 bg-white/5 py-1.5">
                      {isAr ? "اتجاه القبلة 🧭" : "Qibla 🧭"}
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/5 py-1.5">
                      {isAr ? "فتح التطبيق ↗" : "Open App ↗"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute -start-4 top-14 hidden items-center gap-2 rounded-2xl border border-[#D8B467]/40 bg-[#12231D]/95 px-3.5 py-2 text-xs font-bold text-[#F2EFE9] shadow-lg backdrop-blur-md sm:flex">
              <Clock className="h-4 w-4 text-[#E0B866]" />
              <span>{t.floatingNextPrayer}</span>
            </div>

            <div className="absolute -end-4 bottom-16 hidden items-center gap-2 rounded-2xl border border-[#E0B866]/40 bg-[#0F2620]/95 px-3.5 py-2 text-xs font-bold text-[#FBF7EE] shadow-lg backdrop-blur-md sm:flex">
              <BellRing className="h-3.5 w-3.5 text-[#E0B866]" />
              <span>{t.floatingLockOk}</span>
            </div>

            <div className="absolute -bottom-3 start-6 hidden items-center gap-1.5 rounded-full border border-[#D8B467]/30 bg-[#0D1915] px-3 py-1 text-[11px] font-semibold text-[#E0B866] shadow-md sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D8B467]" />
              <span>{isAr ? "محرك المنبه الأصلي" : "AlarmClock Native"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
