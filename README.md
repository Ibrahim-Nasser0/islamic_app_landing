# 🕊️ زاد المسلم — الموقع التعريفي الرسمي | Zad Al-Muslim Web

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.4.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.3.1-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**Official bilingual (`AR`/`EN`) landing site, smart APK download router, privacy portal, and maintainer dashboard for [Zad Al-Muslim](https://github.com/Ibrahim-Nasser0/islamic_app).**

</div>

---

## ⚡ البدء السريع (Quick Start < 5 min)

```bash
# 1. الدخول إلى المشروع وتثبيت الحزم
cd islamic_app_landing
npm install

# 2. تهيئة متغيرات البيئة (اختياري قبل ربط Supabase)
cp .env.example .env.local

# 3. تشغيل خادم التطوير
npm run dev
```

افتح `http://localhost:3000` (العربية افتراضياً على `/` والإنجليزية على `/en`).

---

## 🌐 الصفحات والمسارات | Routes & APIs

### الصفحات العامة (`src/app/[locale]/`)

| المسار (`AR` / `EN`) | الدور |
| :--- | :--- |
| `/` و `/en` | الصفحة الرئيسية: عرض المميزات، جولة التطبيق، معاينة الأذان والأذكار، الموثوقية، التحديثات، التحميل، والملاحظات. |
| `/about` و `/en/about` | رسالة التطبيق، الركائز، والمصادر الشرعية والتقنية (بما فيها مصدر الصوتيات `islamweb.net`). |
| `/guide` و `/en/guide` | دليل ضبط صلاحيات الأذان والبطارية وشاشة القفل لهواتف Honor / Huawei / Xiaomi / Samsung و iOS. |
| `/privacy` و `/en/privacy` | **سياسة الخصوصية الموحّدة** (التطبيق + الويب) — صالحة للاستخدام كرابط سياسة الخصوصية في Google Play Console. |
| `/admin` و `/admin/login` | لوحة تحكم المشرفين (الإحصائيات، الإصدارات، التنزيلات، الملاحظات، التنبيهات، سجل المراجعة، الفريق). |

### نقاط النهاية (`src/app/api/`)

| المسار | الوظيفة |
| :--- | :--- |
| `GET /api/download` | يكتشف معمارية الجهاز لحظياً في الذاكرة (`arm64-v8a` / `armeabi-v7a` / `x86_64` / `universal`) لتوجيه التحميل لأخف APK وتسجيل عداد مجهول الهوية دون حفظ IP أو Cookies. |
| `POST /api/feedback` | يستقبل البلاغات والاقتراحات مع حماية `honeypot` و`idempotency_key` ويحفظها في Supabase (أو يولّد رابط GitHub Issue كبديل). |
| `/api/admin/*` | إدارة الإصدارات، الملاحظات، الإعلانات الشريطية، الفريق، وكلمة المرور (محمية بمصادقة Supabase Auth). |

---

## 🎙️ المصادر والاعتمادات | Audio & Data Credits

- **عينات صوت الأذان التفاعلية**: تسجيلات الحرم المكي، والشيخ عبد الباسط عبد الصمد، والشيخ مشاري العفاسي في `public/audio/` مأخوذة من موقع **[islamweb.net](https://www.islamweb.net)**.
- **إصدارات التطبيق**: تُسحب تلقائياً من [GitHub Releases](https://github.com/Ibrahim-Nasser0/islamic_app/releases/latest) عبر `src/lib/github-release.ts`.

---

## 🏗️ هيكل المشروع | Project Structure

```text
islamic_app_landing/
├── public/
│   ├── audio/              # عينات الأذان المرجعية (islamweb.net)
│   ├── images/             # شعار زاد المسلم الرسمي
│   └── screenshots/        # لقطات شاشة اختيارية (src/config/screenshots.ts)
├── src/
│   ├── app/                # Next.js App Router ([locale], admin, api, sitemap, robots)
│   ├── components/         # أقسام الصفحة وواجهة المعاينة ولوحة الإدارة (admin/)
│   ├── config/             # site.ts (إعدادات المستودع والرابط العام) و screenshots.ts
│   ├── data/               # بيانات إسلامية ومؤذنين للمعاينة (islamic-data.ts)
│   ├── lib/                # i18n, github-release, device-apk, seo, supabase/
│   └── locales/{ar,en}/    # ملفات الترجمة المتطابقة (home, about, guide, privacy, common, admin)
├── tests/
│   └── localization-keys.test.ts   # اختبار تطابق جميع مفاتيح ar و en وتوجيه اللغات
├── supabase_schema.sql     # جداول Supabase الأساسية وسياسات RLS
├── supabase_feedback.sql   # تهيئة جدول البلاغات والمقترحات
└── package.json
```

---

## ⚙️ متغيرات البيئة | Configuration

أضف المتغيرات المطلوبة في `.env.local` (وفي إعدادات **Vercel Environment Variables** عند النشر):

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

> ⚠️ احتفظ بـ `SUPABASE_SERVICE_ROLE_KEY` على الخادم فقط ولا تعرضه بأي متغير يبدأ بـ `NEXT_PUBLIC_`.

---

## 🧪 الفحص والتحقق | Verification

```bash
npm run lint    # فحص ESLint و TypeScript
npm test        # اختبار تطابق مفاتيح الترجمة (ar/en) ومسارات اللغات
npm run build   # بناء نسخة الإنتاج والتحقق من المسارات الثابتة والديناميكية
npm run start   # تشغيل نسخة الإنتاج محلياً
```

---

## 🤲 وقف خيري مفتوح المصدر

هذا الموقع جزء من منظومة **زاد المسلم** — مجاني تماماً دون إعلانات أو تتبع تجاري.
