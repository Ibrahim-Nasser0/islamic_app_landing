import { CheckCircle2, HeartHandshake, Radio, WifiOff } from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";

const ICONS = [HeartHandshake, CheckCircle2, WifiOff, Radio];

export function TrustStrip({ locale }: { locale: Locale }) {
  const items = landingCopy[locale].trust;

  return (
    <section className="border-b border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)]/70">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-6 sm:px-8 lg:grid-cols-4">
        {items.map((item, idx) => {
          const Icon = ICONS[idx % ICONS.length];
          return (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-paper)] text-[var(--sanctuary-emerald)]">
                <Icon className="h-5 w-5 text-[var(--sanctuary-gold)]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--sanctuary-ink)]">
                  {item.label}
                </p>
                <p className="text-xs text-[var(--sanctuary-muted)]">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
