"use client";

import { useEffect } from "react";
import { Download, ExternalLink, Sparkles, X } from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";
import { ReleaseDownloadInfo } from "@/lib/github-release";
import { buildTrackedDownloadPath } from "@/lib/download-url";
import { ManuscriptCorners, SANCTUARY_PRIMARY_CTA, SANCTUARY_SECONDARY_BTN } from "./GeometricMotifs";

interface ReleaseNotesModalProps {
  open: boolean;
  locale: Locale;
  release: ReleaseDownloadInfo;
  onDownloadClick?: () => void;
  onClose: () => void;
}

export function ReleaseNotesModal({
  open,
  locale,
  release,
  onDownloadClick,
  onClose,
}: ReleaseNotesModalProps) {
  const t = landingCopy[locale].releaseModal;
  const isAr = locale === "ar";

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const formattedDate = release.publishedAt
    ? new Date(release.publishedAt).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="release-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-[#D8B467]/35 bg-[#0D1915] p-6 text-[#F2EFE9] shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <ManuscriptCorners />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8B467]/30 bg-[#12231D]">
              <Sparkles className="h-5 w-5 text-[#E0B866]" />
            </div>
            <div>
              <h3 id="release-modal-title" className="text-lg font-extrabold">
                {t.title}
              </h3>
              <p className="font-latin text-xs text-[#D8B467]">
                {t.versionLabel}: {release.version}
                {release.fileSizeMb ? ` • ${release.fileSizeMb} MB` : ""}
                {formattedDate ? ` • ${formattedDate}` : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8B467]/20 bg-[#12231D] text-[#92A49B] transition-colors hover:text-white"
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
            })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDownloadClick}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold ${SANCTUARY_PRIMARY_CTA}`}
          >
            <Download className="h-4 w-4 text-[#F2D184]" />
            <span>{t.downloadNow}</span>
          </a>
          <a
            href={release.releasesPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold ${SANCTUARY_SECONDARY_BTN}`}
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#D8B467]" />
            <span>{t.viewOnGithub}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
