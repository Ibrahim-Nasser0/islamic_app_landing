import type { Metadata } from "next";
import { Amiri, Cairo, Inter } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "زاد المسلم | Zad Al-Muslim — رفيقك اليومي في الذكر والصلاة والقرآن",
  description:
    "تطبيق زاد المسلم: مواقيت صلاة فلكية دقيقة، أذان أصلي يعمل والهاتف مقفول، أذكار الصباح والمساء على شاشة القفل، ومصحف عثماني كامل بلا إعلانات (صدقة جارية).",
  icons: {
    icon: "/images/app_logo.png",
    apple: "/images/app_logo.png",
  },
  openGraph: {
    title: "زاد المسلم | Zad Al-Muslim",
    description:
      "تطبيق إسلامي متكامل خالٍ من الإعلانات: أذان، قرآن، أذكار، قبلة، ومساجد قريبة.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${cairo.variable} ${amiri.variable} ${inter.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
