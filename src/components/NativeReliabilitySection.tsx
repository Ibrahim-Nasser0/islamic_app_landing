"use client";

import { useState } from "react";
import { CheckCircle2, Cpu, ShieldCheck } from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";

export function NativeReliabilitySection({ locale }: { locale: Locale }) {
  const rel = landingCopy[locale].reliability;
  const [selectedOem, setSelectedOem] = useState<string>(rel.oems[0].id);
  const currentOem = rel.oems.find((o) => o.id === selectedOem) ?? rel.oems[0];

  return (
    <section id="reliability" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-[#D8B467]">
          {rel.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-[#F2EFE9] sm:text-4xl">
          {rel.title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[#92A49B]">
          {rel.subtitle}
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {rel.steps.map((s) => (
          <div
            key={s.step}
            className="rounded-3xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-sacred text-3xl font-bold text-[#E0B866]">
                {s.step}
              </span>
              <Cpu className="h-5 w-5 text-[#2A8772]" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#F2EFE9]">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#92A49B]">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* OEM Device Guide */}
      <div className="mt-8 rounded-3xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-base font-bold text-[#F2EFE9] sm:text-lg">
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
                    ? "border-[#D8B467] bg-[#1B5E4F] text-white"
                    : "border-[var(--sanctuary-border)] bg-[#07100D] text-[#92A49B] hover:text-[#F2EFE9]"
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
              className="flex items-start gap-2.5 rounded-2xl border border-[var(--sanctuary-border)] bg-[#07100D] p-4 text-xs leading-relaxed text-[#92A49B]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2A8772]" />
              <div>
                <span className="font-latin font-bold text-[#F2EFE9]">
                  #{idx + 1}{" "}
                </span>
                <span>{stepText}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Permissions & Privacy Ledger */}
      <div className="mt-8 rounded-3xl border border-[#D8B467]/25 bg-[#12231D]/70 p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-[#E0B866]" />
          <h3 className="text-base font-bold text-[#F2EFE9] sm:text-lg">
            {rel.privacyTitle}
          </h3>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {rel.privacyItems.map((item) => (
            <div
              key={item.perm}
              className="rounded-2xl border border-[var(--sanctuary-border)] bg-[#07100D]/80 p-4"
            >
              <p className="text-sm font-bold text-[#E0B866]">{item.perm}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-[#92A49B]">
                {item.why}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
