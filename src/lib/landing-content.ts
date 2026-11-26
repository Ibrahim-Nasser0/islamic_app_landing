export type Locale = "ar" | "en";

export interface MuezzinPreview {
  id: string;
  nameAr: string;
  nameEn: string;
  locationAr: string;
  locationEn: string;
  audioSrc: string;
}

export const MUEZZIN_PREVIEWS: MuezzinPreview[] = [
  {
    id: "makkah",
    nameAr: "الحرم المكي • الشيخ أحمد علي ملا",
    nameEn: "Makkah Sanctuary • Sheikh Ahmed Mulla",
    locationAr: "مكة المكرمة",
    locationEn: "Makkah",
    audioSrc: "/audio/al-harram-regular.mp3",
  },
  {
    id: "abdulbaset",
    nameAr: "الشيخ عبد الباسط عبد الصمد",
    nameEn: "Sheikh Abdulbasit Abdulsamad",
    locationAr: "مصر",
    locationEn: "Egypt",
    audioSrc: "/audio/abd-elbaset-regular.mp3",
  },
  {
    id: "alafasy",
    nameAr: "الشيخ مشاري راشد العفاسي",
    nameEn: "Sheikh Mishary Al-Afasy",
    locationAr: "الكويت",
    locationEn: "Kuwait",
    audioSrc: "/audio/alafasy-regular.mp3",
  },
];

