"use client";

import { useEffect, useState } from "react";
import { HomeMessages, Locale } from "@/lib/i18n";
import { RubElHizbMark } from "./GeometricMotifs";

interface SectionScrollRailProps {
  locale: Locale;
  messages: HomeMessages["sectionRail"];
}

export function SectionScrollRail({ locale, messages }: SectionScrollRailProps) {
  const [activeId, setActiveId] = useState<string>(
    messages.items[0]?.id ?? "top"
  );
  const isEn = locale === "en";

  useEffect(() => {
    const ids = messages.items.map((item) => item.id);
    let rafId = 0;

    const updateActiveSection = () => {
      rafId = 0;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      if (scrollY < 100) {
        setActiveId(ids[0] ?? "top");
        return;
      }

      if (scrollY + winHeight >= docHeight - 80) {
        setActiveId(ids[ids.length - 1] ?? "feedback");
        return;
      }

      const thresholdY = winHeight * 0.4;
      let current = ids[0] ?? "top";

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= thresholdY) {
          current = id;
        }
      }

      setActiveId(current);
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [messages.items]);

  const handleJump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    target.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });

    if (window.location.hash !== `#${id}`) {
      window.history.replaceState(null, "", `#${id}`);
    }
    setActiveId(id);
  };

  return (
    <nav
      aria-label={messages.navLabel}
      className="fixed end-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-1 xl:flex 2xl:end-8"
    >
      {/* Delicate Vertical Gold Manuscript Thread */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-4 bottom-4 end-[15.5px] w-px bg-gradient-to-b from-transparent via-[#D8B467]/30 to-transparent"
      />

      {/* Top Terminal Diamond Finial */}
      <span
        aria-hidden="true"
        className="pointer-events-none mb-0.5 me-[13px] h-1.5 w-1.5 rotate-45 bg-[#D8B467]/45"
      />

      {messages.items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleJump(e, item.id)}
            aria-label={item.label}
            aria-current={isActive ? "location" : undefined}
            className="group relative flex min-h-8 items-center justify-end gap-2 rounded-lg px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]"
          >
            {/* Illuminated Cartouche Label */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-[11px] font-bold transition-all duration-200 motion-reduce:transition-none ${
                isEn
                  ? "font-latin tracking-[0.12em] uppercase"
                  : "font-sacred text-xs tracking-normal"
              } ${
                isActive
                  ? "border-[#D8B467]/45 bg-[#0A1612]/92 text-[#F5DFA4] opacity-100 shadow-[0_2px_12px_rgba(0,0,0,0.5)] backdrop-blur-xs"
                  : "pointer-events-none border-[#D8B467]/20 bg-[#0A1612]/90 text-[#C5D2CC] opacity-0 backdrop-blur-xs -translate-x-1 rtl:translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              }`}
            >
              <span>{item.label}</span>
            </span>

            {/* Horizontal Manuscript Connector Rule */}
            <span
              aria-hidden="true"
              className={`block h-px rounded-full transition-all duration-300 motion-reduce:transition-none ${
                isActive
                  ? "w-5 bg-gradient-to-l from-[#E0B866] to-[#D8B467]/35 rtl:bg-gradient-to-r"
                  : "w-2 bg-[#D8B467]/35 group-hover:w-3.5 group-hover:bg-[#E0B866]/80"
              }`}
            />

            {/* Axial Geometric Marker (Rub el-Hizb for Active / Diamond Knot for Inactive) */}
            <span
              aria-hidden="true"
              className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#07100D]"
            >
              {isActive ? (
                <RubElHizbMark className="h-4 w-4 text-[#E0B866] drop-shadow-[0_0_8px_rgba(224,184,102,0.65)] transition-transform duration-300 motion-reduce:transition-none" />
              ) : (
                <span className="h-1.5 w-1.5 rotate-45 border border-[#D8B467]/50 bg-[#0D1915] transition-all duration-200 motion-reduce:transition-none group-hover:scale-125 group-hover:border-[#E0B866] group-hover:bg-[#163C31]" />
              )}
            </span>
          </a>
        );
      })}

      {/* Bottom Terminal Diamond Finial */}
      <span
        aria-hidden="true"
        className="pointer-events-none mt-0.5 me-[13px] h-1.5 w-1.5 rotate-45 bg-[#D8B467]/45"
      />
    </nav>
  );
}
