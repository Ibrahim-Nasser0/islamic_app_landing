import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrivacyPageView } from "@/components/PrivacyPageView";
import {
  getCommonMessages,
  getPrivacyMessages,
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
  const [common, privacy] = await Promise.all([
    getCommonMessages(locale),
    getPrivacyMessages(locale),
  ]);

  return buildLocaleMetadata({
    locale,
    path: "/privacy",
    title: privacy.seo.title,
    description: privacy.seo.description,
    siteName: common.seo.siteName,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const [common, privacy] = await Promise.all([
    getCommonMessages(locale),
    getPrivacyMessages(locale),
  ]);

  return <PrivacyPageView locale={locale} common={common} messages={privacy} />;
}
