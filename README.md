# 🕊️ زاد المسلم — الصفحة التعريفية الرسمية | Zad Al-Muslim Landing Page

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.4.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.3.1-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![Dark Only](https://img.shields.io/badge/Theme-Celestial_Obsidian-D4AF37?style=for-the-badge)
![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**الصفحة التعريفية الرسمية لتطبيق [زاد المسلم (Zad Al-Muslim)](https://github.com/Ibrahim-Nasser0/islamic_app) — مصممة بثيم ليلي موحّد (`Dark-Only Celestial Obsidian`) مع جلب تلقائي لآخر إصدارات Android APK من GitHub Releases، ومعاينة تفاعلية للأذان وعداد الأذكار، ونموذج شكاوى واقتراحات جاهز للربط مع Supabase.**

</div>

---

## ✨ أبرز المميزات (Key Highlights)

- **هوية بصرية ليلية موحّدة (`Celestial Obsidian`)**: لوحة ألوان فاخرة تعتمد على الكوارتز الداكن (`#07090D`, `#0D1117`) مع لمسات الذهب العثماني (`#D4AF37`) والزمرد الإسلامي (`#10B981`) بدون أي تبديل مربك للألوان.
- **ثنائية اللغة تلقائياً (`AR / EN` + `RTL / LTR`)**: تدعم العربية كافتراضي مع اتجاه `rtl` وخطوط `Cairo` و`Amiri`، والتبديل الفوري للإنجليزية مع `ltr` وخط `Plus Jakarta Sans`.
- **ارتباط حي مع GitHub Releases**: جلب أحدث إصدار (`releases/latest`) من مستودع `Ibrahim-Nasser0/islamic_app` كل 10 دقائق (`revalidate: 600`) مع تفضيل تلقائي لنسخة `*-universal.apk` (ثم `arm64`) وعرض **سجل التحديثات الحقيقي (`Release Notes Modal`)**.
- **شريط تحميل عائم للجوال (`Sticky Mobile CTA`)**: يظهر تلقائياً أسفل الشاشة بعد التمرير لتسهيل تحميل التطبيق بضغطة واحدة.
- **معاينة حية للأذان والأذكار (`Interactive Lockscreen Showcase`)**: تشغيل عينات صوتية حقيقية من المؤذنين (الحرم المكي، عبد الباسط عبد الصمد، مشاري العفاسي) وتجربة عداد التسبيح مباشرة من الصفحة.
- **مُبدّل مواقيت المدن (`Quick City Switcher`)**: استعراض مواقيت الصلاة التفاعلية لأربع مدن (القاهرة، مكة المكرمة، الرياض، لندن) داخل جولة التطبيق.
- **شفافية الصلاحيات (`Permissions & Privacy Ledger`)**: توضيح صريح داخل قسم الموثوقية لأسباب طلب الموقع والمنبه الدقيق والعمل بدون خوادم تتبّع.
- **نظام شكاوى واقتراحات جاهز للـ Admin Panel**: نقطة نهاية `/api/feedback` تدعم الحفظ في **Supabase** مع مفتاح منع التكرار (`idempotency_key`) وحقل `honeypot` للحماية من السبام، مع بديل جاهز لفتح **GitHub Issue** مباشرة قبل ربط قاعدة البيانات.

---

## 🧩 أقسام الصفحة (Page Sections)

| الترتيب | المكون (`src/components/`) | الدور |
| :---: | --- | --- |
| 1 | `Navbar.tsx` | شريط تنقل زجاجي علوي مع التبديل بين `AR/EN` وزر التحميل المباشر |
| 2 | `HeroSection.tsx` | العنوان الرئيسي + زر تحميل آخر APK + معاينة شاشة القفل + فتح سجل التحديثات |
| 3 | `TrustStrip.tsx` | شريط الثقة (حساب فلكي محلي، بدون إعلانات، مصحف وأذكار، أذان دقيق) |
| 4 | `AppTourSection.tsx` | جولة داخل التطبيق (4 تبويبات: القرآن، المواقيت مع مبدّل المدن، المساجد القريبة، الحديث والأذكار) |
| 5 | `FeaturesBento.tsx` | شبكة Bento لعرض ركائز التطبيق الهندسية والإيمانية |
| 6 | `InteractiveLockscreenShowcase.tsx` | تجربة شاشة القفل التفاعلية + مشغل أصوات المؤذنين + عداد الأذكار |
| 7 | `NativeReliabilitySection.tsx` | شرح المحرك الأصيل (`AlarmClock` / `ForegroundService`) + بطاقة الخصوصية والصلاحيات |
| 8 | `FeedbackSection.tsx` | نموذج إرسال الشكاوى، الأخطاء، تصحيح المواقيت، والاقتراحات عبر `/api/feedback` |
| 9 | `FaqSection.tsx` | الأسئلة الشائعة حول التثبيت والأذونات ووضع توفير البطارية |
| 10 | `DownloadSection.tsx` + `StickyMobileCta.tsx` + `ReleaseNotesModal.tsx` | مركز التحميل النهائي مع رمز QR + شريط الجوال العائم + نافذة ملاحظات الإصدار |

---

## 🛠️ البنية التقنية (Project Structure)

```text
islamic_app_landing/
├── public/
│   ├── audio/                        # عينات صوتية للمؤذنين (al-harram, abd-elbaset, alafasy)
│   ├── images/
│   │   └── app_logo.png              # شعار زاد المسلم الرسمي
│   └── screenshots/                  # مجلد استضافة لقطات الشاشة الحقيقية من جهازك
├── src/
│   ├── app/
│   │   ├── api/feedback/route.ts     # Endpoint الشكاوى والاقتراحات (Supabase + GitHub Fallback)
│   │   ├── globals.css               # متغيرات ثيم Celestial Obsidian وخطوط RTL/LTR
│   │   ├── layout.tsx                # تحميل خطوط Google + SEO Metadata
│   │   └── page.tsx                  # Server Component لجلب بيانات آخر Release وتمريرها للواجهة
│   ├── components/                   # كافة مكونات أقسام الصفحة والـ SVG والـ Modals
│   ├── config/
│   │   ├── screenshots.ts            # مسارات لقطات الشاشة الاختيارية (null = عرض اللوحة البرمجية)
│   │   └── site.ts                   # إعدادات المستودع (GitHub Owner/Repo & Defaults)
│   └── lib/
│       ├── github-release.ts         # جلب آخر Release من GitHub وتحديد رابط Universal APK
│       └── landing-content.ts        # جميع النصوص ثنائية اللغة (ar / en) ومحتوى الأقسام
├── .env.example                      # متغيرات البيئة لربط Supabase مستقبلاً
├── supabase_feedback.sql             # سكريبت إنشاء جدول feedback + RLS Policies في Supabase
└── package.json
```

---

## 🚀 التشغيل المحلي (Local Development)

### المتطلبات
- **Node.js 20+**
- **npm**

### خطوات التشغيل

```bash
# 1. الدخول إلى مجلد المشروع
cd islamic_app_landing

# 2. تثبيت الحزم
npm install

# 3. نسخ ملف متغيرات البيئة (اختياري قبل إعداد Supabase)
cp .env.example .env.local

# 4. تشغيل خادم التطوير
npm run dev
```

افتح المتصفح على: `http://localhost:3000`

### أوامر الفحص والبناء

```bash
npm run lint     # فحص ESLint وقواعد TypeScript
npm run build    # بناء نسخة الإنتاج للتحقق من عدم وجود أخطاء
npm run start    # تشغيل نسخة الإنتاج محلياً
```

---

## 📸 استبدال اللوحات التفاعلية بلقطات شاشة حقيقية

الصفحة مهيأة افتراضياً بلوحات مصممة بالكود (`Coded Artboards`) حتى لا تظهر مساحات فارغة. لاستبدال أي لوحة بصورة حقيقية من جهازك:

1. ضع الصور بصيغة `.png` أو `.webp` داخل المجلد `public/screenshots/`.
2. عدّل المسارات في `src/config/screenshots.ts`:

| المفتاح في `appScreenshots` | القسم المستهدف | الاسم المقترح داخل `public/screenshots/` |
| --- | --- | --- |
| `heroLockscreen` | واجهة الأذان / شاشة القفل في الـ Hero | `/screenshots/adhan_lockscreen.png` |
| `quranTour` | تبويب القرآن الكريم في جولة التطبيق | `/screenshots/quran_reader.png` |
| `prayersTour` | تبويب المواقيت والصفحة الرئيسية | `/screenshots/home_prayers.png` |
| `mosquesTour` | تبويب المساجد القريبة والقبلة | `/screenshots/nearby_mosques.png` |
| `hadithTour` | تبويب الأحاديث والأذكار | `/screenshots/azkar_hadith.png` |

---

## 🗄️ ربط الشكاوى والاقتراحات بـ Supabase (عند إنشاء Admin Panel)

نقطة النهاية `POST /api/feedback` تعمل بطريقتين تلقائياً:
- **قبل إعداد Supabase**: تعيد `mode: "pending_supabase"` وتوفر للمستخدم رابط فتح Issue مُعبأ تلقائياً في GitHub (`githubIssueUrl`).
- **بعد إعداد Supabase**: تحفظ البلاغات مباشرة في جدول `public.feedback` عبر REST API مع دعم `idempotency_key` لمنع الإرسال المكرر.

### خطوات التفعيل:
1. أنشئ مشروعاً جديداً على [Supabase](https://supabase.com/).
2. افتح **SQL Editor** ونفّذ محتوى الملف [`supabase_feedback.sql`](./supabase_feedback.sql).
3. أضف المتغيرات التالية في `.env.local` (وفي **Vercel Environment Variables** عند النشر):

```env
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_FEEDBACK_TABLE=feedback
```

> ⚠️ **تنبيه أمني**: احتفظ بمفتاح `SUPABASE_SERVICE_ROLE_KEY` في متغيرات البيئة على الخادم فقط ولا تشاركه في أي متغير يبدأ بـ `NEXT_PUBLIC_`.

---

## ☁️ النشر على Vercel (Deployment)

1. ارفع مجلد `islamic_app_landing` إلى مستودع GitHub (أو اربطه مباشرة عبر **Vercel Dashboard -> Add New Project**).
2. تأكد أن **Framework Preset** مضبوط على **Next.js**.
3. أضف متغيرات البيئة من `.env.example` متى أعددت مشروع Supabase.
4. اضغط **Deploy** — سيتم سحب آخر إصدار Android من [`Ibrahim-Nasser0/islamic_app/releases/latest`](https://github.com/Ibrahim-Nasser0/islamic_app/releases/latest) تلقائياً وتحديث الصفحة كل 10 دقائق.

---

## 🤲 وقف خيري مفتوح المصدر

هذا المشروع جزء من منظومة **زاد المسلم** — تطبيق مجاني تماماً بدون إعلانات أو تتبّع، نرجو به النفع والأجر للجميع.
