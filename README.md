# 🕊️ زاد المسلم — الصفحة التعريفية الرسمية | Zad Al-Muslim Landing Page

صفحة الهبوط التعريفية الرسمية لتطبيق **زاد المسلم** مبنية باستخدام **Next.js (App Router)** و **Tailwind CSS v4**، ومُهيأة للنشر الفوري على **Vercel** مع جلب أحدث ملف APK تلقائياً من **GitHub Releases**.

## ✨ المميزات الرئيسية في الصفحة
- **جلب تلقائي لأحدث إصدار من GitHub Releases (`ISR` كل 10 دقائق):** عبر [src/lib/github-release.ts](src/lib/github-release.ts) لقراءة رابط التحميل المباشر لملف `.apk` ورقم الإصدار وحجمه من `Ibrahim-Nasser0/islamic_app`.
- **توليد QR Code حي:** للتحميل السريع عبر كاميرا الهاتف مباشرة من صفحة الويب.
- **تجربة تفاعلية حية لشاشة القفل والأذكار:** استماع لمقاطع الأذان (الحرم المكي، عبد الباسط، العفاسي) وتجربة عدّاد الأذكار في المتصفح.
- **دعم ثنائي اللغة (العربية `RTL` / الإنجليزية `LTR`) والوضع الفاتح والداكن.**

## 🚀 التشغيل والنشر على Vercel
```bash
npm install
npm run dev
```

للرفع على Vercel:
1. ادفع مجلد `islamic_app_landing` إلى مستودع Git أو استورده مباشرة في لوحة تحكم **Vercel**.
2. أو نفّذ `npx vercel` من داخل `E:\Islamic_Project\islamic_app_landing`.
3. بمجرد نشر أي Release جديد مرفق بملف `.apk` على `https://github.com/Ibrahim-Nasser0/islamic_app/releases`، تتحدث أزرار التحميل ورمز QR تلقائياً.
