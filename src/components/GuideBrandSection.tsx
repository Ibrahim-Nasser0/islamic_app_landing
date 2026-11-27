"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Smartphone } from "lucide-react";
import { GuideMessages } from "@/lib/i18n";
import {
  OctagonalIconFrame,
  RubElHizbMark,
  SectionSanctuaryHeader,
} from "./GeometricMotifs";

export function GuideBrandSection({
  messages,
}: {
  messages: GuideMessages["brandsSection"];
}) {
  const [selectedBrandId, setSelectedBrandId] = useState<string>("all");

  const visibleBrands =
    selectedBrandId === "all"
      ? messages.brands
      : messages.brands.filter((b) => b.id === selectedBrandId);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <SectionSanctuaryHeader
        eyebrow={messages.eyebrow}
        title={messages.title}
        subtitle={messages.subtitle}
      />

      {/* Brand Filter Bar */}
      <div className="mt-7 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedBrandId("all")}
          className={`min-h-10 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${
            selectedBrandId === "all"
              ? "border-[#D8B467]/60 bg-gradient-to-b from-[#216E5C] to-[#13473B] text-[#F6E2A8]"
              : "border-[var(--sanctuary-border)] bg-[#0D1915] text-[#92A49B] hover:border-[#D8B467]/40 hover:text-[#F2EFE9]"
          }`}
        >
          {messages.allBrandsLabel}
        </button>
        {messages.brands.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setSelectedBrandId(b.id)}
            className={`min-h-10 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${
              selectedBrandId === b.id
                ? "border-[#D8B467]/60 bg-gradient-to-b from-[#216E5C] to-[#13473B] text-[#F6E2A8]"
                : "border-[var(--sanctuary-border)] bg-[#0D1915] text-[#92A49B] hover:border-[#D8B467]/40 hover:text-[#F2EFE9]"
            }`}
          >
            {b.brand}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {visibleBrands.map((brand) => (
          <article
            key={brand.id}
            className="relative overflow-hidden rounded-[28px] border border-[#D8B467]/25 bg-[#0D1915] p-6 shadow-sm sm:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <OctagonalIconFrame active>
                  <Smartphone className="h-4 w-4" />
                </OctagonalIconFrame>
                <div>
                  <h3 className="text-base font-bold text-[#F4EFE4] sm:text-lg">
                    {brand.brand}
                  </h3>
                  <span className="font-latin text-xs text-[#D8B467]">
                    {brand.osName}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#92A49B] sm:text-sm">
              {brand.summary}
            </p>

            <ul className="mt-4 space-y-2.5 border-t border-[#D8B467]/12 pt-4">
              {brand.steps.map((step, idx) => (
                <li
                  key={step}
                  className="flex items-start gap-2.5 rounded-xl border border-[var(--sanctuary-border)] bg-[#07100D] p-3 text-xs leading-relaxed text-[#D7E0DC]"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2A8772]" />
                  <div>
                    <span className="inline-flex items-center gap-1 font-bold text-[#E5C67E]">
                      <RubElHizbMark className="h-2.5 w-2.5" />
                      {messages.stepPrefix} {idx + 1}:
                    </span>{" "}
                    <span>{step}</span>
                  </div>
                </li>
              ))}
            </ul>

            {"note" in brand && typeof brand.note === "string" && brand.note && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>{brand.note}</span>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