export interface CityPrayerPreview {
  id: "cairo" | "makkah" | "riyadh" | "london";
  nameAr: string;
  nameEn: string;
  qiblaAr: string;
  qiblaEn: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export const QUICK_CITIES: CityPrayerPreview[] = [
  {
    id: "cairo",
    nameAr: "القاهرة",
    nameEn: "Cairo",
    qiblaAr: "136° جنوب شرق",
    qiblaEn: "136° SE",
    fajr: "05:04",
    dhuhr: "11:51",
    asr: "03:18",
    maghrib: "05:42",
    isha: "07:03",
  },
  {
    id: "makkah",
    nameAr: "مكة المكرمة",
    nameEn: "Makkah",
    qiblaAr: "القبلة الشريفة",
    qiblaEn: "Al-Kaaba",
    fajr: "05:22",
    dhuhr: "12:14",
    asr: "03:34",
    maghrib: "05:56",
    isha: "07:26",
  },
  {
    id: "riyadh",
    nameAr: "الرياض",
    nameEn: "Riyadh",
    qiblaAr: "244° غرب جنوب",
    qiblaEn: "244° WSW",
    fajr: "04:58",
    dhuhr: "11:46",
    asr: "03:02",
    maghrib: "05:24",
    isha: "06:54",
  },
  {
    id: "london",
    nameAr: "لندن",
    nameEn: "London",
    qiblaAr: "119° شرق جنوب",
    qiblaEn: "119° ESE",
    fajr: "05:49",
    dhuhr: "11:54",
    asr: "01:47",
    maghrib: "04:01",
    isha: "05:38",
  },
];

export interface SampleDhikr {
  id: string;
  arabicText: string;
  target: number;
  fadlAr: string;
  fadlEn: string;
  referenceAr: string;
  referenceEn: string;
}

export const SAMPLE_AZKAR: SampleDhikr[] = [
  {
    id: "m_1",
    arabicText:
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ ، وَالْحَمْدُ لِلَّهِ ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    target: 1,
    fadlAr: "من أذكار الصباح الثابتة في افتتاح اليوم بالتوحيد",
    fadlEn: "Authentic morning remembrance dedicating the day to Allah",
    referenceAr: "رواه مسلم",
    referenceEn: "Sahih Muslim",
  },
  {
    id: "m_2",
    arabicText:
      "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    target: 3,
    fadlAr: "من قالها ثلاثاً صباحاً لم يضره شيء حتى يمسي",
    fadlEn: "Whoever recites it three times is protected until evening",
    referenceAr: "رواه أبو داود والترمذي",
    referenceEn: "Abu Dawud & Al-Tirmidhi",
  },
  {
    id: "m_3",
    arabicText: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    target: 3,
    fadlAr: "كلمتان خفيفتان على اللسان ثقيلتان في الميزان",
    fadlEn: "Light on the tongue, heavy on the Scale of deeds",
    referenceAr: "متفق عليه",
    referenceEn: "Agreed Upon",
  },
];

export const POST_ADHAN_DUAA =
  "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ القَائِمَةِ، آتِ مُحَمَّدًا الوَسِيلَةَ وَالفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ";

type WidenPrimitives<T> = T extends string
  ? string
  : T extends boolean
    ? boolean
    : T extends readonly (infer U)[]
      ? readonly WidenPrimitives<U>[]
      : T extends object
        ? { readonly [K in keyof T]: WidenPrimitives<T[K]> }
        : T;

const arCopy = {
  brand: "زاد المسلم",
  tagline: "رفيقك اليومي في الذكر والصلاة والقرآن",
  nav: {
    tour: "جولة بالتطبيق",
    features: "المميزات",
    lockscreen: "شاشة القفل",
    reliability: "الموثوقية",
    releases: "الإصدارات",
    feedback: "الشكاوى والاقتراحات",
    download: "التحميل",
    menuLabel: "فتح القائمة",
    closeMenuLabel: "إغلاق القائمة",
  },
  siteNotice: {
    dismiss: "إغلاق التنبيه",
  },
  hero: {
    waqfBadge: "صدقة جارية • مجاني 100% بلا إعلانات",
    verse: "﴿ وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَىٰ ﴾",
    verseSource: "سورة البقرة: 197",
    title: "عبادتك اليومية في ملاذٍ ليلي هادئ، دقيق، وموثوق",
    subtitle:
      "مواقيت صلاة فلكية دقيقة دون إنترنت، أذان أصلي يصدح حتى والهاتف مقفول، أذكار الصباح والمساء التفاعلية على شاشة القفل، والمصحف الشريف بالرسم العثماني.",
    downloadApk: "تحميل للأندرويد (APK)",
    releaseFallback: "تحميل عبر GitHub Releases",
    minAndroid: "أندرويد 8.0 فأحدث",
    downloadsLabel: "تحميل",
    autoDetectedBuild: "مناسب لجهازك تلقائياً",
    universalFallbackNote: "نسخة شاملة تعمل على أي هاتف أندرويد",
    whatsNew: "ما الجديد في الإصدار؟",
    scanQr: "مسح QR للتحميل",
    storesSoon: "قريباً على Google Play و App Store",
    floatingNextPrayer: "صلاة الفجر بعد 04:12 س",
    floatingLockOk: "الأذان يعمل والهاتف مقفول ✓",
    mockup: {
      fajrStatus: "★ الآن موعد صلاة الفجر • 05:04 ص",
      fajrTitle: "صلاة الفجر",
      muezzinName: "أذان الحرم المكي • مكة المكرمة",
      stopAdhan: "إيقاف الأذان",
      qiblaBtn: "اتجاه القبلة 🧭",
      openAppBtn: "فتح التطبيق ↗",
      nativeBadge: "محرك المنبه الأصلي",
    },
  },
    releaseModal: {
      title: "سجل تحديثات الإصدار",
      versionLabel: "الإصدار الحالي",
      publishedLabel: "تاريخ النشر",
      emptyNotes:
        "يتضمن هذا الإصدار المنظومة الأصلية للأذان والأذكار فوق شاشة القفل، الحساب الفلكي لمواقيت الصلاة، المصحف العثماني، بوصلة القبلة، وخريطة المساجد القريبة.",
      downloadNow: "تحميل هذا الإصدار (APK)",
      viewOnGithub: "عرض التفاصيل على GitHub",
      close: "إغلاق",
    },
    trust: [
      { metric: "100%", label: "صدقة جارية مجانية", detail: "لوجه الله تعالى" },
      { metric: "0", label: "إعلانات أو تتبع", detail: "خصوصية تامة 100%" },
      { metric: "114", label: "سورة دون إنترنت", detail: "مع مواقيت وأذكار محلية" },
      { metric: "7 أيام", label: "جدولة أصلية مسبقة", detail: "Android & iOS Native" },
    ],
    appTour: {
      eyebrow: "جولة بصرية داخل العوالم الأربعة",
      title: "تجربة مترابطة صُمّمت للسكينة لا للإبهار الفارغ",
      subtitle:
        "تعرّف على شاشات التطبيق في الوضع الليلي الهادئ، وجرّب معاين المواقيت الفورية حسب مدينتك.",
      citySwitcherLabel: "جرّب مواقيت المدن:",
      quranDemo: {
        header: "سورة الفاتحة • مكية",
        juz: "الجزء الأول",
        page: "صفحة 1",
      },
      prayerNames: {
        fajr: "الفجر",
        dhuhr: "الظهر",
        asr: "العصر",
        maghrib: "المغرب",
        isha: "العشاء",
      },
      mosqueDemo: {
        name: "مسجد الفتح",
        distance: "320 م",
        walkTime: "حوالي 4 دقائق سيراً",
      },
      hadithDemo: {
        book: "الأربعون النووية",
        tasbeehLabel: "السبحة اليومية",
      },
      tabs: [
        {
          id: "quran",
          title: "المصحف العثماني",
          badge: "تلاوة ليلية مريحة",
          headline: "صفحات داكنة مريحة للعين بالرسم العثماني مع حفظ لحظي للموضع",
          points: [
            "فهرس متكامل لـ 114 سورة و30 جزءاً مع بحث فوري.",
            "علامات مرجعية (Bookmarks) للعودة إلى آخر آية بلمسة.",
            "بقاء النص القرآني بالعربية الأصيلة في كل لغات التطبيق.",
          ],
        },
        {
          id: "prayers",
          title: "المواقيت والقبلة",
          badge: "مُعاين المدن المباشر",
          headline: "توقيت فلكي بالثانية مع بوصلة قبلة باستجابة لمسية",
          points: [
            "تحديد تلقائي عبر GPS أو اختيار يدوي لأكثر المدن شهرة.",
            "تنبيه هادئ قبل كل صلاة بـ 5 دقائق للاستعداد والوضوء.",
            "بوصلة قبلة تمنحك اهتزازاً لطيفاً بمجرد المحاذاة مع مكة.",
          ],
        },
        {
          id: "mosques",
          title: "بيوت الله القريبة",
          badge: "خرائط OpenStreetMap",
          headline: "اعثر على أقرب مسجد في محيطك حتى في السفر",
          points: [
            "نطاق بحث مرن (500 م، 1 كم، 3 كم، 5 كم).",
            "حساب المسافة ووقت الوصول التقريبي سيراً أو بالسيارة.",
            "فتح مسار الملاحة مباشرة عبر خرائط هاتفك بضغطة واحدة.",
          ],
        },
        {
          id: "hadith",
          title: "الحديث وحصن المسلم",
          badge: "مصادر موثّقة",
          headline: "مكتبة أحاديث وأذكار متكاملة مع سبحة إلكترونية ذكية",
          points: [
            "كتب موثوقة: البخاري، مسلم، الأربعون النووية، رياض الصالحين.",
            "سبحة إلكترونية بتسبيح تلقائي واهتزازات عند إتمام الأوراد.",
            "تخريج واضح وفضل كل ذكر بتصميم مريح للعين.",
          ],
        },
      ],
    },
    featuresSection: {
      eyebrow: "الهندسة والقدرات",
      title: "تفاصيل صغيرة تصنع فرقاً يومياً في التزامك",
      subtitle:
        "تم بناء المكونات بتناغم كامل بين سرعة الأداء وهدوء المظهر دون زحام أو تشتيت.",
      cards: [
        {
          id: "native",
          featured: true,
          badge: "أعلى موثوقية والهاتف مقفول",
          title: "أذان أصلي مستقل يصدح كاملاً فوق شاشة القفل",
          desc: "لا ينقطع الأذان بعد ثانيتين! يعتمد التطبيق على منبهات AlarmClock الأصلية وخدمة MediaPlayback أمامية تعزل الصوت عن محرك Flutter وتعرض شاشة الدعاء فوق القفل.",
        },
        {
          id: "quran",
          featured: false,
          badge: "114 سورة كاملة",
          title: "المصحف الشريف بالرسم العثماني",
          desc: "خط Amiri العثماني المريح مع تدرجات ليلية مصممة للقراءة المطولة.",
        },
        {
          id: "azkar",
          featured: false,
          badge: "مزامنة ثنائية",
          title: "رفيق الأذكار فوق شاشة القفل",
          desc: "أنجز أذكار الصباح والمساء من القفل وسيرى التطبيق تقدمك فوراً.",
        },
        {
          id: "prayers",
          featured: false,
          badge: "حساب فلكي محلي",
          title: "المواقيت والتاريخ الهجري",
          desc: "دقة عالية دون استهلاك باقة الإنترنت أو خدمات خلفية ثقيلة.",
        },
        {
          id: "qibla",
          featured: false,
          badge: "مستشعرات دقيقة",
          title: "بوصلة القبلة والمحاذاة اللمسية",
          desc: "معايرة فورية لاتجاه القبلة مع اهتزاز تكتيكي عند التطابق.",
        },
        {
          id: "mosques",
          featured: false,
          badge: "مجاني وبلا إعلانات",
          title: "المساجد والأحاديث الصحيحة",
          desc: "استكشاف المساجد القريبة وتصفح شروح الأحاديث بسهولة تامة.",
        },
      ],
    },
    spotlight: {
      eyebrow: "معاينة حية تفاعلية من المتصفح",
      title: "اختبر شاشة الأذان ورفيق الأذكار قبل التحميل",
      subtitle:
        "بدّل أوقات السماء، اسمع صوت المؤذن الحقيقي، واضغط على عداد الأذكار كما سيظهر على شاشة القفل.",
      modeAdhan: "وضع الأذان",
      modeAzkar: "رفيق الأذكار",
      skyLabels: {
        fajr: "سماء الفجر",
        dhuhr: "سماء الظهر",
        maghrib: "شفق المغرب",
        isha: "سماء العشاء",
      },
      nowPrayerMap: {
        fajr: "الآن موعد صلاة الفجر • 05:04 ص",
        dhuhr: "الآن موعد صلاة الظهر • 11:51 ص",
        maghrib: "الآن موعد صلاة المغرب • 05:42 م",
        isha: "الآن موعد صلاة العشاء • 07:03 م",
      },
      prayerTitleMap: {
        fajr: "صلاة الفجر",
        dhuhr: "صلاة الظهر",
        maghrib: "صلاة المغرب",
        isha: "صلاة العشاء",
      },
      selectMuezzin: "اختر صوت المؤذن للاستماع:",
      playAdhan: "تشغيل صوت الأذان",
      stopAdhan: "إيقاف الأذان",
      duaaHeader: "دعاء ما بعد الأذان",
      copy: "نسخ",
      copied: "تم النسخ",
      hadithRef: "صحيح البخاري • حديث 614",
      azkarPill: "أذكار الصباح ☀️",
      tapCounter: "اضغط للتسبيح",
      azkarDone: "أتممت بفضل الله ✓",
      resetAzkar: "إعادة التجربة",
    },
    reliability: {
      eyebrow: "الهندسة خلف الكواليس",
      title: "لماذا يعمل الأذان بثبات حتى لو أُغلق التطبيق تماماً؟",
      subtitle:
        "عالجنا أشهر مشكلة في تطبيقات الأذان (انقطاع الصوت أو حظر المنبه من نظام الهاتف) ببنية Native متدرجة:",
      steps: [
        {
          step: "01",
          title: "جدولة AlarmClock الأصلية",
          desc: "تتجاوز وضع السكون العميق (Doze Mode) وتُعيد جدولة 7 أيام تلقائياً بعد إعادة تشغيل الهاتف أو تغيير الساعة.",
        },
        {
          step: "02",
          title: "خدمة صوت معزولة (Foreground Service)",
          desc: "تمسك WakeLock مؤقتاً لـ 4 دقائق مع طلب AudioFocus مخصص للمنبه (USAGE_ALARM) فلا ينقطع الصوت أبداً.",
        },
        {
          step: "03",
          title: "واجهة قفل خفيفة (~12MB)",
          desc: "تُقلع خلال أقل من 50ms مستقلةً عن محرك Flutter، وفي iOS تُجهَّز عبر Time-Sensitive و SwiftUI Content Extension.",
        },
      ],
      oemTitle: "إعداد سريع حسب نوع هاتفك (مرة واحدة فقط):",
      oems: [
        {
          id: "honor",
          name: "Honor / Huawei (MagicOS)",
          steps: [
            "افتح الإعدادات ← التطبيقات ← إدارة بدء التشغيل (App Launch).",
            "عطّل «الإدارة التلقائية» لتطبيق زاد المسلم وفعّل: التشغيل التلقائي + التشغيل الثانوي + العمل في الخلفية.",
            "من داخل التطبيق: الإعدادات ← ضبط الصلاحيات ← اسمح بالظهور على شاشة القفل.",
          ],
        },
        {
          id: "xiaomi",
          name: "Xiaomi / Redmi (HyperOS / MIUI)",
          steps: [
            "اضغط مطولاً على أيقونة التطبيق ← معلومات التطبيق (App Info).",
            "فعّل «التشغيل التلقائي» (Autostart) واضبط موفر البطارية على «بلا قيود» (No Restrictions).",
            "في الأذونات الأخرى، فعّل «الظهور على شاشة القفل» و«عرض النوافذ المنبثقة».",
          ],
        },
        {
          id: "samsung",
          name: "Samsung (OneUI)",
          steps: [
            "افتح معلومات التطبيق ← البطارية ← اختر «غير مقيد» (Unrestricted).",
            "تأكد من عدم إدراج التطبيق ضمن «التطبيقات الخاملة» (Sleeping Apps).",
            "اسمح بصلاحية الإشعارات والمنبهات والتذكيرات (Alarms & Reminders).",
          ],
        },
      ],
      privacyTitle: "دفتر الشفافية والخصوصية (Permissions & Privacy Ledger)",
      fullPrivacyBtn: "سياسة الخصوصية الكاملة",
      privacyItems: [
        {
          perm: "الموقع الجغرافي (GPS)",
          why: "يُستخدم محلياً لحساب مواقيت الصلاة والقبلة والبحث عن المساجد القريبة — ولا يتم إرسال موقعك لأي خادم تتبع.",
        },
        {
          perm: "المنبهات الدقيقة (Exact Alarms)",
          why: "مطلوب فقط لكي يصدح الأذان في الثانية الدقيقة لدخول الوقت دون تأخير من نظام توفير البطارية.",
        },
        {
          perm: "بدون حسابات أو تتبع",
          why: "جميع إعداداتك مخزّنة محلياً على جهازك فقط، وحتى توجيه نسخة الـ APK المناسبة لهاتفك يتم لحظياً دون تخزين بصمة جهازك أو عنوان IP.",
        },
      ],
    },
    timeline: {
      eyebrow: "سجل التطور والإصدارات",
      title: "خط زمني يوثّق رحلة تطوير زاد المسلم",
      subtitle:
        "تابع الميزات الجديدة والتحسينات وإصلاحات الموثوقية في كل نسخة تصدر من التطبيق.",
      fallbackTitle: "الإصدار الحالي من زاد المسلم",
      fallbackSummary:
        "يتضمن الأذان الأصلي فوق شاشة القفل، مواقيت الصلاة الفلكية، المصحف العثماني، الأذكار، وبوصلة القبلة.",
      latestBadge: "الأحدث",
      downloadBtn: "تحميل هذا الإصدار",
      githubBtn: "التفاصيل على GitHub",
      releaseTypes: {
        major: "إصدار رئيسي",
        minor: "تحديث ميزات",
        patch: "تحديث فرعي",
        hotfix: "إصلاح عاجل",
      },
      highlightBadges: {
        fix: "إصلاح",
        improvement: "تحسين",
        feature: "جديد",
      },
    },
    feedbackSection: {
      eyebrow: "نستمع لك باهتمام",
      title: "هل لديك شكوى تقنية أو اقتراح لميزة جديدة؟",
      subtitle:
        "رسالتك تساعدنا في تحسين التطبيق باستمرار لكل مسلم. لا يتطلب الأمر إنشاء حساب؛ اختر التصنيف واكتب ملاحظتك مباشرة.",
      categories: [
        { id: "bug", label: "شكوى أو مشكلة تقنية" },
        { id: "suggestion", label: "اقتراح ميزة جديدة" },
        { id: "adhan_times", label: "ملاحظة حول الأذان أو المواقيت" },
        { id: "other", label: "استفسار عام" },
      ],
      messageLabel: "تفاصيل الشكوى أو الاقتراح",
      messagePlaceholder: "اكتب وصف المشكلة أو الفكرة التي تود إضافتها بوضوح...",
      deviceLabel: "نوع الهاتف (اختياري — مفيد في الأعطال)",
      devicePlaceholder: "مثال: Honor X9b / Samsung A54",
      contactLabel: "وسيلة تواصل للرد (اختياري)",
      contactPlaceholder: "البريد الإلكتروني أو معرف تيليجرام",
      submitBtn: "إرسال الملاحظة",
      submittingBtn: "جاري الإرسال...",
      minCharError: "يرجى كتابة 8 أحرف على الأقل حتى نفهم ملاحظتك بوضوح.",
      networkError: "تعذر الاتصال بالخادم حالياً. يمكنك إرسال رسالتك مباشرة عبر GitHub.",
      successSupabaseTitle: "جزاك الله خيراً! وصلت رسالتك بنجاح",
      successSupabaseDesc: "تم تسجيل ملاحظتك وسنراجعها في لوحة المتابعة للعمل عليها في التحديث القادم.",
      successFallbackTitle: "رسالتك جاهزة للإرسال الفوري",
      successFallbackDesc:
        "بوابة الاستقبال المباشر قيد التوصيل حالياً — يمكنك إرسال هذه الرسالة بضغطة واحدة عبر GitHub Issues حتى تصلنا فوراً.",
      openGithubIssue: "إرسال عبر GitHub Issues",
      sendAnother: "إرسال رسالة أخرى",
    },
    faqSection: {
      eyebrow: "الأسئلة الشائعة",
      title: "إجابات واضحة وشفافة",
      items: [
        {
          q: "هل التطبيق مجاني بالكامل وهل يحتوي على أي إعلانات أو اشتراكات؟",
          a: "التطبيق مجاني 100% وخالٍ تماماً من الإعلانات أو التتبع أو أي خصائص مدفوعة، وموقوف كصدقة جارية.",
        },
        {
          q: "هل يعمل الأذان والهاتف مقفول أو عند إزالة التطبيق من الخلفية؟",
          a: "نعم؛ المحرك الأصلي في أندرويد يستخدم AlarmManager.setAlarmClock وخدمة mediaPlayback مستقلة تضمن تشغيل الأذان كاملاً وإظهار الشاشة فوق القفل.",
        },
        {
          q: "هل يحتاج التطبيق إلى الإنترنت لقراءة القرآن والأذكار وحساب المواقيت؟",
          a: "المصحف الكامل، الأذكار، الأحاديث المضمنة، وحساب المواقيت الفلكية وبوصلة القبلة كلها تعمل دون إنترنت تماماً. الإنترنت مطلوب فقط عند تحميل خرائط المساجد القريبة.",
        },
        {
          q: "ما حال نسخة الآيفون (iOS) الآن؟",
          a: "إصدار GitHub Releases الحالي يوفر ملف APK للأندرويد، كما أن البنية الأصلية للـ iOS (تنبيهات Time-Sensitive وواجهة SwiftUI) مجهزة في المستودع تمهيداً للنشر على App Store.",
        },
        {
          q: "هل تتغير لغة الآيات والأذكار إذا حولت التطبيق إلى الإنجليزية؟",
          a: "تُترجم أزرار الواجهة والتوجيهات إلى الإنجليزية، بينما تظل آيات القرآن الكريم والأذكار والأدعية النبوية دائماً بنصها العربي الأصيل.",
        },
      ],
    },
    downloadSection: {
      badge: "الإصدار الحالي متاح عبر GitHub Releases",
      title: "حمّل تطبيق زاد المسلم الآن",
      subtitle:
        "تثبيت مباشر بصيغة APK لأجهزة Android 8.0 فأعلى، مع اختيار تلقائي لأخف نسخة تناسب معالج جهازك.",
      primaryBtn: "تحميل ملف APK مباشرة",
      allReleases: "تصفح جميع الإصدارات",
      shareBtn: "نسخ رابط المشاركة",
      shareCopied: "تم نسخ الرابط ✓",
      qrLabel: "امسح الرمز بهاتفك للتحميل الفوري",
      downloadsLabel: "تحميل",
      directDownloadFallback: "تحميل مباشر عبر GitHub Releases",
      recommendedArchLabel: "النسخة الأنسب لجهازك تلقائياً",
      universalFallbackBanner:
        "لم نتمكن من تحديد معمارية هاتفك بدقة (أو تتصفح من كمبيوتر)، لذلك تم توجيهك تلقائياً إلى النسخة الشاملة Universal لتعمل على أي جهاز دون مشاكل.",
      matchedBanner:
        "تم التعرّف على معمارية جهازك تلقائياً؛ عند الضغط على زر التحميل سيتم إرسالك مباشرة إلى النسخة الأخف والأنسب لهاتفك.",
      manualOverrideBanner:
        "قمت باختيار هذه النسخة يدوياً بدلاً من الاختيار التلقائي.",
      resetAutoBtn: "العودة للاختيار التلقائي",
      selectedBadge: "المختارة حالياً",
      selectArchTitle: "دليل النسخ المتوفرة — اختر يدوياً إذا كنت تحمّل لهاتف آخر:",
      archLabels: {
        "arm64-v8a": {
          label: "الهواتف الحديثة",
          badge: "الأكثر شيوعاً",
          hint: "معالجات 64-bit • حجم أخف وأسرع",
          audience:
            "تنفع لمعظم هواتف أندرويد الحديثة الصادرة منذ 2017 تقريباً (Samsung و Xiaomi و Honor و Oppo و Realme و Pixel) — حجم أصغر وتثبيت أسرع.",
        },
        "armeabi-v7a": {
          label: "الهواتف الأقدم / 32-bit",
          badge: "أجهزة قديمة",
          hint: "معالجات 32-bit",
          audience:
            "تنفع للهواتف القديمة أو بعض الهواتف الاقتصادية بنظام أندرويد 32-bit (مثل Android Go أو أجهزة ما قبل 2017).",
        },
        x86_64: {
          label: "تابلت ومحاكيات الكمبيوتر",
          badge: "Intel / AMD",
          hint: "معالجات x86_64",
          audience:
            "مخصصة فقط للأجهزة اللوحية بمعالجات Intel/AMD أو محاكيات أندرويد على الكمبيوتر و Chromebook (نادرة في الهواتف).",
        },
        universal: {
          label: "النسخة الشاملة",
          badge: "مضمونة للجميع",
          hint: "تعمل على كل الأجهزة",
          audience:
            "تجمع كل المعالجات في ملف واحد وتعمل على أي هاتف أندرويد بلا استثناء؛ مثالية إذا لم تعرف نوع المعالج أو عند إرسال الملف لشخص آخر.",
        },
      },
    },
    stickyCta: {
      download: "تحميل APK",
      feedback: "شكوى / اقتراح",
    },
    footer: {
      waqf: "«إِذَا مَاتَ الإنْسَانُ انْقَطَعَ عنْه عَمَلُهُ إِلَّا مِن ثَلَاثَةٍ: إِلَّا مِن صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو له» — صحيح مسلم",
      builtWith: "زاد المسلم • Flutter + Native Kotlin/Swift + Next.js • صدقة جارية مفتوحة المصدر",
      privacyLink: "سياسة الخصوصية (التطبيق والموقع)",
    },
} as const;

export type LandingCopySchema = WidenPrimitives<typeof arCopy>;

const enCopy: LandingCopySchema = {
  brand: "Zad Al-Muslim",
  tagline: "Your Daily Sanctuary for Prayer, Dhikr & Quran",
  nav: {
    tour: "App Tour",
    features: "Features",
    lockscreen: "Lockscreen",
    reliability: "Reliability",
    releases: "Releases",
    feedback: "Feedback",
    download: "Download",
    menuLabel: "Open menu",
    closeMenuLabel: "Close menu",
  },
  siteNotice: {
    dismiss: "Dismiss notice",
  },
  hero: {
    waqfBadge: "Sadaqah Jariyah • 100% Free & Ad-Free",
    verse: "﴿ وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَىٰ ﴾",
    verseSource: "Al-Baqarah: 197",
    title: "Your daily worship in a calm, nocturnal, trustworthy sanctuary",
    subtitle:
      "Offline astronomical prayer times, native Adhan playback that completes over the lockscreen, interactive morning & evening Azkar, and the complete Uthmani Quran — zero ads.",
    downloadApk: "Download Android APK",
    releaseFallback: "Download via GitHub Releases",
    minAndroid: "Android 8.0+",
    downloadsLabel: "downloads",
    autoDetectedBuild: "Auto-matched for your device",
    universalFallbackNote: "Universal APK — fits every Android phone",
    whatsNew: "What's New?",
    scanQr: "Scan QR to Download",
    storesSoon: "Google Play & App Store — Coming Soon",
    floatingNextPrayer: "Fajr in 04h 12m",
    floatingLockOk: "Plays over Lockscreen ✓",
    mockup: {
      fajrStatus: "★ Fajr Prayer • 05:04 AM",
      fajrTitle: "Fajr Prayer",
      muezzinName: "Makkah Sanctuary",
      stopAdhan: "Stop Adhan",
      qiblaBtn: "Qibla 🧭",
      openAppBtn: "Open App ↗",
      nativeBadge: "AlarmClock Native",
    },
  },
    releaseModal: {
      title: "Release Changelog",
      versionLabel: "Current Release",
      publishedLabel: "Published",
      emptyNotes:
        "Includes the native Lockscreen Adhan & Azkar Engine, offline astronomical prayer times, complete Uthmani Quran, live Qibla compass, and nearby mosques map.",
      downloadNow: "Download This Release (APK)",
      viewOnGithub: "View on GitHub",
      close: "Close",
    },
    trust: [
      { metric: "100%", label: "Free Waqf Edition", detail: "Purely non-commercial" },
      { metric: "0", label: "Ads or Trackers", detail: "Privacy-first architecture" },
      { metric: "114", label: "Surahs Offline", detail: "Plus local prayer math" },
      { metric: "7 Days", label: "Native Pre-Scheduled", detail: "Android & iOS Native" },
    ],
    appTour: {
      eyebrow: "Inside The App Worlds",
      title: "A cohesive worship flow crafted for focus, not noise",
      subtitle:
        "Explore the nocturnal Sanctuary screens and test live prayer previews across major cities.",
      citySwitcherLabel: "Preview city times:",
      quranDemo: {
        header: "Surah Al-Fatihah • Makkiyah",
        juz: "Juz 1",
        page: "Page 1",
      },
      prayerNames: {
        fajr: "Fajr",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
      },
      mosqueDemo: {
        name: "Al-Fath Mosque",
        distance: "320 m",
        walkTime: "Approx. 4 mins walk",
      },
      hadithDemo: {
        book: "Nawawi 40",
        tasbeehLabel: "Daily Tasbeeh",
      },
      tabs: [
        {
          id: "quran",
          title: "Uthmani Mushaf",
          badge: "Night Reading Comfort",
          headline: "Eye-friendly nocturnal Uthmani pages with instant bookmarking",
          points: [
            "Complete 114 Surahs and 30 Juz index with fast search.",
            "Saved reading bookmarks so you resume right where you paused.",
            "Authentic Arabic Quranic script preserved across every language.",
          ],
        },
        {
          id: "prayers",
          title: "Prayers & Qibla",
          badge: "Live City Switcher",
          headline: "Second-accurate times with tactile Qibla compass alignment",
          points: [
            "Automatic GPS or manual city selection with Hijri calendar sync.",
            "Gentle 5-minute pre-prayer alert to prepare for wudu.",
            "Real-time compass dial with subtle haptic snap toward Makkah.",
          ],
        },
        {
          id: "mosques",
          title: "Nearby Mosques",
          badge: "OpenStreetMap Live",
          headline: "Locate the nearest mosque around you even while traveling",
          points: [
            "Flexible search radius: 500m, 1km, 3km, or 5km.",
            "Estimated walking and driving times to each mosque.",
            "One-tap handoff to turn-by-turn maps navigation.",
          ],
        },
        {
          id: "hadith",
          title: "Hadith & Azkar",
          badge: "Verified Sources",
          headline: "Authentic Hadith collections and smart tactile Tasbeeh",
          points: [
            "Built-in Bukhari, Muslim, Nawawi 40, and Riyad Al-Salihin.",
            "Smart Tasbeeh counter with milestone haptics at 33 and 100.",
            "Clear scholarly citations and virtues on every dhikr card.",
          ],
        },
      ],
    },
    featuresSection: {
      eyebrow: "Craft & Architecture",
      title: "Thoughtful engineering behind every daily moment",
      subtitle:
        "Designed under strict zero-clutter standards combining fast native response with quiet typographic clarity.",
      cards: [
        {
          id: "native",
          featured: true,
          badge: "Full Lockscreen Reliability",
          title: "Independent Native Adhan Sanctuary that never cuts off mid-call",
          desc: "Audio never stops after 2 seconds. Android uses AlarmClock scheduling and a dedicated mediaPlayback Foreground Service decoupled from Flutter to play Makkah, Abdulbasit, or Al-Afasy cleanly.",
        },
        {
          id: "quran",
          featured: false,
          badge: "114 Surahs Offline",
          title: "Holy Quran in Uthmani Script",
          desc: "Readable Amiri typography tailored for sustained nocturnal recitation.",
        },
        {
          id: "azkar",
          featured: false,
          badge: "Two-Way Sync",
          title: "Lockscreen Azkar Companion",
          desc: "Complete Morning/Evening Azkar on lockscreen and sync straight into the app.",
        },
        {
          id: "prayers",
          featured: false,
          badge: "Local Calculations",
          title: "Prayer Times & Hijri Calendar",
          desc: "High astronomical precision with zero background data drain.",
        },
        {
          id: "qibla",
          featured: false,
          badge: "Live Sensors",
          title: "Qibla Compass Alignment",
          desc: "Smooth magnetometer dial with physical haptic feedback at alignment.",
        },
        {
          id: "mosques",
          featured: false,
          badge: "Ad-Free Waqf",
          title: "Mosques Map & Hadith Library",
          desc: "Clean OSM nearby mosque finder alongside authentic Prophetic books.",
        },
      ],
    },
    spotlight: {
      eyebrow: "Interactive Browser Preview",
      title: "Experience the Lockscreen Adhan & Azkar UI live",
      subtitle:
        "Switch prayer sky atmospheres, play real Muezzin previews, and tap the Azkar counter ring right in your browser.",
      modeAdhan: "Adhan Mode",
      modeAzkar: "Azkar Companion",
      skyLabels: {
        fajr: "Fajr Dawn",
        dhuhr: "Dhuhr Emerald",
        maghrib: "Maghrib Dusk",
        isha: "Isha Night",
      },
      nowPrayerMap: {
        fajr: "Now Time for Fajr Prayer • 05:04 AM",
        dhuhr: "Now Time for Dhuhr Prayer • 11:51 AM",
        maghrib: "Now Time for Maghrib Prayer • 05:42 PM",
        isha: "Now Time for Isha Prayer • 07:03 PM",
      },
      prayerTitleMap: {
        fajr: "Fajr Prayer",
        dhuhr: "Dhuhr Prayer",
        maghrib: "Maghrib Prayer",
        isha: "Isha Prayer",
      },
      selectMuezzin: "Choose Muezzin to preview:",
      playAdhan: "Play Adhan Preview",
      stopAdhan: "Stop Adhan",
      duaaHeader: "Supplication After Adhan",
      copy: "Copy",
      copied: "Copied",
      hadithRef: "Sahih Al-Bukhari • Hadith 614",
      azkarPill: "Morning Azkar ☀️",
      tapCounter: "Tap Dhikr",
      azkarDone: "Completed Alhamdulillah ✓",
      resetAzkar: "Reset Preview",
    },
    reliability: {
      eyebrow: "Under The Hood",
      title: "Why Adhan sounds reliably even when killed or locked",
      subtitle:
        "We eliminated the classic Flutter audio-focus conflict using a three-stage native pipeline:",
      steps: [
        {
          step: "01",
          title: "Native AlarmClock Scheduling",
          desc: "Bypasses Android Doze restrictions and auto-restores 7 days of alarms after device reboots or timezone shifts.",
        },
        {
          step: "02",
          title: "Isolated MediaPlayback Service",
          desc: "Holds a bounded 4-minute WakeLock with USAGE_ALARM audio focus so nothing cuts off the Adhan midway.",
        },
        {
          step: "03",
          title: "Lightweight Lockscreen UI (~12MB)",
          desc: "Boots in under 50ms independently from Flutter; prepared on iOS via Time-Sensitive Alerts & SwiftUI Extension.",
        },
      ],
      oemTitle: "One-time device checklist by manufacturer:",
      oems: [
        {
          id: "honor",
          name: "Honor / Huawei (MagicOS)",
          steps: [
            "Open Settings → Apps → App Launch.",
            "Disable automatic management for Zad Al-Muslim and enable Auto-launch, Secondary launch & Run in background.",
            "In App Settings → Fix Settings, enable Lockscreen display permission.",
          ],
        },
        {
          id: "xiaomi",
          name: "Xiaomi / Redmi (HyperOS)",
          steps: [
            "Long-press the app icon → App Info.",
            "Enable Autostart and set Battery Saver to No Restrictions.",
            "In Other Permissions, enable Show on Lock screen and Display pop-up windows.",
          ],
        },
        {
          id: "samsung",
          name: "Samsung (OneUI)",
          steps: [
            "Open App Info → Battery → select Unrestricted.",
            "Ensure Zad Al-Muslim is excluded from Sleeping or Deep Sleeping apps.",
            "Verify Notifications and Alarms & Reminders permissions remain allowed.",
          ],
        },
      ],
      privacyTitle: "Permissions & Privacy Ledger",
      fullPrivacyBtn: "Full Privacy Policy",
      privacyItems: [
        {
          perm: "Location Access (GPS)",
          why: "Used purely on-device for astronomical prayer calculations, Qibla bearing, and nearby mosque search — never transmitted to tracking servers.",
        },
        {
          perm: "Exact Alarms Permission",
          why: "Required solely so the Adhan triggers at the exact second without OEM battery-saver delays.",
        },
        {
          perm: "Zero Accounts or Trackers",
          why: "All settings live privately on your device, and even device-matched APK routing runs ephemerally without storing device fingerprints or IP addresses.",
        },
      ],
    },
    timeline: {
      eyebrow: "Release Timeline",
      title: "A living timeline of every Zad Al-Muslim release",
      subtitle:
        "Follow new features, refinements, and reliability improvements shipped in each version.",
      fallbackTitle: "Current Release of Zad Al-Muslim",
      fallbackSummary:
        "Includes native lockscreen Adhan & Azkar, astronomical prayer times, Uthmani Quran, and Qibla compass.",
      latestBadge: "Latest",
      downloadBtn: "Download Build",
      githubBtn: "View on GitHub",
      releaseTypes: {
        major: "Major",
        minor: "Minor",
        patch: "Patch",
        hotfix: "Hotfix",
      },
      highlightBadges: {
        fix: "Fix",
        improvement: "Improved",
        feature: "New",
      },
    },
    feedbackSection: {
      eyebrow: "We Listen Carefully",
      title: "Have a complaint, bug report, or feature idea?",
      subtitle:
        "Your feedback directly shapes the next update of Zad Al-Muslim. No account required—pick a category and write directly.",
      categories: [
        { id: "bug", label: "Bug / Complaint" },
        { id: "suggestion", label: "Feature Idea" },
        { id: "adhan_times", label: "Adhan / Times" },
        { id: "other", label: "General Inquiry" },
      ],
      messageLabel: "Your message",
      messagePlaceholder: "Describe the issue or feature idea you would like to share...",
      deviceLabel: "Phone Model (Optional — helps reproduce bugs)",
      devicePlaceholder: "e.g., Honor X9b / Samsung A54",
      contactLabel: "Contact for reply (Optional)",
      contactPlaceholder: "Email or Telegram handle",
      submitBtn: "Send Feedback",
      submittingBtn: "Sending...",
      minCharError: "Please enter at least 8 characters so we can clearly understand your note.",
      networkError: "Unable to reach the server right now. You can send it directly via GitHub.",
      successSupabaseTitle: "JazakAllahu Khayran! Feedback received",
      successSupabaseDesc: "Your note has been logged and will be reviewed for upcoming releases.",
      successFallbackTitle: "Your feedback is formatted and ready",
      successFallbackDesc:
        "Direct database storage is pending connection—you can submit this exact note in one click via GitHub Issues so it reaches us immediately.",
      openGithubIssue: "Submit via GitHub Issues",
      sendAnother: "Send another message",
    },
    faqSection: {
      eyebrow: "Questions & Answers",
      title: "Clear answers before you install",
      items: [
        {
          q: "Is Zad Al-Muslim completely free with zero ads or tracking?",
          a: "Yes. It is 100% free, ad-free, and tracker-free, built as an open-source ongoing charity (Sadaqah Jariyah).",
        },
        {
          q: "Does the Adhan ring when the phone is locked or app closed?",
          a: "Yes. On Android it schedules AlarmClock triggers and plays audio from an isolated native mediaPlayback service with full lockscreen support.",
        },
        {
          q: "Can I use Quran, Azkar, Qibla, and Prayer Times offline?",
          a: "Yes. Every core worship feature works offline. Internet is only required for loading live nearby mosque map tiles.",
        },
        {
          q: "What about the iOS / App Store version?",
          a: "Current GitHub Releases distribute the Android APK directly, while native SwiftUI Lockscreen extensions and Time-Sensitive notifications are implemented for upcoming macOS/iOS builds.",
        },
        {
          q: "Do Quran verses and Azkar stay in Arabic in English mode?",
          a: "Always. All UI labels adapt to English while sacred Quranic and Prophetic texts remain in their authentic Arabic script.",
        },
      ],
    },
    downloadSection: {
      badge: "Latest Build Hosted on GitHub Releases",
      title: "Download Zad Al-Muslim Now",
      subtitle:
        "Install the direct APK on Android 8.0+ — automatically matched to your device processor for a lighter download.",
      primaryBtn: "Download Latest APK",
      allReleases: "All Releases",
      shareBtn: "Copy Share Link",
      shareCopied: "Link Copied ✓",
      qrLabel: "Scan with your phone camera",
      downloadsLabel: "downloads",
      directDownloadFallback: "GitHub Releases • APK",
      recommendedArchLabel: "Auto-matched for your device",
      universalFallbackBanner:
        "Could not verify a specific Android CPU architecture (or browsing from desktop), so we automatically selected the Universal APK — guaranteed to work on every Android device.",
      matchedBanner:
        "Your device architecture was detected automatically — clicking Download will take you directly to the lightest matching APK.",
      manualOverrideBanner:
        "You manually selected this build instead of automatic device matching.",
      resetAutoBtn: "Use auto-detected build",
      selectedBadge: "Active",
      selectArchTitle: "Available Builds Guide — pick manually if downloading for another device:",
      archLabels: {
        "arm64-v8a": {
          label: "Modern Phones",
          badge: "Most Common",
          hint: "64-bit ARM • Lighter & faster",
          audience:
            "Best for almost all modern Android phones since ~2017 (Samsung, Xiaomi, Honor, Oppo, Realme, Pixel) — smaller download size.",
        },
        "armeabi-v7a": {
          label: "Older / 32-bit Phones",
          badge: "Legacy Hardware",
          hint: "32-bit ARM",
          audience:
            "Built for older Android devices or budget 32-bit phones (Android Go or pre-2017 hardware).",
        },
        x86_64: {
          label: "Tablets & Emulators",
          badge: "Intel / AMD",
          hint: "x86_64 CPU",
          audience:
            "Strictly for Intel/AMD Android tablets, Chromebooks, or PC Android emulators (rare on smartphones).",
        },
        universal: {
          label: "Universal Build",
          badge: "Guaranteed Fit",
          hint: "Works on every device",
          audience:
            "Bundles every CPU type into one APK so it installs on any Android phone; ideal if unsure of processor type or sharing with others.",
        },
      },
    },
    stickyCta: {
      download: "Download APK",
      feedback: "Feedback",
    },
    footer: {
      waqf: "«When a person dies, their deeds end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for them» — Sahih Muslim",
      builtWith: "Zad Al-Muslim • Flutter + Native Kotlin/Swift + Next.js • Open-Source Waqf",
      privacyLink: "Privacy Policy (App & Web)",
    },
};

export const landingCopy: Record<Locale, LandingCopySchema> = {
  ar: arCopy,
  en: enCopy,
};
