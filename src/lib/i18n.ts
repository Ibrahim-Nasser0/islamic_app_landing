import type adminAr from "@/locales/ar/admin.json";
import type aboutAr from "@/locales/ar/about.json";
import type commonAr from "@/locales/ar/common.json";
import type guideAr from "@/locales/ar/guide.json";
import type homeAr from "@/locales/ar/home.json";
import type privacyAr from "@/locales/ar/privacy.json";

export const SUPPORTED_LOCALES = ["ar", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export type CommonMessages = typeof commonAr;
export type HomeMessages = typeof homeAr;
export type AboutMessages = typeof aboutAr;
export type GuideMessages = typeof guideAr;
export type PrivacyMessages = typeof privacyAr;
export type AdminMessages = typeof adminAr;

export function isValidLocale(value: string | undefined | null): value is Locale {
  return value === "ar" || value === "en";
}

export function resolveLocale(value: string | undefined | null): Locale {
  return isValidLocale(value) ? value : DEFAULT_LOCALE;
}

const loaders = {
  common: {
    ar: () => import("@/locales/ar/common.json").then((m) => m.default as CommonMessages),
    en: () => import("@/locales/en/common.json").then((m) => m.default as CommonMessages),
  },
  home: {
    ar: () => import("@/locales/ar/home.json").then((m) => m.default as HomeMessages),
    en: () => import("@/locales/en/home.json").then((m) => m.default as HomeMessages),
  },
  about: {
    ar: () => import("@/locales/ar/about.json").then((m) => m.default as AboutMessages),
    en: () => import("@/locales/en/about.json").then((m) => m.default as AboutMessages),
  },
  guide: {
    ar: () => import("@/locales/ar/guide.json").then((m) => m.default as GuideMessages),
    en: () => import("@/locales/en/guide.json").then((m) => m.default as GuideMessages),
  },
  privacy: {
    ar: () => import("@/locales/ar/privacy.json").then((m) => m.default as PrivacyMessages),
    en: () => import("@/locales/en/privacy.json").then((m) => m.default as PrivacyMessages),
  },
  admin: {
    ar: () => import("@/locales/ar/admin.json").then((m) => m.default as AdminMessages),
    en: () => import("@/locales/en/admin.json").then((m) => m.default as AdminMessages),
  },
} as const;

export async function getCommonMessages(locale: Locale): Promise<CommonMessages> {
  return loaders.common[locale]();
}

export async function getHomeMessages(locale: Locale): Promise<HomeMessages> {
  return loaders.home[locale]();
}

export async function getAboutMessages(locale: Locale): Promise<AboutMessages> {
  return loaders.about[locale]();
}

export async function getGuideMessages(locale: Locale): Promise<GuideMessages> {
  return loaders.guide[locale]();
}

export async function getPrivacyMessages(locale: Locale): Promise<PrivacyMessages> {
  return loaders.privacy[locale]();
}

export async function getAdminMessages(locale: Locale): Promise<AdminMessages> {
  return loaders.admin[locale]();
}

/**
 * Strips any explicit /ar or /en locale prefix from an internal pathname.
 */
export function stripLocalePrefix(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return normalized;
}

/**
 * Builds canonical localized internal links with Arabic as unprefixed primary locale
 * ("as-needed": ar -> "/", "/guide"; en -> "/en", "/en/guide").
 */
export function buildLocalizedPath(locale: Locale, path = "/"): string {
  const clean = stripLocalePrefix(path);
  if (locale === DEFAULT_LOCALE) {
    if (clean.startsWith("/#")) {
      return clean;
    }
    return clean;
  }

  if (clean === "/") {
    return "/en";
  }
  if (clean.startsWith("/#")) {
    return `/en${clean.slice(1)}`;
  }
  return `/en${clean}`;
}

/**
 * Switches the active locale in a pathname while preserving the current route.
 */
export function switchLocaleInPath(pathname: string, targetLocale: Locale): string {
  const cleanPath = stripLocalePrefix(pathname || "/");
  return buildLocalizedPath(targetLocale, cleanPath);
}
