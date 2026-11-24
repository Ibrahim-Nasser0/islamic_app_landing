"use client";

import { useState } from "react";
import { CheckCircle2, Cpu, ShieldCheck } from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";
import {
  ManuscriptCorners,
  OctagonalIconFrame,
  RubElHizbMark,
  SectionSanctuaryHeader,
} from "./GeometricMotifs";

export function NativeReliabilitySection({ locale }: { locale: Locale }) {
  const rel = landingCopy[locale].reliability;
  const [selectedOem, setSelectedOem] = useState<string>(rel.oems[0].id);
  const currentOem = rel.oems.find((o) => o.id === selectedOem) ?? rel.oems[0];

  return (
    <section id="reliability" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <SectionSanctuaryHeader
        eyebrow={rel.eyebrow}
        title={rel.title}
        subtitle={rel.subtitle}
      />

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {rel.steps.map((s) => (
          <div
            key={s.step}
            className="rounded-3xl border border-[var(--sanctuary-border)] bg-[#0D1915] p-6"
          >
            <div className="flex items-center justify-between">
              <OctagonalIconFrame active>
                <span className="font-sacred text-sm font-bold text-[#F5DFA4]">
                  {s.step}
                </span>
              </OctagonalIconFrame>
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
          <h3 className="font-sacred text-lg font-bold text-[#F2EFE9] sm:text-xl">
            {rel.oemTitle}
          </h3>
          <div className="flex flex-wrap gap-1.5 rounded-2xl border border-[#D8B467]/20 bg-[#08130F] p-1">
            {rel.oems.map((oem) => (
              <button
                key={oem.id}
                type="button"
                onClick={() => setSelectedOem(oem.id)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  oem.id === currentOem.id
                    ? "border-[#D8B467]/45 bg-gradient-to-b from-[#216E5C] to-[#13473B] text-[#F6E2A8]"
                    : "border-transparent text-[#92A49B] hover:text-[#E5C67E]"
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
                <span className="inline-flex items-center gap-1 font-latin font-bold text-[#E0B866]">
                  <RubElHizbMark className="h-2.5 w-2.5" />
                  {idx + 1}
                </span>{" "}
                <span>{stepText}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Permissions & Privacy Ledger */}
      <div className="relative mt-8 overflow-hidden rounded-3xl border border-[#D8B467]/30 bg-[#12231D]/70 p-6 sm:p-8">
        <ManuscriptCorners color="rgba(216, 180, 103, 0.38)" />
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-[#E0B866]" />
          <h3 className="font-sacred text-lg font-bold text-[#F2EFE9] sm:text-xl">
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
