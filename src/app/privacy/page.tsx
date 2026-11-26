import type { Metadata } from "next";
import { PrivacyPageClient } from "@/components/PrivacyPageClient";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | زاد المسلم — Zad Al-Muslim Privacy Policy",
  description:
    "سياسة الخصوصية الكاملة لتطبيق زاد المسلم (Android / iOS) والموقع الرسمي: لا إعلانات، لا تتبع سلوكي، وتوضيح شفاف لجميع الأذونات وبيانات التحميل والملاحظات.",
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
