"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BookOpen,
  Check,
  Clock,
  Compass,
  MapPin,
  ScrollText,
} from "lucide-react";
import {
  CityPrayerPreview,
  Locale,
  QUICK_CITIES,
  landingCopy,
} from "@/lib/landing-content";
import { appScreenshots } from "@/config/screenshots";
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
  const [selectedCityId, setSelectedCityId] = useState<CityPrayerPreview["id"]>("cairo");

  const activeTab = tour.tabs.find((t) => t.id === activeId) ?? tour.tabs[0];
  const activeCity =
    QUICK_CITIES.find((c) => c.id === selectedCityId) ?? QUICK_CITIES[0];

  const screenshotSrc =
    activeTab.id === "quran"
      ? appScreenshots.quranTour
      : activeTab.id === "prayers"
        ? appScreenshots.prayersTour
        : activeTab.id === "mosques"
          ? appScreenshots.mosquesTour
          : appScreenshots.hadithTour;

  return (
    <section id="tour" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-[#D8B467]">
          {tour.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-[#F2EFE9] sm:text-4xl">
          {tour.title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[#92A49B]">
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
                    ? "border-[#D8B467] bg-[#12231D] shadow-sm"
                    : "border-[var(--sanctuary-border)] bg-[#0D1915]/60 hover:bg-[#0D1915]"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                    selected
                      ? "border-[#D8B467] bg-[#1B5E4F] text-[#E0B866]"
                      : "border-[var(--sanctuary-border)] bg-[#07100D] text-[#92A49B]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-bold text-[#F2EFE9]">
                      {tab.title}
                    </span>
                    <span className="rounded-full bg-[#07100D] px-2.5 py-0.5 text-[10px] font-semibold text-[#D8B467]">
                      {tab.badge}
                    </span>
                  </div>
                  {selected && (
                    <p className="mt-1.5 text-xs leading-relaxed text-[#92A49B]">
                      {tab.headline}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-[#D8B467]/30 bg-[#0D1915] p-6 shadow-sm sm:p-8 lg:col-span-7">
          <ManuscriptCorners />

          <div className="grid items-center gap-6 sm:grid-cols-12">
            {/* Dark Visual Screen Artboard or Real Screenshot */}
            <div className="sm:col-span-6">
              {screenshotSrc ? (
                <div className="overflow-hidden rounded-3xl border border-[#D8B467]/30 bg-[#07100D]">
                  <Image
                    src={screenshotSrc}
                    alt={activeTab.title}
                    width={320}
                    height={640}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : (
                <>
                  {activeTab.id === "quran" && (
                    <div className="rounded-3xl border border-[#D8B467]/30 bg-[#0B1411] p-5 text-[#EDEFEA] shadow-inner">
                      <div className="mb-3 rounded-xl border border-[#D8B467]/40 bg-[#1B5E4F] py-2 text-center text-xs font-bold text-[#FBF7EE]">
                        سورة الفاتحة • مكية
                      </div>
                      <p dir="rtl" className="font-sacred text-center text-base leading-[2.1]">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-[#D8B467]/20 pt-2 text-[10px] font-semibold text-[#92A49B]">
                        <span>الجزء الأول</span>
                        <span>صفحة 1</span>
                      </div>
                    </div>
                  )}

                  {activeTab.id === "prayers" && (
                    <div className="rounded-3xl border border-[#E0B866]/35 bg-gradient-to-br from-[#0F2620] to-[#133B31] p-5 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#E0B866]">
                            {isAr ? activeCity.nameAr : activeCity.nameEn}
                          </span>
                          <p className="text-sm font-bold">
                            {isAr ? activeCity.qiblaAr : activeCity.qiblaEn}
                          </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E0B866]/45 bg-white/10">
                          <Compass className="h-5 w-5 text-[#E0B866]" />
                        </div>
                      </div>

                      {/* Quick City Switcher */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {QUICK_CITIES.map((city) => (
                          <button
                            key={city.id}
                            type="button"
                            onClick={() => setSelectedCityId(city.id)}
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                              city.id === activeCity.id
                                ? "bg-[#E0B866] text-[#07141A]"
                                : "bg-black/25 text-white/80 hover:bg-black/40"
                            }`}
                          >
                            {isAr ? city.nameAr : city.nameEn}
                          </button>
                        ))}
                      </div>

                      <div className="mt-3.5 space-y-1.5 text-xs">
                        {[
                          [isAr ? "الفجر" : "Fajr", activeCity.fajr],
                          [isAr ? "الظهر" : "Dhuhr", activeCity.dhuhr],
                          [isAr ? "العصر" : "Asr", activeCity.asr],
                          [isAr ? "المغرب" : "Maghrib", activeCity.maghrib],
                          [isAr ? "العشاء" : "Isha", activeCity.isha],
                        ].map(([p, tm]) => (
                          <div
                            key={String(p)}
                            className="flex justify-between rounded-lg bg-black/20 px-3 py-1.5"
                          >
                            <span>{p}</span>
                            <span className="font-latin font-semibold text-[#E0B866]">
                              {tm}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab.id === "mosques" && (
                    <div className="relative overflow-hidden rounded-3xl border border-[#2A8772]/35 bg-[#091713] p-5 text-[#F2EFE9]">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 240 150"
                        className="mb-3 w-full rounded-2xl bg-[#07100D] p-2"
                      >
                        <path
                          d="M10 40 L230 95 M60 10 L130 140 M180 15 L140 140"
                          stroke="#1B322A"
                          strokeWidth="5"
                          fill="none"
                        />
                        <circle
                          cx="120"
                          cy="78"
                          r="34"
                          fill="#1B5E4F"
                          fillOpacity="0.18"
                          stroke="#2A8772"
                          strokeDasharray="4 3"
                        />
                        <circle cx="120" cy="78" r="6" fill="#2A8772" />
                        <circle cx="152" cy="54" r="7" fill="#E0B866" />
                        <circle cx="88" cy="100" r="6" fill="#E0B866" />
                      </svg>
                      <div className="rounded-xl border border-[#D8B467]/25 bg-[#12231D] p-3">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{isAr ? "مسجد الفتح" : "Al-Fath Mosque"}</span>
                          <span className="text-[#E0B866]">{isAr ? "320 م" : "320 m"}</span>
                        </div>
                        <p className="mt-0.5 text-[10px] text-[#92A49B]">
                          {isAr ? "حوالي 4 دقائق سيراً" : "Approx. 4 mins walk"}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab.id === "hadith" && (
                    <div className="rounded-3xl border border-[#D8B467]/30 bg-[#0B1411] p-5 text-[#EDEFEA]">
                      <span className="rounded-full bg-[#D8B467]/15 px-3 py-1 text-[10px] font-bold text-[#E0B866]">
                        {isAr ? "الأربعون النووية" : "Nawawi 40"}
                      </span>
                      <p dir="rtl" className="font-sacred mt-3 text-base leading-[1.95]">
                        «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى...»
                      </p>
                      <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-[#12231D] px-3 py-2 text-xs">
                        <span>{isAr ? "السبحة اليومية" : "Tasbeeh"}</span>
                        <span className="font-latin font-bold text-[#E0B866]">33 / 33</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="sm:col-span-6">
              <span className="text-xs font-bold text-[#D8B467]">{activeTab.badge}</span>
              <h3 className="mt-1 text-xl font-extrabold text-[#F2EFE9]">
                {activeTab.headline}
              </h3>
              <ul className="mt-5 space-y-3">
                {activeTab.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-[#92A49B]"
                  >
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#2A8772]" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              {activeTab.id === "prayers" && (
                <p className="mt-4 text-[11px] font-medium text-[#D8B467]">
                  {tour.citySwitcherLabel}{" "}
                  {QUICK_CITIES.map((c) => (isAr ? c.nameAr : c.nameEn)).join(" • ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
