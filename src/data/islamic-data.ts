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
