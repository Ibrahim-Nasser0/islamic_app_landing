"use client";

import { useEffect, useState } from "react";
import { Locale } from "@/lib/landing-content";
import { ReleaseDownloadInfo } from "@/lib/github-release";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { TrustStrip } from "./TrustStrip";
import { AppTourSection } from "./AppTourSection";
import { FeaturesBento } from "./FeaturesBento";
import { InteractiveLockscreenShowcase } from "./InteractiveLockscreenShowcase";
import { NativeReliabilitySection } from "./NativeReliabilitySection";
import { FeedbackSection } from "./FeedbackSection";
import { FaqSection } from "./FaqSection";
import { DownloadSection } from "./DownloadSection";
import { ReleaseNotesModal } from "./ReleaseNotesModal";
import { StickyMobileCta } from "./StickyMobileCta";
import { GoldHairlineDivider } from "./GeometricMotifs";

export function LandingClient({ release }: { release: ReleaseDownloadInfo }) {
  const [locale, setLocale] = useState<Locale>("ar");
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen pb-16 sm:pb-0">
      <Navbar
        locale={locale}
        downloadUrl={release.downloadUrl}
        onToggleLocale={() => setLocale((l) => (l === "ar" ? "en" : "ar"))}
      />
      <main>
        <HeroSection
          locale={locale}
          release={release}
          onOpenReleaseNotes={() => setNotesOpen(true)}
        />
        <TrustStrip locale={locale} />
        <AppTourSection locale={locale} />
        <GoldHairlineDivider />
        <FeaturesBento locale={locale} />
        <InteractiveLockscreenShowcase locale={locale} />
        <NativeReliabilitySection locale={locale} />
        <GoldHairlineDivider />
        <FeedbackSection locale={locale} />
        <FaqSection locale={locale} />
        <DownloadSection locale={locale} release={release} />
      </main>

      <StickyMobileCta locale={locale} downloadUrl={release.downloadUrl} />
      <ReleaseNotesModal
        open={notesOpen}
        locale={locale}
        release={release}
        onClose={() => setNotesOpen(false)}
      />
    </div>
  );
}
