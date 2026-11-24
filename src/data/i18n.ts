import type { Language } from '../types';

export const translations = {
  en: {
    brand: 'FasalDoctor',
    tagline: 'AI Melon Crop Advisory',
    // Public Navbar
    navHome: 'Home',
    navHowItWorks: 'How It Works',
    navDiseaseDetection: 'AI Disease Detection',
    navWeatherAdvisory: 'Weather Advisory',
    navExpertConsultation: 'Expert Consultation',
    navAbout: 'About',
    navLogin: 'Login',
    navGetStarted: 'Get Started',
    // Farmer Sidebar
    sideOverview: 'Overview',
    sideDiseaseDetection: 'Disease Detection',
    sideScanHistory: 'My Scan History',
    sideWeatherAdvisory: 'Weather Advisory',
    sideAskAssistant: 'Ask FasalDoctor',
    sideExpertConsultation: 'Expert Consultation',
    sideSupportRequests: 'My Support Requests',
    sideKnowledgeCenter: 'Knowledge Center',
    sideProfile: 'Profile',
    sideSettings: 'Settings',
    sideLogout: 'Logout',
    // Expert Sidebar
    expOverview: 'Overview',
    expRequests: 'Consultation Requests',
    expAssigned: 'My Assigned Cases',
    expRespond: 'Respond to Farmers',
    expHistory: 'Farmer History',
    // Common
    demoBadge: 'Demo Mode (Mock Data Active)',
    languageEnglish: 'English',
    languageUrdu: 'اردو (Urdu)',
    searchPlaceholder: 'Search scans, guides, requests...',
    notifications: 'Notifications',
    markAllRead: 'Mark all read',
    clearAll: 'Clear all',
    noNotifications: 'No notifications right now',
    viewDetails: 'View Details',
    analyzeImage: 'Analyze Image',
    clearImage: 'Clear Image',
    scanAnotherLeaf: 'Scan Another Leaf',
    askAnExpert: 'Ask an Expert',
    saveToHistory: 'Save to History',
    downloadReport: 'Download Report',
  },
  ur: {
    brand: 'فصل ڈاکٹر',
    tagline: 'خربوزے کی فصل کا ذہین مشیر',
    // Public Navbar
    navHome: 'ہوم',
    navHowItWorks: 'طریقہ کار',
    navDiseaseDetection: 'AI بیماری کی تشخیص',
    navWeatherAdvisory: 'موسمی مشورہ',
    navExpertConsultation: 'ماہرین سے مشاورت',
    navAbout: 'تعارف',
    navLogin: 'لاگ ان',
    navGetStarted: 'شروع کریں',
    // Farmer Sidebar
    sideOverview: 'جائزہ (ڈیش بورڈ)',
    sideDiseaseDetection: 'بیماری کی تشخیص',
    sideScanHistory: 'اسکین ہسٹری',
    sideWeatherAdvisory: 'موسمی مشورہ',
    sideAskAssistant: 'فصل ڈاکٹر سے پوچھیں',
    sideExpertConsultation: 'ماہرین سے مشاورت',
    sideSupportRequests: 'میری درخواستیں',
    sideKnowledgeCenter: 'معلوماتی مرکز',
    sideProfile: 'پروفائل',
    sideSettings: 'ترتیبات',
    sideLogout: 'لاگ آؤٹ',
    // Expert Sidebar
    expOverview: 'جائزہ',
    expRequests: 'مشاورت کی درخواستیں',
    expAssigned: 'میرے تفویض کردہ کیسز',
    expRespond: 'کاشتکاروں کو جواب دیں',
    expHistory: 'کاشتکار ریکارڈ',
    // Common
    demoBadge: 'ڈیمو موڈ (فرضی ڈیٹا فعال)',
    languageEnglish: 'English',
    languageUrdu: 'اردو (Urdu)',
    searchPlaceholder: 'اسکین، مضامین یا درخواستیں تلاش کریں...',
    notifications: 'اطلاعات',
    markAllRead: 'سب پڑھا ہوا نشان لگائیں',
    clearAll: 'سب صاف کریں',
    noNotifications: 'فی الحال کوئی اطلاع نہیں ہے',
    viewDetails: 'تفصیل دیکھیں',
    analyzeImage: 'تصویر کا تجزیہ کریں',
    clearImage: 'تصویر ہٹائیں',
    scanAnotherLeaf: 'ایک اور پتا اسکین کریں',
    askAnExpert: 'ماہر سے پوچھیں',
    saveToHistory: 'ہسٹری میں محفوظ کریں',
    downloadReport: 'رپورٹ ڈاؤن لوڈ کریں',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key] ?? translations.en[key];
}
