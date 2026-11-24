"use client";

import { useEffect, useState } from "react";
import { Download, MessageSquarePlus } from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";

interface StickyMobileCtaProps {
  locale: Locale;
  downloadUrl: string;
}

export function StickyMobileCta({ locale, downloadUrl }: StickyMobileCtaProps) {
  const t = landingCopy[locale].stickyCta;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 420);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 sm:hidden">
      <div className="flex items-center gap-2 rounded-2xl border border-[#D8B467]/40 bg-[#0D1915]/95 p-2 shadow-2xl backdrop-blur-md">
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#1B5E4F] text-xs font-bold text-white active:scale-[0.98]"
        >
          <Download className="h-4 w-4 text-[#E0B866]" />
          <span>{t.download}</span>
        </a>
        <a
          href="#feedback"
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[var(--sanctuary-border)] bg-[#12231D] px-3.5 text-xs font-semibold text-[#F2EFE9]"
        >
          <MessageSquarePlus className="h-3.5 w-3.5 text-[#D8B467]" />
          <span>{t.feedback}</span>
        </a>
      </div>
    </div>
  );
}
