import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePageView } from "@/components/GuidePageView";
import {
  getCommonMessages,
  getGuideMessages,
  isValidLocale,
} from "@/lib/i18n";
import { buildLocaleMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const [common, guide] = await Promise.all([
    getCommonMessages(locale),
    getGuideMessages(locale),
  ]);

  return buildLocaleMetadata({
    locale,
    path: "/guide",
    title: guide.seo.title,
    description: guide.seo.description,
    siteName: common.seo.siteName,
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const [common, guide] = await Promise.all([
    getCommonMessages(locale),
    getGuideMessages(locale),
  ]);

  return <GuidePageView locale={locale} common={common} messages={guide} />;
}
