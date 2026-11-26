import { Locale } from "./landing-content";

export interface PrivacyCardItem {
  title: string;
  badge: string;
  points: string[];
}

export interface PrivacyCopy {
  headerSubtitle: string;
  backHome: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  badges: string[];
  quickNavApp: string;
  quickNavWeb: string;
  quickNavRights: string;
  appSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: PrivacyCardItem[];
  };
  webSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: PrivacyCardItem[];
  };
  rightsSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; desc: string }[];
    feedbackCta: string;
    githubCta: string;
  };
}

export const privacyCopy: Record<Locale, PrivacyCopy> = {
  ar: {
    headerSubtitle: "سياسة الخصوصية",
    backHome: "العودة للصفحة الرئيسية",
    eyebrow: "الشفافية الكاملة • التطبيق والموقع",
    title: "سياسة الخصوصية لزاد المسلم",
    subtitle:
      "بُنيت منظومة زاد المسلم كصدقة جارية مفتوحة المصدر؛ نلتزم فيها بحماية خصوصيتك دون إعلانات أو بيع للبيانات، سواء داخل تطبيق الهاتف أو على موقعه الرسمي.",
    lastUpdated: "آخر تحديث: نوفمبر 2026",
    badges: [
      "0 إعلانات تجارية",
      "0 حزم تتبع سلوكي",
      "بيانات التطبيق على جهازك فقط",
    ],
    quickNavApp: "خصوصية تطبيق الهاتف (App)",
    quickNavWeb: "خصوصية الموقع الرسمي (Web)",
    quickNavRights: "حقوقك والتواصل",
    appSection: {
      eyebrow: "أولاً: تطبيق الموبايل (Android / iOS)",
      title: "تطبيق يعمل على جهازك بدون حسابات أو تتبع",
      subtitle:
        "لا يطلب التطبيق تسجيل دخول أو بريد إلكتروني، وتبقى جميع بيانات عبادتك وإعداداتك محفوظة محلياً داخل هاتفك فقط.",
      cards: [
        {
          title: "التخزين المحلي للعبادات",
          badge: "محلي 100%",
          points: [
            "علامات التوقف في المصحف الشريف، تقدم الأذكار اليومية، عداد السبحة، وإعدادات المظهر والمؤذن تُحفظ على ذاكرة هاتفك فقط.",
            "لا تُرفع هذه البيانات إلى أي خادم خارجي ولا يمكننا الاطلاع عليها أو جمعها.",
            "بمجرد حذف التطبيق من جهازك، تُمسح بياناته المحلية بالكامل.",
          ],
        },
        {
          title: "صلاحية الموقع الجغرافي (GPS)",
          badge: "عند الطلب فقط",
          points: [
            "تُستخدم الإحداثيات محلياً داخل الهاتف لحساب مواقيت الصلاة الفلكية بدقة وتحديد زاوية القبلة، بدون إرسالها لخوادم تتبّع.",
            "عند استخدامك شاشة «المساجد القريبة» فقط، يرسل التطبيق نطاق البحث الجغرافي إلى خرائط OpenStreetMap / Overpass لجلب المساجد المحيطة.",
            "يمكنك الاستغناء تماماً عن GPS في أي وقت عبر اختيار المدينة يدوياً داخل التطبيق.",
          ],
        },
        {
          title: "الأذان والمنبهات الدقيقة وشاشة القفل",
          badge: "موثوقية الأذان",
          points: [
            "صلاحية المنبهات الدقيقة (Exact Alarms) والعمل فوق شاشة القفل تُستخدم حصراً لرفع الأذان في وقته المحدد دون تأخير من نظام توفير البطارية.",
            "لا يستخدم التطبيق الميكروفون، الكاميرا، جهات الاتصال، أو ملفاتك الخاصة.",
          ],
        },
        {
          title: "خلوّ التطبيق من الإعلانات والتحليلات",
          badge: "Zero Trackers",
          points: [
            "التطبيق خالٍ تماماً من شبكات الإعلانات (Ad SDKs) ومكتبات التتبع التسويقي أو التربح من بيانات المستخدمين.",
            "يمكنك مراجعة الكود المصدري المفتوح للتطبيق عبر مستودع GitHub الرسمي للتأكد من كل صلاحية.",
          ],
        },
      ],
    },
    webSection: {
      eyebrow: "ثانياً: الموقع الرسمي (Web & Landing Page)",
      title: "شفافية تامة عند التصفح أو التحميل أو إرسال الملاحظات",
      subtitle:
        "تم تصميم الصفحة التعريفية بنفس مبدأ الخصوصية، مع توضيح البيانات المحدودة التي تعالجها خدمات الويب لتشغيل العدّاد واستقبال بلاغاتك.",
      cards: [
        {
          title: "التصفح وغياب التتبع الإعلاني",
          badge: "بدون تتبع",
          points: [
            "لا يعرض الموقع أي إعلانات ولا يستخدم أدوات تتبع إعلانية أو تحليلات طرف ثالث تراقب نشاطك بين المواقع.",
            "أصوات المؤذنين ومعاينات شاشة القفل وعداد الأذكار تعمل محلياً بالكامل داخل متصفحك.",
          ],
        },
        {
          title: "توجيه نسخة الجهاز وعدّاد التحميلات (/api/download)",
          badge: "توجيه ذكي بلا تتبع",
          points: [
            "عند ضغطك على زر تحميل APK أو مسح رمز QR، يفحص المتصفح والخادم لحظياً نوع النظام ومعمارية المعالج فقط (عبر تلميحات المتصفح Client Hints مثل Sec-CH-UA-Arch و Sec-CH-UA-Bitness أو User-Agent) لتوجيهك تلقائياً إلى النسخة الأنسب والأخف حجماً لهاتفك (arm64-v8a أو armeabi-v7a أو x86_64 أو النسخة الشاملة universal).",
            "تُعالج إشارات المعمارية لحظياً في الذاكرة أثناء التحويل فقط ولا تُحفظ أبداً؛ بل يقتصر السجل الإحصائي المجهول في قاعدة البيانات على: رقم الإصدار، اسم ملف APK المُحمّل، موضع الزر، ولغة العرض، كما يمكنك دائماً اختيار أي معمارية يدوياً من قسم التحميل.",
            "لا نقوم بتخزين عنوان الـ IP الخاص بك، ولا نص User-Agent الكامل، ولا بصمة جهازك، ولا نزرع ملفات تعريف ارتباط (Cookies) لتتبّع الزوار.",
          ],
        },
        {
          title: "نموذج الشكاوى والاقتراحات (/api/feedback)",
          badge: "بيانات طوعية",
          points: [
            "عند إرسال بلاغ أو اقتراح، تُحفظ الرسالة والتصنيف واللغة (ونوع الجهاز أو وسيلة التواصل إن كتبتها اختيارياً) في قاعدة بيانات المشروع على Supabase.",
            "تُستخدم هذه البيانات حصراً لفهم الأعطال وحلها أو للرد عليك عند ترك وسيلة تواصل، ولا تُباع أو تُشارك مع أطراف خارجية.",
            "إذا اخترت الإرسال عبر رابط GitHub Issues، تخضع الملاحظة لسياسة GitHub العامة لأنها تُنشر كـ Issue في المستودع.",
          ],
        },
        {
          title: "التواصل مع GitHub ولوحة الإدارة",
          badge: "الخدمات التقنية",
          points: [
            "روابط تحميل ملفات APK تُوجّه مباشرة إلى GitHub Releases الرسمية للمستودع وتخضع للسياسة التقنية لخوادم GitHub أثناء التنزيل.",
            "تُستخدم كوكيز المصادقة عبر Supabase Auth داخل مسار الإدارة (/admin) فقط لمشرفي الموقع ولا تُنشأ لزوار الصفحة العاديين.",
          ],
        },
      ],
    },
    rightsSection: {
      eyebrow: "حقوقك والتواصل",
      title: "التحكم الكامل في بياناتك وطلب الحذف",
      subtitle:
        "رغم أننا لا نجمع حسابات أو بيانات شخصية تلقائياً، نكفل لك حق حذف أي ملاحظة أو وسيلة تواصل أرسلتها سابقاً عبر نموذج الشكاوى.",
      items: [
        {
          title: "إلغاء صلاحيات الهاتف في أي وقت",
          desc: "يمكنك إيقاف صلاحية الموقع أو المنبهات من إعدادات أندرويد في أي وقت، مع استمرار عمل القرآن والأذكار والمواقيت اليدوية.",
        },
        {
          title: "طلب حذف بلاغ أو وسيلة تواصل",
          desc: "إذا أرسلت بريدك أو معرف تيليجرام داخل نموذج الشكاوى وتريد حذفه من قاعدة البيانات، راسلنا عبر النموذج أو افتح طلباً في GitHub وسنحذفه فوراً.",
        },
        {
          title: "تحديثات هذه السياسة",
          desc: "عند إضافة أي ميزة جديدة تؤثر على الخصوصية، سيتم تحديث هذه الصفحة وتوثيق التغيير في سجل الإصدارات.",
        },
      ],
      feedbackCta: "تواصل معنا عبر نموذج الملاحظات",
      githubCta: "مراجعة الكود على GitHub",
    },
  },
  en: {
    headerSubtitle: "Privacy Policy",
    backHome: "Back to Home",
    eyebrow: "Full Transparency • App & Web",
    title: "Zad Al-Muslim Privacy Policy",
    subtitle:
      "Zad Al-Muslim is built as an open-source ongoing charity (Sadaqah Jariyah). We are committed to protecting your privacy with zero ads and zero commercial tracking across both the mobile app and this official website.",
    lastUpdated: "Last updated: November 2026",
    badges: [
      "Zero Ads",
      "Zero Behavioral Trackers",
      "App Data Stays On Device",
    ],
    quickNavApp: "Mobile App Privacy",
    quickNavWeb: "Official Website Privacy",
    quickNavRights: "Your Rights & Contact",
    appSection: {
      eyebrow: "Part 1: Mobile App (Android / iOS)",
      title: "Runs locally on your device with no accounts or tracking",
      subtitle:
        "The app does not require registration or email sign-in. All worship progress and preferences remain stored locally on your device.",
      cards: [
        {
          title: "Local-First Worship Storage",
          badge: "100% On-Device",
          points: [
            "Quran reading bookmarks, daily Azkar progress, Tasbih counts, and Muezzin preferences are stored locally on your device only.",
            "This data is never uploaded to external tracking servers and cannot be accessed by us.",
            "Uninstalling the app removes all locally stored app data from your device.",
          ],
        },
        {
          title: "Location Permission (GPS)",
          badge: "On-Demand Only",
          points: [
            "Coordinates are processed locally on-device for astronomical prayer time calculations and Qibla direction, without sending your location history to tracking servers.",
            "Only when you explicitly open the Nearby Mosques map does the app query OpenStreetMap / Overpass tiles for nearby mosques.",
            "You can skip GPS entirely and choose your city manually inside the app.",
          ],
        },
        {
          title: "Exact Alarms & Lockscreen Adhan",
          badge: "Adhan Reliability",
          points: [
            "Exact Alarms and lockscreen display permissions are used strictly to ring the Adhan on time even under battery optimization.",
            "The app never accesses your microphone, camera, contacts, or personal files.",
          ],
        },
        {
          title: "Zero Ads & Zero Analytics SDKs",
          badge: "Zero Trackers",
          points: [
            "The app contains no advertising networks, behavioral analytics SDKs, or user profiling tools.",
            "The source code is openly auditable in our public GitHub repository.",
          ],
        },
      ],
    },
    webSection: {
      eyebrow: "Part 2: Official Website (Web & Landing Page)",
      title: "Clear disclosure for browsing, APK downloads, and feedback",
      subtitle:
        "The official website follows the same privacy-first ethos, explaining the minimal technical records processed for download counts and feedback submissions.",
      cards: [
        {
          title: "No Advertising or Cross-Site Trackers",
          badge: "Tracker-Free",
          points: [
            "The website displays no ads and includes no third-party advertising pixels or behavioral tracking scripts.",
            "Interactive Muezzin audio previews and the Azkar preview counter run entirely in your browser.",
          ],
        },
        {
          title: "Device-Matched Routing & Download Counter (/api/download)",
          badge: "Smart Privacy-First Routing",
          points: [
            "When you click Download or scan a QR code, your browser and our server ephemerally inspect only your OS and CPU architecture (via standard Client Hints like Sec-CH-UA-Arch / Sec-CH-UA-Bitness or User-Agent) to route you to the lightest compatible APK (arm64-v8a, armeabi-v7a, x86_64, or universal).",
            "Architecture signals are evaluated solely in memory during the redirect and are never persisted; our anonymous download counter logs only the release version, chosen APK filename, button placement, and display locale. You can also select any build manually in the Download section.",
            "We never store your IP address, raw User-Agent string, or device fingerprint, and we never set visitor tracking cookies.",
          ],
        },
        {
          title: "Feedback & Bug Reports (/api/feedback)",
          badge: "Voluntary Input",
          points: [
            "If you submit feedback, your message, category, locale, and optional device/contact fields are stored in our Supabase database solely to fix issues and respond if requested.",
            "We never sell or share feedback submissions with advertisers or third parties.",
            "If you choose to submit via GitHub Issues instead, that submission is governed by GitHub's public issue visibility and policies.",
          ],
        },
        {
          title: "GitHub Releases & Admin Session Cookies",
          badge: "Technical Infrastructure",
          points: [
            "APK downloads redirect directly to official GitHub Releases assets and are subject to GitHub's standard CDN delivery policies.",
            "Authentication session cookies via Supabase Auth are used strictly within /admin for authorized maintainers and are never set for regular site visitors.",
          ],
        },
      ],
    },
    rightsSection: {
      eyebrow: "Your Rights & Contact",
      title: "Full control over your permissions and submitted notes",
      subtitle:
        "While we do not create user accounts or collect personal profiles, you have the right to request deletion of any optional contact info or feedback note you submitted.",
      items: [
        {
          title: "Revoke Device Permissions Anytime",
          desc: "You may disable Location or Exact Alarms in system settings at any time while continuing to use Quran, Azkar, and manual city prayer times.",
        },
        {
          title: "Request Removal of Feedback Contact Info",
          desc: "If you shared an email or handle in a feedback submission and want it deleted, contact us via the feedback form or open a request on GitHub.",
        },
        {
          title: "Policy Updates",
          desc: "Any material changes to how the app or website handles data will be clearly reflected on this page with an updated revision date.",
        },
      ],
      feedbackCta: "Reach us via Feedback Form",
      githubCta: "Inspect Source on GitHub",
    },
  },
};
