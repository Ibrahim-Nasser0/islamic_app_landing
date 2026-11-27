import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildLocalizedPath, Locale } from "@/lib/i18n";

export function buildLocaleMetadata(params: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  siteName: string;
}): Metadata {
  const { locale, path, title, description, siteName } = params;
  const arPath = buildLocalizedPath("ar", path);
  const enPath = buildLocalizedPath("en", path);
  const canonicalPath = locale === "en" ? enPath : arPath;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        ar: arPath,
        en: enPath,
        "x-default": arPath,
      },
    },
    openGraph: {
      title,
      description,
      siteName,
      url: `${siteConfig.siteUrl}${canonicalPath}`,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
      type: "website",
    },
  };
}
