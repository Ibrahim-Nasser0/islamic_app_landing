"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";

export function FaqSection({ locale }: { locale: Locale }) {
  const faq = landingCopy[locale].faqSection;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="border-y border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)]/55 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--sanctuary-gold)]">
            {faq.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-[var(--sanctuary-ink)] sm:text-4xl">
            {faq.title}
          </h2>
        </div>

        <div className="mt-10 divide-y divide-[var(--sanctuary-border)] rounded-3xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)] px-5 sm:px-8">
          {faq.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q} className="py-5">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 text-start"
                >
                  <span className="text-sm font-bold text-[var(--sanctuary-ink)] sm:text-base">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[var(--sanctuary-gold)] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm leading-relaxed text-[var(--sanctuary-muted)]">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
