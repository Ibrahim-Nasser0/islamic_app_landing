"use client";

import { useEffect, useState } from "react";
import { buildTrackedDownloadPath } from "@/lib/download-url";
import { ReleaseDownloadInfo } from "@/lib/github-release";
import { LandingDynamicData } from "@/lib/landing-data";
import { Locale } from "@/lib/landing-content";
import { AppTourSection } from "./AppTourSection";
import { DownloadSection } from "./DownloadSection";
import { FaqSection } from "./FaqSection";
import { FeaturesBento } from "./FeaturesBento";
import { FeedbackSection } from "./FeedbackSection";
import { GoldHairlineDivider } from "./GeometricMotifs";
import { HeroSection } from "./HeroSection";
import { InteractiveLockscreenShowcase } from "./InteractiveLockscreenShowcase";
import { NativeReliabilitySection } from "./NativeReliabilitySection";
import { Navbar } from "./Navbar";
import { ReleaseNotesModal } from "./ReleaseNotesModal";
import { ReleasesTimelineSection } from "./ReleasesTimelineSection";
import { SiteNoticeBanner } from "./SiteNoticeBanner";
import { StickyMobileCta } from "./StickyMobileCta";
import { TrustStrip } from "./TrustStrip";

interface LandingClientProps {
  release: ReleaseDownloadInfo;
  dynamicData: LandingDynamicData;
}

export function LandingClient({ release, dynamicData }: LandingClientProps) {
  // Arabic is always the strict initial default unless toggled explicitly by the visitor
  const [locale, setLocale] = useState<Locale>("ar");
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const navDownloadUrl = buildTrackedDownloadPath({
    source: "hero",
    locale,
    version: release.version,
  });

  const stickyDownloadUrl = buildTrackedDownloadPath({
    source: "sticky_cta",
    locale,
    version: release.version,
  });

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen">
      <SiteNoticeBanner notice={dynamicData.activeNotice} locale={locale} />
      <Navbar
        locale={locale}
        downloadUrl={navDownloadUrl}
        onToggleLocale={() => setLocale((l) => (l === "ar" ? "en" : "ar"))}
      />
      <main>
        <HeroSection
          locale={locale}
          release={release}
          downloadCount={dynamicData.downloadCount}
          onOpenReleaseNotes={() => setNotesOpen(true)}
        />
        <TrustStrip locale={locale} />
        <GoldHairlineDivider />
        <AppTourSection locale={locale} />
        <GoldHairlineDivider />
        <FeaturesBento locale={locale} />
        <InteractiveLockscreenShowcase locale={locale} />
        <NativeReliabilitySection locale={locale} />
        <GoldHairlineDivider />
        <ReleasesTimelineSection
          locale={locale}
          releases={dynamicData.releasesTimeline}
          latestFallback={release}
        />
        <GoldHairlineDivider />
        <FeedbackSection locale={locale} appVersion={release.version} />
        <FaqSection locale={locale} />
        <DownloadSection
          locale={locale}
          release={release}
          downloadCount={dynamicData.downloadCount}
        />
      </main>

      <StickyMobileCta locale={locale} downloadUrl={stickyDownloadUrl} />
      <ReleaseNotesModal
        open={notesOpen}
        locale={locale}
        release={release}
        onClose={() => setNotesOpen(false)}
      />
    </div>
  );
}
