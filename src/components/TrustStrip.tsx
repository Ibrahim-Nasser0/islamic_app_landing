import { Locale, landingCopy } from "@/lib/landing-content";
import { RubElHizbMark } from "./GeometricMotifs";

export function TrustStrip({ locale }: { locale: Locale }) {
  const items = landingCopy[locale].trust;

  return (
    <section className="bg-[#0B1713]/90">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-y divide-[#D8B467]/12 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:rtl:divide-x-reverse">
        {items.map((item) => (
          <div key={item.label} className="px-6 py-7 text-center sm:text-start">
            <div className="inline-flex items-center gap-2">
              <RubElHizbMark className="h-3.5 w-3.5 shrink-0 text-[#D8B467]/80" />
              <span className="font-sacred block text-3xl font-bold text-[#E0B866] sm:text-4xl">
                {item.metric}
              </span>
            </div>
            <p className="mt-1 text-sm font-bold text-[#F2EFE9]">{item.label}</p>
            <p className="mt-0.5 text-xs text-[#92A49B]">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
