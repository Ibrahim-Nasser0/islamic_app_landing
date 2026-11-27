import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutPageView } from "@/components/AboutPageView";
import {
  getAboutMessages,
  getCommonMessages,
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
  const [common, about] = await Promise.all([
    getCommonMessages(locale),
    getAboutMessages(locale),
  ]);

  return buildLocaleMetadata({
    locale,
    path: "/about",
    title: about.seo.title,
    description: about.seo.description,
    siteName: common.seo.siteName,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const [common, about] = await Promise.all([
    getCommonMessages(locale),
    getAboutMessages(locale),
  ]);

  return <AboutPageView locale={locale} common={common} messages={about} />;
}
