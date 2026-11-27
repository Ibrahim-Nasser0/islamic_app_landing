"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, RotateCcw, Volume2, VolumeX } from "lucide-react";
import {
  MUEZZIN_PREVIEWS,
  POST_ADHAN_DUAA,
  SAMPLE_AZKAR,
} from "@/data/islamic-data";
import { HomeMessages, Locale } from "@/lib/i18n";
import {
  BreathingRosette,
  EqualizerBars,
  ManuscriptCorners,
  OctagramPatternOverlay,
  RubElHizbMark,
  SANCTUARY_PRIMARY_CTA,
  SectionSanctuaryHeader,
} from "./GeometricMotifs";

type SkyKey = "fajr" | "dhuhr" | "maghrib" | "isha";

const SKY_GRADIENTS: Record<SkyKey, string> = {
  fajr: "from-[#07141A] via-[#0D2530] to-[#1F5466]",
  dhuhr: "from-[#07201B] via-[#0E3830] to-[#1B6C5C]",
  maghrib: "from-[#1F1009] via-[#331B10] to-[#6B3822]",
  isha: "from-[#050B14] via-[#0B172A] to-[#193257]",
};

export function InteractiveLockscreenShowcase({
  locale,
  messages: t,
}: {
  locale: Locale;
  messages: HomeMessages["spotlight"];
}) {
  const isAr = locale === "ar";

  const [mode, setMode] = useState<"adhan" | "azkar">("adhan");
  const [sky, setSky] = useState<SkyKey>("fajr");
  const [selectedMuezzinId, setSelectedMuezzinId] = useState(
    MUEZZIN_PREVIEWS[0].id
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const [azkarIndex, setAzkarIndex] = useState(0);
  const [remaining, setRemaining] = useState(SAMPLE_AZKAR[0].target);
  const [azkarFinished, setAzkarFinished] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeMuezzin =
    MUEZZIN_PREVIEWS.find((m) => m.id === selectedMuezzinId) ??
    MUEZZIN_PREVIEWS[0];

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const togglePlay = async (overrideSrc?: string) => {
    const src = overrideSrc ?? activeMuezzin.audioSrc;
    if (isPlaying && !overrideSrc) {
      stopAudio();
      return;
    }
    stopAudio();
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.onended = () => setIsPlaying(false);
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleSelectMuezzin = (id: string, audioSrc: string) => {
    setSelectedMuezzinId(id);
    if (isPlaying) {
      void togglePlay(audioSrc);
    }
  };

  const handleCopyDuaa = async () => {
    try {
      await navigator.clipboard.writeText(POST_ADHAN_DUAA);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  const currentDhikr = SAMPLE_AZKAR[azkarIndex];
  const progressRatio = azkarFinished
    ? 1
    : (currentDhikr.target - remaining) / currentDhikr.target;
  const strokeDashoffset = 276 * (1 - Math.max(progressRatio, 0.04));

  const handleAzkarTap = () => {
    if (azkarFinished) return;
    if (remaining > 1) {
      setRemaining((r) => r - 1);
      return;
    }
    if (azkarIndex + 1 < SAMPLE_AZKAR.length) {
      const next = azkarIndex + 1;
      setAzkarIndex(next);
      setRemaining(SAMPLE_AZKAR[next].target);
    } else {
      setRemaining(0);
      setAzkarFinished(true);
    }
  };

  const resetAzkarDemo = () => {
    setAzkarIndex(0);
    setRemaining(SAMPLE_AZKAR[0].target);
    setAzkarFinished(false);
  };

  return (
    <section
      id="lockscreen"
      className={`scroll-mt-28 relative overflow-hidden bg-gradient-to-b ${SKY_GRADIENTS[sky]} py-16 text-white transition-colors duration-500 sm:py-24`}
    >
      <OctagramPatternOverlay />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionSanctuaryHeader
          centered
          onSky
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />

        <div className="mx-auto max-w-2xl text-center">
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex rounded-2xl border border-[#E0B866]/35 bg-[#07130F]/65 p-1">
              <button
                type="button"
                onClick={() => setMode("adhan")}
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${
                  mode === "adhan"
                    ? "bg-gradient-to-b from-[#E5C67E] to-[#C8A151] text-[#07141A]"
                    : "text-white/85 hover:text-[#E0B866]"
                }`}
              >
                {mode === "adhan" && <RubElHizbMark className="h-3 w-3" />}
                <span>{t.modeAdhan}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  stopAudio();
                  setMode("azkar");
                }}
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${
                  mode === "azkar"
                    ? "bg-gradient-to-b from-[#E5C67E] to-[#C8A151] text-[#07141A]"
                    : "text-white/85 hover:text-[#E0B866]"
                }`}
              >
                {mode === "azkar" && <RubElHizbMark className="h-3 w-3" />}
                <span>{t.modeAzkar}</span>
              </button>
            </div>

            {mode === "adhan" && (
              <div className="inline-flex rounded-2xl border border-[#E0B866]/20 bg-[#07130F]/55 p-1">
                {(["fajr", "dhuhr", "maghrib", "isha"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setSky(k)}
                    className={`min-h-11 rounded-xl px-3.5 py-2 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] sm:min-h-10 ${
                      sky === k
                        ? "bg-white/15 text-[#E0B866]"
                        : "text-white/75 hover:text-white"
                    }`}
                  >
                    {t.skyLabels[k]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative mx-auto mt-10 max-w-xl overflow-hidden rounded-[32px] border border-[#E0B866]/35 bg-black/25 p-6 backdrop-blur-md sm:p-8">
          <ManuscriptCorners color="rgba(224, 184, 102, 0.4)" />
          {mode === "adhan" ? (
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E0B866]/35 bg-white/10 px-4 py-1.5 text-xs font-semibold text-[#FBF7EE]">
                <RubElHizbMark className="h-3 w-3 text-[#E0B866]" />
                <span>{t.nowPrayerMap[sky]}</span>
              </span>

              <div className="my-3">
                <BreathingRosette isPlaying={isPlaying} />
              </div>

              <h3 className="font-sacred text-3xl font-bold text-[#FBF7EE]">
                {t.prayerTitleMap[sky]}
              </h3>
              <div className="mt-1.5 flex items-center gap-2 text-xs font-medium text-[#E0B866]">
                <EqualizerBars active={isPlaying} />
                <span>{isAr ? activeMuezzin.nameAr : activeMuezzin.nameEn}</span>
              </div>

              <p className="mt-5 text-xs font-medium text-white/75">
                {t.selectMuezzin}
              </p>
              <div className="mt-2.5 flex flex-wrap justify-center gap-2">
                {MUEZZIN_PREVIEWS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMuezzin(m.id, m.audioSrc)}
                    className={`min-h-10 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${
                      selectedMuezzinId === m.id
                        ? "border-[#E0B866] bg-[#E0B866]/20 text-[#E0B866]"
                        : "border-white/15 bg-white/5 text-white/80 hover:border-white/35"
                    }`}
                  >
                    {isAr ? m.locationAr : m.locationEn} •{" "}
                    {isAr
                      ? m.nameAr.split("•")[0].trim()
                      : m.nameEn.split("•")[0].trim()}
                  </button>
                ))}
              </div>

              <div className="mt-5 w-full rounded-2xl border border-[#E0B866]/30 bg-white/5 text-start">
                <div className="flex items-center justify-between border-b border-[#E0B866]/20 bg-[#E0B866]/10 px-4 py-2.5">
                  <span className="text-xs font-bold text-[#E0B866]">
                    {t.duaaHeader}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyDuaa}
                    className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] sm:min-h-8 sm:px-2.5"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-[#10B981]" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>{copied ? t.copied : t.copy}</span>
                  </button>
                </div>
                <p
                  dir="rtl"
                  className="font-sacred px-4 py-3.5 text-center text-base leading-[1.9] text-[#FBF7EE]"
                >
                  {POST_ADHAN_DUAA}
                </p>
                <p className="pb-3 text-center text-[11px] text-[#E0B866]">
                  {t.hadithRef}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void togglePlay()}
                className={`mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] active:scale-[0.98] ${
                  isPlaying
                    ? "border border-[#EF4444]/60 bg-[#B91C1C]"
                    : SANCTUARY_PRIMARY_CTA
                }`}
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    <span>{t.stopAdhan}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 text-[#E0B866]" />
                    <span>{t.playAdhan}</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <span className="rounded-full border border-[#E0B866]/35 bg-white/10 px-4 py-1.5 text-xs font-semibold text-[#FBF7EE]">
                {t.azkarPill} • {azkarIndex + 1} / {SAMPLE_AZKAR.length}
              </span>

              <div className="mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[#E0B866] transition-all duration-300"
                  style={{
                    width: `${
                      azkarFinished
                        ? 100
                        : Math.round(((azkarIndex + 0.5) / SAMPLE_AZKAR.length) * 100)
                    }%`,
                  }}
                />
              </div>

              <div className="mt-5 w-full rounded-2xl border border-[#E0B866]/30 bg-white/5 p-5">
                <p
                  dir="rtl"
                  className="font-sacred text-lg leading-[2.0] text-[#FBF7EE] sm:text-xl"
                >
                  {currentDhikr.arabicText}
                </p>
                <p className="mt-3 text-xs text-white/75">
                  {isAr ? currentDhikr.fadlAr : currentDhikr.fadlEn}
                </p>
                <p className="mt-1.5 text-[11px] text-[#E0B866]">
                  [ {isAr ? currentDhikr.referenceAr : currentDhikr.referenceEn} ]
                </p>
              </div>

              <button
                type="button"
                onClick={handleAzkarTap}
                aria-label={`${t.tapCounter} (${remaining})`}
                className="relative mt-6 flex h-32 w-32 items-center justify-center rounded-full bg-[#1B5E4F] text-white transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] active:scale-95"
              >
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="rgba(224,184,102,0.22)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#E0B866"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="276"
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-200"
                  />
                </svg>
                <div className="relative">
                  <span className="block font-latin text-3xl font-extrabold">
                    {remaining}
                  </span>
                  <span className="block text-[11px] font-semibold text-[#E0B866]">
                    {azkarFinished ? t.azkarDone : t.tapCounter}
                  </span>
                </div>
              </button>

              {azkarFinished && (
                <button
                  type="button"
                  onClick={resetAzkarDemo}
                  className="mt-4 inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold text-white/85 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{t.resetAzkar}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
