"use client";

import { useEffect, useRef, useState } from "react";
import { Download, MessageSquarePlus } from "lucide-react";
import { buildTrackedDownloadPath } from "@/lib/download-url";
import { HomeMessages, Locale } from "@/lib/i18n";
import {
  RubElHizbMark,
  SANCTUARY_PRIMARY_CTA,
  SANCTUARY_SECONDARY_BTN,
} from "./GeometricMotifs";
import { useLandingState } from "./LandingStateProvider";

interface StickyMobileCtaProps {
  locale: Locale;
  messages: HomeMessages["stickyCta"];
  releaseVersion: string;
}

export function StickyMobileCta({
  locale,
  messages: t,
  releaseVersion,
}: StickyMobileCtaProps) {
  const ctx = useLandingState();
  const detectedArch = ctx?.detectedArch ?? null;

  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);
  const downloadVisibleRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearIdle = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };

    const downloadEl = document.getElementById("download");
    const observer =
      downloadEl && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              const isInView = entries[0]?.isIntersecting ?? false;
              downloadVisibleRef.current = isInView;
              if (isInView) {
                clearIdle();
                setVisible(false);
              }
            },
            { threshold: 0.15 }
          )
        : null;

    if (downloadEl && observer) {
      observer.observe(downloadEl);
    }

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      clearIdle();

      // Always keep hidden at top Hero and bottom Download QR section
      if (currentY <= 380 || downloadVisibleRef.current) {
        setVisible(false);
        return;
      }

      if (delta > 6) {
        // Hide while actively scrolling downward; reveal again when reader pauses
        setVisible(false);
        idleTimerRef.current = setTimeout(() => {
          if (window.scrollY > 380 && !downloadVisibleRef.current) {
            setVisible(true);
          }
        }, 550);
      } else if (delta < -6) {
        // Reveal immediately on upward scroll
        setVisible(true);
      } else {
        idleTimerRef.current = setTimeout(() => {
          if (window.scrollY > 380 && !downloadVisibleRef.current) {
            setVisible(true);
          }
        }, 550);
      }
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearIdle();
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const downloadUrl = buildTrackedDownloadPath({
    source: "sticky_cta",
    locale,
    version: releaseVersion,
    arch: detectedArch,
  });

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-4 bottom-4 z-40 transition-all duration-300 ease-out motion-reduce:transition-none sm:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 rounded-2xl border border-[#D8B467]/40 bg-[#08130F]/95 p-2 shadow-2xl backdrop-blur-md">
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={ctx?.incrementDownloadCount}
          tabIndex={visible ? 0 : -1}
          className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${SANCTUARY_PRIMARY_CTA}`}
        >
          <RubElHizbMark className="h-3 w-3 text-[#F2D184]" />
          <Download className="h-3.5 w-3.5 text-[#F2D184]" />
          <span>{t.download}</span>
        </a>
        <a
          href="#feedback"
          tabIndex={visible ? 0 : -1}
          className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-xl px-3.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${SANCTUARY_SECONDARY_BTN}`}
        >
          <MessageSquarePlus className="h-3.5 w-3.5 text-[#D8B467]" />
          <span>{t.feedback}</span>
        </a>
      </div>
    </div>
  );
}
