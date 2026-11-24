import { Locale, landingCopy } from "@/lib/landing-content";

export function TrustStrip({ locale }: { locale: Locale }) {
  const items = landingCopy[locale].trust;

  return (
    <section className="border-b border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)]/80">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-y divide-[var(--sanctuary-border)] sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:rtl:divide-x-reverse">
        {items.map((item) => (
          <div key={item.label} className="px-6 py-7 text-center sm:text-start">
            <span className="font-sacred block text-3xl font-bold text-[var(--sanctuary-emerald)] sm:text-4xl">
              {item.metric}
            </span>
            <p className="mt-1 text-sm font-bold text-[var(--sanctuary-ink)]">
              {item.label}
            </p>
            <p className="mt-0.5 text-xs text-[var(--sanctuary-muted)]">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
