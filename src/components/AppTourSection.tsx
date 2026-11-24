"use client";

import { useState } from "react";
import {
  BookOpen,
  Check,
  Clock,
  Compass,
  MapPin,
  ScrollText,
} from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";
import { ManuscriptCorners } from "./GeometricMotifs";

const TAB_ICONS = {
  quran: BookOpen,
  prayers: Clock,
  mosques: MapPin,
  hadith: ScrollText,
} as const;

export function AppTourSection({ locale }: { locale: Locale }) {
  const tour = landingCopy[locale].appTour;
  const isAr = locale === "ar";
  const [activeId, setActiveId] = useState<string>(tour.tabs[0].id);

  const activeTab = tour.tabs.find((t) => t.id === activeId) ?? tour.tabs[0];

  return (
    <section id="tour" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--sanctuary-gold)]">
          {tour.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-[var(--sanctuary-ink)] sm:text-4xl">
          {tour.title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[var(--sanctuary-muted)]">
          {tour.subtitle}
        </p>
      </div>

      <div className="mt-10 grid items-center gap-8 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-5">
          {tour.tabs.map((tab) => {
            const Icon = TAB_ICONS[tab.id as keyof typeof TAB_ICONS];
            const selected = tab.id === activeTab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveId(tab.id)}
                className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-start transition-all ${
                  selected
                    ? "border-[var(--sanctuary-gold)] bg-[var(--sanctuary-surface)] shadow-sm"
                    : "border-[var(--sanctuary-border)] bg-transparent hover:bg-[var(--sanctuary-surface)]/60"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                    selected
                      ? "border-[var(--sanctuary-gold)] bg-[var(--sanctuary-emerald)] text-[#E0B866]"
                      : "border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)] text-[var(--sanctuary-muted)]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-bold text-[var(--sanctuary-ink)]">
                      {tab.title}
                    </span>
                    <span className="rounded-full bg-[var(--sanctuary-surface-alt)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--sanctuary-gold)]">
                      {tab.badge}
                    </span>
                  </div>
                  {selected && (
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--sanctuary-muted)]">
                      {tab.headline}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-[var(--sanctuary-gold)]/35 bg-[var(--sanctuary-surface)] p-6 shadow-sm sm:p-8 lg:col-span-7">
          <ManuscriptCorners />

          <div className="grid items-center gap-6 sm:grid-cols-12">
            {/* Visual Screen Artboard */}
            <div className="sm:col-span-6">
              {activeTab.id === "quran" && (
                <div className="rounded-3xl border border-[#C5A059]/35 bg-[#FBF7EE] p-5 text-[#19211E] shadow-inner">
                  <div className="mb-3 rounded-xl border border-[#C5A059]/45 bg-[#1B5E4F] py-2 text-center text-xs font-bold text-[#FBF7EE]">
                    سورة الفاتحة • مكية
                  </div>
                  <p dir="rtl" className="font-sacred text-center text-base leading-[2.1]">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-[#C5A059]/30 pt-2 text-[10px] font-semibold text-[#5A6B63]">
                    <span>الجزء الأول</span>
                    <span>صفحة 1</span>
                  </div>
                </div>
              )}

              {activeTab.id === "prayers" && (
                <div className="rounded-3xl border border-[#E0B866]/35 bg-gradient-to-br from-[#0F2620] to-[#1B5E4F] p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#E0B866]">
                        {isAr ? "القبلة الدقيقة" : "Exact Qibla"}
                      </span>
                      <p className="text-lg font-bold">136° {isAr ? "جنوب شرق" : "SE"}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E0B866]/50 bg-white/10">
                      <Compass className="h-6 w-6 text-[#E0B866]" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1.5 text-xs">
                    {[
                      [isAr ? "الفجر" : "Fajr", "05:04"],
                      [isAr ? "الظهر" : "Dhuhr", "11:51"],
                      [isAr ? "العصر" : "Asr", "03:18"],
                      [isAr ? "المغرب" : "Maghrib", "05:42"],
                    ].map(([p, tm]) => (
                      <div
                        key={String(p)}
                        className="flex justify-between rounded-lg bg-white/10 px-3 py-1.5"
                      >
                        <span>{p}</span>
                        <span className="font-latin text-[#E0B866]">{tm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab.id === "mosques" && (
                <div className="relative overflow-hidden rounded-3xl border border-[#1B5E4F]/30 bg-[#E8F3EF] p-5 text-[#19211E]">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 240 150"
                    className="mb-3 w-full rounded-2xl bg-[#F8F9F6] p-2"
                  >
                    <path d="M10 40 L230 95 M60 10 L130 140 M180 15 L140 140" stroke="#D5E2DC" strokeWidth="5" fill="none" />
                    <circle cx="120" cy="78" r="34" fill="#1B5E4F" fillOpacity="0.1" stroke="#1B5E4F" strokeDasharray="4 3" />
                    <circle cx="120" cy="78" r="6" fill="#1B5E4F" />
                    <circle cx="152" cy="54" r="7" fill="#C5A059" />
                    <circle cx="88" cy="100" r="6" fill="#C5A059" />
                  </svg>
                  <div className="rounded-xl bg-white p-3 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{isAr ? "مسجد الفتح" : "Al-Fath Mosque"}</span>
                      <span className="text-[#1B5E4F]">{isAr ? "320 م" : "320 m"}</span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-[#5F7068]">
                      {isAr ? "حوالي 4 دقائق سيراً" : "Approx. 4 mins walk"}
                    </p>
                  </div>
                </div>
              )}

              {activeTab.id === "hadith" && (
                <div className="rounded-3xl border border-[#C5A059]/35 bg-[#121F1A] p-5 text-[#F0F4F2]">
                  <span className="rounded-full bg-[#C5A059]/20 px-3 py-1 text-[10px] font-bold text-[#E0B866]">
                    {isAr ? "الأربعون النووية" : "Nawawi 40"}
                  </span>
                  <p dir="rtl" className="font-sacred mt-3 text-base leading-[1.95]">
                    «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى...»
                  </p>
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
                    <span>{isAr ? "السبحة اليومية" : "Tasbeeh"}</span>
                    <span className="font-latin font-bold text-[#E0B866]">33 / 33</span>
                  </div>
                </div>
              )}
            </div>

            {/* Key Capabilities Bullet List */}
            <div className="sm:col-span-6">
              <span className="text-xs font-bold text-[var(--sanctuary-gold)]">
                {activeTab.badge}
              </span>
              <h3 className="mt-1 text-xl font-extrabold text-[var(--sanctuary-ink)]">
                {activeTab.headline}
              </h3>
              <ul className="mt-5 space-y-3">
                {activeTab.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--sanctuary-muted)]"
                  >
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--sanctuary-emerald)]" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
