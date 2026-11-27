import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { buildLocalizedPath, SUPPORTED_LOCALES } from "@/lib/i18n";

const PUBLIC_ROUTES = ["/", "/about", "/guide", "/privacy"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.siteUrl;
  const now = new Date();

  return SUPPORTED_LOCALES.flatMap((locale) =>
    PUBLIC_ROUTES.map((route) => {
      const path = buildLocalizedPath(locale, route);
      const arPath = buildLocalizedPath("ar", route);
      const enPath = buildLocalizedPath("en", route);
      return {
        url: `${baseUrl}${path}`,
        lastModified: now,
        changeFrequency: route === "/" ? "weekly" : "monthly",
        priority: route === "/" ? 1 : route === "/guide" ? 0.9 : 0.7,
        alternates: {
          languages: {
            ar: `${baseUrl}${arPath}`,
            en: `${baseUrl}${enPath}`,
          },
        },
      };
    })
  );
}
