"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  BookOpen,
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
import { BreathingRosette, OctagramPatternOverlay } from "./GeometricMotifs";

interface HeroSectionProps {
  locale: Locale;
  release: ReleaseDownloadInfo;
}

type MockTab = "prayer" | "lockscreen" | "quran";

export function HeroSection({ locale, release }: HeroSectionProps) {
  const t = landingCopy[locale].hero;
  const isAr = locale === "ar";
  const [activeTab, setActiveTab] = useState<MockTab>("prayer");
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
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--sanctuary-gold)]/40 bg-[var(--sanctuary-surface)] px-4 py-1.5 text-xs font-semibold text-[var(--sanctuary-emerald)] shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[var(--sanctuary-gold)]" />
            <span>{t.waqfBadge}</span>
          </div>

          <div className="mb-6 rounded-2xl border border-[var(--sanctuary-gold)]/30 bg-[var(--sanctuary-surface)]/80 px-5 py-3.5 backdrop-blur-xs">
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

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--sanctuary-ink)] sm:text-5xl sm:leading-[1.2]">
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
              aria-label="GitHub Releases"
              className="inline-flex min-h-14 items-center gap-1.5 rounded-2xl border border-[var(--sanctuary-border)] px-4 py-3.5 text-xs font-semibold text-[var(--sanctuary-muted)] transition-colors hover:text-[var(--sanctuary-ink)]"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="font-latin">GitHub</span>
            </a>
          </div>

          {showQr && (
            <div className="mt-4 inline-flex items-center gap-4 rounded-2xl border border-[var(--sanctuary-gold)]/40 bg-[var(--sanctuary-surface)] p-4 shadow-sm">
              <div className="rounded-xl bg-white p-2">
                <QRCodeSVG value={release.downloadUrl} size={96} level="M" />
              </div>
              <div className="max-w-[200px] text-xs leading-relaxed text-[var(--sanctuary-muted)]">
                <p className="font-bold text-[var(--sanctuary-ink)]">{t.scanQr}</p>
                <p className="mt-1">{release.downloadUrl.replace("https://", "")}</p>
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-2 text-xs text-[var(--sanctuary-muted)]">
            <Smartphone className="h-4 w-4 text-[var(--sanctuary-gold)]" />
            <span>{t.storesSoon}</span>
          </div>
        </div>

        {/* Interactive Phone Sanctuary Preview */}
        <div className="lg:col-span-5">
          <div className="mx-auto max-w-[330px]">
            <div className="mb-3 grid grid-cols-3 gap-1.5 rounded-2xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)] p-1.5">
              {(
                [
                  { id: "prayer", label: t.mockTabs.prayer, Icon: Clock },
                  { id: "lockscreen", label: t.mockTabs.lockscreen, Icon: ShieldCheck },
                  { id: "quran", label: t.mockTabs.quran, Icon: BookOpen },
                ] as const
              ).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors ${
                    activeTab === id
                      ? "bg-[var(--sanctuary-emerald)] text-white"
                      : "text-[var(--sanctuary-muted)] hover:text-[var(--sanctuary-ink)]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-[36px] border-[6px] border-[#13201b] bg-[#0B1713] p-5 text-white shadow-xl">
              <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/20" />

              {activeTab === "prayer" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#E0B866]/30 bg-gradient-to-br from-[#1B5E4F] to-[#0F2620] p-4">
                    <span className="text-[11px] font-medium text-[#E0B866]">
                      {isAr ? "الصلاة القادمة • القاهرة" : "Next Prayer • Cairo"}
                    </span>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-xl font-bold">
                        {isAr ? "العصر" : "Asr"}
                      </span>
                      <span className="font-latin text-lg font-bold text-[#E0B866]">
                        03:18 PM
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-white/75">
                      {isAr ? "متبقي 01 ساعة و 24 دقيقة" : "In 01h 24m"}
                    </p>
                  </div>
                  <div className="space-y-2 text-xs">
                    {[
                      [isAr ? "الفجر" : "Fajr", "05:04 AM", false],
                      [isAr ? "الظهر" : "Dhuhr", "11:51 AM", false],
                      [isAr ? "العصر" : "Asr", "03:18 PM", true],
                      [isAr ? "المغرب" : "Maghrib", "05:42 PM", false],
                      [isAr ? "العشاء" : "Isha", "07:03 PM", false],
                    ].map(([name, time, next]) => (
                      <div
                        key={String(name)}
                        className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 ${
                          next
                            ? "border border-[#E0B866]/50 bg-[#E0B866]/15 font-bold text-[#E0B866]"
                            : "bg-white/5 text-white/85"
                        }`}
                      >
                        <span>{name}</span>
                        <span className="font-latin">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "lockscreen" && (
                <div className="flex flex-col items-center rounded-2xl bg-gradient-to-b from-[#07141A] via-[#0D2530] to-[#143B4A] p-4 text-center">
                  <span className="rounded-full border border-[#E0B866]/35 bg-white/10 px-3 py-1 text-[10px] font-semibold">
                    {isAr ? "★ الآن صلاة الفجر" : "★ Fajr Time"}
                  </span>
                  <div className="my-1 scale-75">
                    <BreathingRosette isPlaying />
                  </div>
                  <p className="font-sacred text-xl font-bold text-[#FBF7EE]">
                    {isAr ? "صلاة الفجر" : "Fajr Prayer"}
                  </p>
                  <p className="mt-1 text-[11px] text-[#E0B866]">
                    {isAr ? "أذان الحرم المكي" : "Makkah Sanctuary"}
                  </p>
                  <div className="mt-4 w-full rounded-full bg-[#B91C1C] py-2.5 text-xs font-bold text-white">
                    {isAr ? "إيقاف الأذان" : "Stop Adhan"}
                  </div>
                </div>
              )}

              {activeTab === "quran" && (
                <div className="rounded-2xl border border-[#C5A059]/35 bg-[#131C18] p-4 text-center">
                  <span className="text-[11px] font-semibold text-[#C5A059]">
                    {isAr ? "سورة البقرة • الآية 197" : "Al-Baqarah • Ayah 197"}
                  </span>
                  <p
                    dir="rtl"
                    className="font-sacred mt-4 text-lg leading-[2.2] text-[#EDEFEA]"
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَىٰ ۚ وَاتَّقُونِ يَا أُولِي الْأَلْبَابِ ﴿١٩٧﴾
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C5A059]/35 bg-white/5 px-4 py-1.5 text-[11px] text-[#E0B866]">
                    <BookOpen className="h-3 w-3" />
                    <span>{isAr ? "الرسم العثماني الأصيل" : "Uthmani Script"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
