"use client";

import { useEffect, useState } from "react";
import { Locale } from "@/lib/landing-content";
import { ReleaseDownloadInfo } from "@/lib/github-release";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { TrustStrip } from "./TrustStrip";
import { FeaturesBento } from "./FeaturesBento";
import { InteractiveLockscreenShowcase } from "./InteractiveLockscreenShowcase";
import { DownloadSection } from "./DownloadSection";

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
        <FeaturesBento locale={locale} />
        <InteractiveLockscreenShowcase locale={locale} />
        <DownloadSection locale={locale} release={release} />
      </main>
    </div>
  );
}
