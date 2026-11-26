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
  const [localDownloadDelta, setLocalDownloadDelta] = useState(0);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const displayedDownloadCount = dynamicData.downloadCount + localDownloadDelta;
  const handleDownloadClick = () => {
    setLocalDownloadDelta((prev) => prev + 1);
  };

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
        onDownloadClick={handleDownloadClick}
        onToggleLocale={() => setLocale((l) => (l === "ar" ? "en" : "ar"))}
      />
      <main>
        <HeroSection
          locale={locale}
          release={release}
          downloadCount={displayedDownloadCount}
          onDownloadClick={handleDownloadClick}
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
          onDownloadClick={handleDownloadClick}
        />
        <GoldHairlineDivider />
        <FeedbackSection locale={locale} appVersion={release.version} />
        <FaqSection locale={locale} />
        <DownloadSection
          locale={locale}
          release={release}
          downloadCount={displayedDownloadCount}
          onDownloadClick={handleDownloadClick}
        />
      </main>

      <StickyMobileCta
        locale={locale}
        downloadUrl={stickyDownloadUrl}
        onDownloadClick={handleDownloadClick}
      />
      <ReleaseNotesModal
        open={notesOpen}
        locale={locale}
        release={release}
        onDownloadClick={handleDownloadClick}
        onClose={() => setNotesOpen(false)}
      />
    </div>
  );
}
