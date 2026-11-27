import {
  BellRing,
  BookOpen,
  Clock,
  Compass,
  Heart,
  MapPin,
} from "lucide-react";
import { HomeMessages } from "@/lib/i18n";
import {
  EqualizerBars,
  ManuscriptCorners,
  OctagonalIconFrame,
  SectionSanctuaryHeader,
} from "./GeometricMotifs";

const CARD_ICONS = {
  native: BellRing,
  quran: BookOpen,
  azkar: Heart,
  prayers: Clock,
  qibla: Compass,
  mosques: MapPin,
} as const;

export function FeaturesBento({
  section,
}: {
  section: HomeMessages["featuresSection"];
}) {
  return (
    <section
      id="features"
      className="scroll-mt-28 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <SectionSanctuaryHeader
        eyebrow={section.eyebrow}
        title={section.title}
        subtitle={section.subtitle}
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {section.cards.map((card) => {
          const Icon = CARD_ICONS[card.id as keyof typeof CARD_ICONS];
          if (card.featured) {
            return (
              <div
                key={card.id}
                className="relative overflow-hidden rounded-3xl border border-[var(--sanctuary-gold)]/40 bg-gradient-to-br from-[#0F2620] via-[#133B31] to-[#1B5E4F] p-7 text-white shadow-sm md:col-span-2"
              >
                <ManuscriptCorners color="rgba(224, 184, 102, 0.45)" />
                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#E0B866]/40 bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#E0B866]">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{card.badge}</span>
                  </div>
                  <EqualizerBars active />
                </div>
                <h3 className="font-sacred mt-4 text-2xl font-bold leading-snug text-[#FBF7EE] sm:text-3xl">
                  {card.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                  {card.desc}
                </p>
                {card.techBadges && card.techBadges.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#E0B866]">
                    {card.techBadges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 font-medium"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={card.id}
              className="flex flex-col justify-between rounded-3xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)] p-6 transition-colors hover:border-[var(--sanctuary-gold)]/55"
            >
              <div>
                <div className="flex items-center justify-between">
                  <OctagonalIconFrame>
                    <Icon className="h-4 w-4 text-[#E0B866]" />
                  </OctagonalIconFrame>
                  <span className="rounded-full border border-[#D8B467]/15 bg-[var(--sanctuary-surface-alt)] px-3 py-1 text-[11px] font-semibold text-[var(--sanctuary-muted)]">
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
