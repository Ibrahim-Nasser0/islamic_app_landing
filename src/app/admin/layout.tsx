import type { Metadata } from "next";
import "@/app/globals.css";
import { sanctuaryFontClasses } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "لوحة إدارة زاد المسلم | Zad Al-Muslim Admin",
  robots: { index: false, follow: false },
  icons: {
    icon: "/images/app_logo.png",
    apple: "/images/app_logo.png",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={sanctuaryFontClasses}
      style={{ colorScheme: "dark" }}
    >
      <body className="antialiased bg-[#07100D] text-[#F2EFE9]">{children}</body>
    </html>
  );
}
