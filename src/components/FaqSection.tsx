"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { HomeMessages } from "@/lib/i18n";
import { RubElHizbMark, SectionSanctuaryHeader } from "./GeometricMotifs";

export function FaqSection({
  messages: faq,
}: {
  messages: HomeMessages["faqSection"];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-28 border-y border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)]/55 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionSanctuaryHeader
          centered
          eyebrow={faq.eyebrow}
          title={faq.title}
        />

        <div className="mt-10 divide-y divide-[var(--sanctuary-border)] rounded-3xl border border-[#D8B467]/25 bg-[var(--sanctuary-surface)] px-5 sm:px-8">
          {faq.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q} className="py-5">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex min-h-11 w-full items-center justify-between gap-4 rounded-xl text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]"
                >
                  <span className="inline-flex items-center gap-2.5 text-sm font-bold text-[var(--sanctuary-ink)] sm:text-base">
                    <RubElHizbMark
                      className={`h-3 w-3 shrink-0 transition-colors ${
                        isOpen ? "text-[#E0B866]" : "text-[#D8B467]/40"
                      }`}
                    />
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[var(--sanctuary-gold)] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 ps-5.5 text-sm leading-relaxed text-[var(--sanctuary-muted)]">
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
