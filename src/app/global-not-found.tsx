import Link from "next/link";
import "@/app/globals.css";
import { sanctuaryFontClasses } from "@/lib/fonts";

export default function GlobalNotFound() {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={sanctuaryFontClasses}
      style={{ colorScheme: "dark" }}
    >
      <body className="antialiased flex min-h-screen flex-col items-center justify-center bg-[#07100D] px-6 text-center text-[#F2EFE9]">
        <p className="font-sacred text-5xl font-bold text-[#D8B467]">404</p>
        <h1 className="font-sacred mt-4 text-2xl font-bold text-[#F4EFE4]">
          الصفحة غير موجودة
        </h1>
        <p className="mt-2 max-w-md text-sm text-[#92A49B]">
          عذراً، الرابط الذي طلبته غير متوفر أو تم نقله.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-xl border border-[#D8B467]/45 bg-gradient-to-b from-[#216E5C] to-[#13473B] px-5 text-sm font-bold text-[#FBF7ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B467]"
        >
          العودة إلى الرئيسية
        </Link>
      </body>
    </html>
  );
}
