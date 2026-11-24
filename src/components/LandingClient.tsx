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
import { FaqSection } from "./FaqSection";
import { DownloadSection } from "./DownloadSection";
import { GoldHairlineDivider } from "./GeometricMotifs";

export function LandingClient({ release }: { release: ReleaseDownloadInfo }) {
  const [locale, setLocale] = useState<Locale>("ar");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen">
      <Navbar
        locale={locale}
        isDark={isDark}
        downloadUrl={release.downloadUrl}
        onToggleLocale={() => setLocale((l) => (l === "ar" ? "en" : "ar"))}
        onToggleTheme={() => setIsDark((d) => !d)}
      />
      <main>
        <HeroSection locale={locale} release={release} />
        <TrustStrip locale={locale} />
        <AppTourSection locale={locale} />
        <GoldHairlineDivider />
        <FeaturesBento locale={locale} />
        <InteractiveLockscreenShowcase locale={locale} />
        <NativeReliabilitySection locale={locale} />
        <FaqSection locale={locale} />
        <DownloadSection locale={locale} release={release} />
      </main>
    </div>
  );
}
