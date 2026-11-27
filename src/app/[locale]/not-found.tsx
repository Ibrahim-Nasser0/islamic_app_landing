"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RubElHizbMark, SANCTUARY_PRIMARY_CTA } from "@/components/GeometricMotifs";
import { buildLocalizedPath, Locale } from "@/lib/i18n";

export default function LocaleNotFound() {
  const pathname = usePathname() || "";
  const isEn = pathname.startsWith("/en");
  const locale: Locale = isEn ? "en" : "ar";

  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-[#07100D] px-6 text-center text-[#F2EFE9]"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-[#D8B467]/35 bg-[#0D1915] px-4 py-1.5 text-xs font-semibold text-[#E0B866]">
        <RubElHizbMark className="h-3.5 w-3.5" />
        <span className="font-latin">404</span>
      </div>
      <h1 className="font-sacred mt-5 text-3xl font-bold text-[#F4EFE4] sm:text-4xl">
        {isEn ? "Page Not Found" : "الصفحة غير موجودة"}
      </h1>
      <p className="mt-3 max-w-md text-sm text-[#92A49B]">
        {isEn
          ? "The link you followed may have moved or does not exist."
          : "عذراً، الرابط الذي طلبته غير متوفر أو تم نقله."}
      </p>
      <Link
        href={buildLocalizedPath(locale, "/")}
        className={`mt-7 inline-flex h-11 items-center rounded-xl px-6 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467] ${SANCTUARY_PRIMARY_CTA}`}
      >
        {isEn ? "Back to Home" : "العودة إلى الرئيسية"}
      </Link>
    </main>
  );
}
