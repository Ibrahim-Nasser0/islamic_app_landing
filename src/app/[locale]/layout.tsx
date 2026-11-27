import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { siteConfig } from "@/config/site";
import { sanctuaryFontClasses } from "@/lib/fonts";
import {
  getCommonMessages,
  isValidLocale,
  SUPPORTED_LOCALES,
} from "@/lib/i18n";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolved = isValidLocale(locale) ? locale : "ar";
  const common = await getCommonMessages(resolved);

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: common.seo.defaultTitle,
    description: common.seo.defaultDescription,
    icons: {
      icon: "/images/app_logo.png",
      apple: "/images/app_logo.png",
    },
    openGraph: {
      title: common.seo.siteName,
      description: common.seo.ogDescription,
      type: "website",
    },
  };
}

export default async function LocaleRootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const common = await getCommonMessages(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={sanctuaryFontClasses}
      style={{ colorScheme: "dark" }}
    >
      <body className="antialiased bg-[#07100D] text-[#F2EFE9]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50 focus:rounded-xl focus:border focus:border-[#D8B467] focus:bg-[#0D1915] focus:px-4 focus:py-2.5 focus:text-xs focus:font-bold focus:text-[#F5DFA4] focus:shadow-lg focus:outline-none"
        >
          {common.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
