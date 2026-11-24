import {
  BellRing,
  BookOpen,
  Clock,
  Compass,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";
import { EqualizerBars } from "./GeometricMotifs";

const CARD_ICONS = {
  native: BellRing,
  quran: BookOpen,
  azkar: Sparkles,
  prayers: Clock,
  qibla: Compass,
  mosques: MapPin,
} as const;

export function FeaturesBento({ locale }: { locale: Locale }) {
  const section = landingCopy[locale].featuresSection;

  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--sanctuary-gold)]">
          {section.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-[var(--sanctuary-ink)] sm:text-4xl">
          {section.title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[var(--sanctuary-muted)]">
          {section.subtitle}
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {section.cards.map((card) => {
          const Icon = CARD_ICONS[card.id as keyof typeof CARD_ICONS];
          if (card.featured) {
            return (
              <div
                key={card.id}
                className="relative overflow-hidden rounded-3xl border border-[var(--sanctuary-gold)]/40 bg-gradient-to-br from-[#0F2620] via-[#133B31] to-[#1B5E4F] p-7 text-white shadow-sm md:col-span-2"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#E0B866]/40 bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#E0B866]">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{card.badge}</span>
                  </div>
                  <EqualizerBars active />
                </div>
                <h3 className="mt-4 text-xl font-bold leading-snug sm:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                  {card.desc}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#E0B866]">
                  <span className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 font-latin">
                    AlarmManager.setAlarmClock
                  </span>
                  <span className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 font-latin">
                    AudioAttributes.USAGE_ALARM
                  </span>
                  <span className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 font-latin">
                    SwiftUI Content Extension
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={card.id}
              className="flex flex-col justify-between rounded-3xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)] p-6 transition-colors hover:border-[var(--sanctuary-gold)]/60"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-paper)] text-[var(--sanctuary-emerald)]">
                    <Icon className="h-5 w-5 text-[var(--sanctuary-gold)]" />
                  </div>
                  <span className="rounded-full bg-[var(--sanctuary-surface-alt)] px-3 py-1 text-[11px] font-semibold text-[var(--sanctuary-muted)]">
                    {card.badge}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-[var(--sanctuary-ink)]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--sanctuary-muted)]">
                  {card.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
