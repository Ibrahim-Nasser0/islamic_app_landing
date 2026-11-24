"use client";

import { QRCodeSVG } from "qrcode.react";
import { Download, ExternalLink, ShieldAlert } from "lucide-react";
import { Locale, landingCopy } from "@/lib/landing-content";
import { ReleaseDownloadInfo } from "@/lib/github-release";

interface DownloadSectionProps {
  locale: Locale;
  release: ReleaseDownloadInfo;
}

export function DownloadSection({ locale, release }: DownloadSectionProps) {
  const t = landingCopy[locale].downloadSection;
  const footer = landingCopy[locale].footer;

  return (
    <>
      <section id="download" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid items-center gap-8 rounded-[32px] border border-[var(--sanctuary-gold)]/35 bg-[var(--sanctuary-surface)] p-7 shadow-sm sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <span className="inline-block rounded-full border border-[var(--sanctuary-border)] bg-[var(--sanctuary-paper)] px-3.5 py-1 text-xs font-semibold text-[var(--sanctuary-emerald)]">
              {t.badge} • {release.version}
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-[var(--sanctuary-ink)] sm:text-4xl">
              {t.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--sanctuary-muted)] sm:text-base">
              {t.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap gap-3.5">
              <a
                href={release.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-13 items-center gap-2.5 rounded-2xl bg-[var(--sanctuary-emerald)] px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <Download className="h-4 w-4 text-[#E0B866]" />
                <span>{t.primaryBtn}</span>
                {release.fileSizeMb && (
                  <span className="font-latin text-xs text-white/80">
                    ({release.fileSizeMb} MB)
                  </span>
                )}
              </a>

              <a
                href={release.releasesPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-13 items-center gap-2 rounded-2xl border border-[var(--sanctuary-border)] px-5 py-3 text-sm font-semibold text-[var(--sanctuary-ink)] transition-colors hover:border-[var(--sanctuary-gold)]"
              >
                <ExternalLink className="h-4 w-4 text-[var(--sanctuary-gold)]" />
                <span>{t.allReleases}</span>
              </a>
            </div>

            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-paper)] p-4">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[var(--sanctuary-gold)]" />
              <div className="text-xs leading-relaxed text-[var(--sanctuary-muted)]">
                <p className="font-bold text-[var(--sanctuary-ink)]">
                  {t.batteryTipTitle}
                </p>
                <p className="mt-1">{t.batteryTipBody}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--sanctuary-border)] bg-[var(--sanctuary-paper)] p-6 text-center lg:col-span-4">
            <div className="rounded-2xl border border-[var(--sanctuary-border)] bg-white p-3.5 shadow-xs">
              <QRCodeSVG value={release.downloadUrl} size={150} level="M" />
            </div>
            <p className="mt-4 text-xs font-bold text-[var(--sanctuary-ink)]">
              {t.qrLabel}
            </p>
            <p className="font-latin mt-1 text-[11px] text-[var(--sanctuary-muted)]">
              {release.fileName ?? "GitHub Releases • APK"}
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--sanctuary-border)] bg-[var(--sanctuary-surface)]/70 py-10 text-center">
        <div className="mx-auto max-w-4xl px-5">
          <p className="font-sacred text-base text-[var(--sanctuary-ink)] sm:text-lg">
            {footer.waqf}
          </p>
          <p className="mt-3 text-xs text-[var(--sanctuary-muted)]">
            {footer.builtWith}
          </p>
        </div>
      </footer>
    </>
  );
}
