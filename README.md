# 🕊️ زاد المسلم — الصفحة التعريفية الرسمية | Zad Al-Muslim Landing Page

صفحة الهبوط التعريفية الرسمية لتطبيق **زاد المسلم** بثيم ليلي موحّد (**Dark-Only Celestial Obsidian**)، مبنية باستخدام **Next.js 16 (App Router)** و **Tailwind CSS v4**، ومُهيأة للنشر الفوري على **Vercel**.

## ✨ المميزات الرئيسية في الصفحة
- **جلب تلقائي لأحدث إصدار وسجل التحديثات من GitHub Releases (`ISR` كل 10 دقائق):** عبر [src/lib/github-release.ts](src/lib/github-release.ts) لعرض زر تحميل APK المباشر ونافذة *"ما الجديد في الإصدار؟"*.
- **قسم الشكاوى والاقتراحات الجاهز لـ Supabase (`/api/feedback`):** يستقبل الملاحظات مع الحماية من التكرار (`idempotencyKey`) وHoneypot، ويرسلها مباشرة إلى جدول `feedback` في Supabase بمجرد ضبط متغيرات البيئة في Vercel (مع رابط احتياطي لـ GitHub Issues لحين الربط).
- **مُعاين مواقيت المدن والتجربة التفاعلية:** استعراض شاشة الأذان والأذكار على شاشة القفل مع أصوات المؤذنين الحقيقية ومواقيت القاهرة ومكة والرياض ولندن.
- **تضمين لقطات الشاشة الحقيقية:** يدعم [src/config/screenshots.ts](src/config/screenshots.ts) وضع الصور الحقيقية داخل `public/screenshots/` لاحقاً.

## 🗄️ ربط Supabase لاحقاً (للوحة التحكم بالشكاوى والاقتراحات)
1. أنشئ مشروعاً على **Supabase** ونفّذ الاستعلام الموجود في [supabase_feedback.sql](supabase_feedback.sql) داخل **SQL Editor**.
2. في إعدادات مشروعك على **Vercel ← Environment Variables** أضف القيم الموضحة في [.env.example](.env.example):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_FEEDBACK_TABLE=feedback`

## 🚀 التشغيل والنشر
```bash
npm install
npm run dev
```
للتحقق قبل النشر: `npm run lint && npm run build`.
