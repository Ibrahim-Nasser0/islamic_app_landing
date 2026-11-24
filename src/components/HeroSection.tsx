"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  BellRing,
  Clock,
  Download,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";
import { ReleaseDownloadInfo } from "@/lib/github-release";
import {
  BreathingRosette,
  ManuscriptCorners,
  OctagramPatternOverlay,
} from "./GeometricMotifs";

interface HeroSectionProps {
  locale: Locale;
  release: ReleaseDownloadInfo;
}

export function HeroSection({ locale, release }: HeroSectionProps) {
  const t = landingCopy[locale].hero;
  const isAr = locale === "ar";
  const [showQr, setShowQr] = useState(false);

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-[var(--sanctuary-border)] py-14 sm:py-20 lg:py-24"
    >
      <div className="text-[var(--sanctuary-emerald)]">
        <OctagramPatternOverlay />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--sanctuary-gold)]/45 bg-[var(--sanctuary-surface)] px-4 py-1.5 text-xs font-semibold text-[var(--sanctuary-emerald)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--sanctuary-gold)]" />
            <span>{t.waqfBadge}</span>
          </div>

          <div className="relative mb-6 rounded-2xl border border-[var(--sanctuary-gold)]/35 bg-[var(--sanctuary-surface)]/85 px-6 py-4 backdrop-blur-xs">
            <ManuscriptCorners />
            <p
              dir="rtl"
              className="font-sacred text-xl leading-relaxed text-[var(--sanctuary-ink)] sm:text-2xl"
            >
              {t.verse}
            </p>
            <p className="mt-1 text-xs font-medium text-[var(--sanctuary-gold)]">
              [ {t.verseSource} ]
            </p>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--sanctuary-ink)] sm:text-5xl sm:leading-[1.18]">
            {t.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--sanctuary-muted)] sm:text-lg">
            {t.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href={release.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[var(--sanctuary-emerald)] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <Download className="h-5 w-5 text-[#E0B866]" />
              <div className="text-start">
                <span className="block">
                  {release.hasDirectApk ? t.downloadApk : t.releaseFallback}
                </span>
                <span className="font-latin block text-[11px] font-medium text-white/80">
                  {release.version}
                  {release.fileSizeMb ? ` • ${release.fileSizeMb} MB` : ""} • Android 8.0+
                </span>
              </div>
            </a>

            <button
              type="button"
              onClick={() => setShowQr((prev) => !prev)}
              className="inline-flex min-h-14 items-center gap-2.5 rounded-2xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)] px-5 py-3.5 text-sm font-semibold text-[var(--sanctuary-ink)] transition-colors hover:border-[var(--sanctuary-gold)]"
            >
              <QrCode className="h-4 w-4 text-[var(--sanctuary-gold)]" />
              <span>{t.scanQr}</span>
            </button>

            <a
              href={release.releasesPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center gap-1.5 rounded-2xl border border-[var(--sanctuary-border)] px-4 py-3.5 text-xs font-semibold text-[var(--sanctuary-muted)] transition-colors hover:text-[var(--sanctuary-ink)]"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="font-latin">GitHub</span>
            </a>
          </div>

          {showQr && (
            <div className="mt-4 inline-flex items-center gap-4 rounded-2xl border border-[var(--sanctuary-gold)]/45 bg-[var(--sanctuary-surface)] p-4 shadow-sm">
              <div className="rounded-xl bg-white p-2">
                <QRCodeSVG value={release.downloadUrl} size={96} level="M" />
              </div>
              <div className="max-w-[210px] text-xs leading-relaxed text-[var(--sanctuary-muted)]">
                <p className="font-bold text-[var(--sanctuary-ink)]">{t.scanQr}</p>
                <p className="mt-1 break-all">{release.downloadUrl.replace("https://", "")}</p>
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-2 text-xs text-[var(--sanctuary-muted)]">
            <Smartphone className="h-4 w-4 text-[var(--sanctuary-gold)]" />
            <span>{t.storesSoon}</span>
          </div>
        </div>

        {/* Layered Architectural Mihrab Composition */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto max-w-[340px]">
            {/* Mihrab Halo Backdrop */}
            <div
              aria-hidden="true"
              className="absolute -inset-x-6 -top-6 bottom-6 rounded-t-full border border-[#C5A059]/30 bg-gradient-to-b from-[#C5A059]/10 to-transparent"
            />

            {/* Primary Phone Frame */}
            <div className="relative overflow-hidden rounded-[38px] border-[6px] border-[#13201b] bg-gradient-to-b from-[#07141A] via-[#0D2530] to-[#143B4A] p-5 text-white shadow-2xl">
              <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/20" />

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
            </div>

            {/* Floating Depth Badges */}
            <div className="absolute -start-4 top-14 hidden items-center gap-2 rounded-2xl border border-[var(--sanctuary-gold)]/45 bg-[var(--sanctuary-surface)] px-3.5 py-2 text-xs font-bold text-[var(--sanctuary-ink)] shadow-lg sm:flex">
              <Clock className="h-4 w-4 text-[var(--sanctuary-gold)]" />
              <span>{t.floatingNextPrayer}</span>
            </div>

            <div className="absolute -end-4 bottom-16 hidden items-center gap-2 rounded-2xl border border-[#E0B866]/45 bg-[#0F2620] px-3.5 py-2 text-xs font-bold text-[#FBF7EE] shadow-lg sm:flex">
              <BellRing className="h-3.5 w-3.5 text-[#E0B866]" />
              <span>{t.floatingLockOk}</span>
            </div>

            <div className="absolute -bottom-3 start-6 hidden items-center gap-1.5 rounded-full border border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)] px-3 py-1 text-[11px] font-semibold text-[var(--sanctuary-emerald)] shadow-md sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--sanctuary-gold)]" />
              <span>AlarmClock Native</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
