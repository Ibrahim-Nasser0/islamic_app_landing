"use client";

import { useState } from "react";
import { CheckCircle2, Cpu } from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";

export function NativeReliabilitySection({ locale }: { locale: Locale }) {
  const rel = landingCopy[locale].reliability;
  const [selectedOem, setSelectedOem] = useState<string>(rel.oems[0].id);
  const currentOem = rel.oems.find((o) => o.id === selectedOem) ?? rel.oems[0];

  return (
    <section id="reliability" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--sanctuary-gold)]">
          {rel.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-[var(--sanctuary-ink)] sm:text-4xl">
          {rel.title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[var(--sanctuary-muted)]">
          {rel.subtitle}
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {rel.steps.map((s) => (
          <div
            key={s.step}
            className="rounded-3xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)] p-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-sacred text-3xl font-bold text-[var(--sanctuary-gold)]">
                {s.step}
              </span>
              <Cpu className="h-5 w-5 text-[var(--sanctuary-emerald)]" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[var(--sanctuary-ink)]">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--sanctuary-muted)]">
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)] p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-base font-bold text-[var(--sanctuary-ink)] sm:text-lg">
            {rel.oemTitle}
          </h3>
          <div className="flex flex-wrap gap-2">
            {rel.oems.map((oem) => (
              <button
                key={oem.id}
                type="button"
                onClick={() => setSelectedOem(oem.id)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  oem.id === currentOem.id
                    ? "border-[var(--sanctuary-gold)] bg-[var(--sanctuary-emerald)] text-white"
                    : "border-[var(--sanctuary-border)] bg-[var(--sanctuary-paper)] text-[var(--sanctuary-ink)]"
                }`}
              >
                {oem.name}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {currentOem.steps.map((stepText, idx) => (
            <li
              key={stepText}
              className="flex items-start gap-2.5 rounded-2xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-paper)] p-4 text-xs leading-relaxed text-[var(--sanctuary-muted)]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--sanctuary-emerald)]" />
              <div>
                <span className="font-latin font-bold text-[var(--sanctuary-ink)]">
                  #{idx + 1}{" "}
                </span>
                <span>{stepText}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
