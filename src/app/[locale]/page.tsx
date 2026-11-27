import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppTourSection } from "@/components/AppTourSection";
import { DownloadSection } from "@/components/DownloadSection";
import { FaqSection } from "@/components/FaqSection";
import { FeaturesBento } from "@/components/FeaturesBento";
import { FeedbackSection } from "@/components/FeedbackSection";
import { FooterSection } from "@/components/FooterSection";
import { GoldHairlineDivider } from "@/components/GeometricMotifs";
import { HeroSection } from "@/components/HeroSection";
import { InteractiveLockscreenShowcase } from "@/components/InteractiveLockscreenShowcase";
import { LandingStateProvider } from "@/components/LandingStateProvider";
import { NativeReliabilitySection } from "@/components/NativeReliabilitySection";
import { ReleasesTimelineSection } from "@/components/ReleasesTimelineSection";
import { SectionScrollRail } from "@/components/SectionScrollRail";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteNoticeBanner } from "@/components/SiteNoticeBanner";
import { StickyMobileCta } from "@/components/StickyMobileCta";
import { TrustStrip } from "@/components/TrustStrip";
import { getLatestReleaseInfo } from "@/lib/github-release";
import {
  getCommonMessages,
  getHomeMessages,
  isValidLocale,
} from "@/lib/i18n";
import { getLandingDynamicData } from "@/lib/landing-data";
import { buildLocaleMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const [common, home] = await Promise.all([
    getCommonMessages(locale),
    getHomeMessages(locale),
  ]);

  return buildLocaleMetadata({
    locale,
    path: "/",
    title: home.seo.title,
    description: home.seo.description,
    siteName: common.seo.siteName,
  });
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const [common, home, release, dynamicData] = await Promise.all([
    getCommonMessages(locale),
    getHomeMessages(locale),
    getLatestReleaseInfo(),
    getLandingDynamicData(),
  ]);

  return (
    <LandingStateProvider
      locale={locale}
      release={release}
      initialDownloadCount={dynamicData.downloadCount}
      modalMessages={home.releaseModal}
    >
      <div className="min-h-screen">
        <SiteNoticeBanner
          notice={dynamicData.activeNotice}
          locale={locale}
          messages={common.siteNotice}
        />
        <SiteHeader locale={locale} messages={common} activePage="home" />

        <main id="main-content">
          <HeroSection
            locale={locale}
            messages={home.hero}
            release={release}
            initialDownloadCount={dynamicData.downloadCount}
          />
          <TrustStrip items={home.trust} />
          <GoldHairlineDivider />
          <FeaturesBento section={home.featuresSection} />
          <InteractiveLockscreenShowcase
            locale={locale}
            messages={home.spotlight}
          />
          <AppTourSection locale={locale} messages={home.appTour} />
          <GoldHairlineDivider />
          <NativeReliabilitySection
            locale={locale}
            messages={home.reliability}
          />
          <GoldHairlineDivider />
          <DownloadSection
            locale={locale}
            messages={home.downloadSection}
            release={release}
            initialDownloadCount={dynamicData.downloadCount}
          />
          <GoldHairlineDivider />
          <ReleasesTimelineSection
            locale={locale}
            messages={home.timeline}
            releases={dynamicData.releasesTimeline}
            latestFallback={release}
          />
          <FaqSection messages={home.faqSection} />
          <FeedbackSection
            locale={locale}
            messages={home.feedbackSection}
            appVersion={release.version}
          />
        </main>

        <FooterSection
          locale={locale}
          messages={common}
          releaseVersion={release.version}
          downloadCount={dynamicData.downloadCount}
        />

        <StickyMobileCta
          locale={locale}
          messages={home.stickyCta}
          releaseVersion={release.version}
        />

        <SectionScrollRail locale={locale} messages={home.sectionRail} />
      </div>
    </LandingStateProvider>
  );
}
