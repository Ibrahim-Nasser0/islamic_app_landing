"use client";

import { useEffect, useRef } from "react";
import { Download, ExternalLink, X } from "lucide-react";
import { ApkArch, ApkVariant } from "@/lib/device-apk";
import { buildTrackedDownloadPath } from "@/lib/download-url";
import { ReleaseDownloadInfo } from "@/lib/github-release";
import { HomeMessages, Locale } from "@/lib/i18n";
import {
  ManuscriptCorners,
  RubElHizbMark,
  SANCTUARY_PRIMARY_CTA,
  SANCTUARY_SECONDARY_BTN,
} from "./GeometricMotifs";

interface ReleaseNotesModalProps {
  open: boolean;
  locale: Locale;
  messages: HomeMessages["releaseModal"];
  release: ReleaseDownloadInfo;
  detectedArch: ApkArch | null;
  matchedVariant: ApkVariant | null;
  onDownloadClick?: () => void;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function ReleaseNotesModal({
  open,
  locale,
  messages: t,
  release,
  detectedArch,
  matchedVariant,
  onDownloadClick,
  onClose,
}: ReleaseNotesModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const isAr = locale === "ar";

  useEffect(() => {
    if (!open) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move initial keyboard focus safely to the close button inside the modal
    closeButtonRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const formattedDate = release.publishedAt
    ? new Date(release.publishedAt).toLocaleDateString(
        isAr ? "ar-EG" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      )
    : null;

  const displaySizeMb = matchedVariant?.sizeMb ?? release.fileSizeMb;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="release-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-[#D8B467]/35 bg-[#0D1915] p-6 text-[#F2EFE9] shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <ManuscriptCorners />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8B467]/30 bg-[#12231D]">
              <RubElHizbMark className="h-5 w-5 text-[#E0B866]" />
            </div>
            <div>
              <h3 id="release-modal-title" className="text-lg font-extrabold">
                {t.title}
              </h3>
              <p className="font-latin text-xs text-[#D8B467]">
                {t.versionLabel}: {release.version}
                {displaySizeMb ? ` • ${displaySizeMb} MB` : ""}
                {matchedVariant ? ` • ${matchedVariant.arch}` : ""}
                {formattedDate ? ` • ${formattedDate}` : ""}
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D8B467]/20 bg-[#12231D] text-[#92A49B] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 max-h-64 overflow-y-auto rounded-2xl border border-[#D8B467]/20 bg-[#07100D] p-4 text-sm leading-relaxed text-[#D7E0DC]">
          <pre className="whitespace-pre-wrap font-sans">
            {release.releaseNotes ?? t.emptyNotes}
          </pre>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={buildTrackedDownloadPath({
              source: "hero",
              locale,
              version: release.version,
              arch: detectedArch,
            })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDownloadClick}
            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${SANCTUARY_PRIMARY_CTA}`}
          >
            <Download className="h-4 w-4 text-[#F2D184]" />
            <span>{t.downloadNow}</span>
          </a>
          <a
            href={release.releasesPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${SANCTUARY_SECONDARY_BTN}`}
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#D8B467]" />
            <span>{t.viewOnGithub}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
