import React from 'react';
import { Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface DemoBannerProps {
  text?: string;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ text }) => {
  const { language } = useLanguage();
  const defaultText =
    language === 'ur'
      ? 'ڈیمو موڈ فعال ہے: AI پیش گوئیاں، موسمی مشورہ اور ماہرین کی معلومات نمائشی ڈیٹا پر مبنی ہیں۔ حتمی تشخیص کے لیے تصدیق شدہ زرعی ذرائع سے رجوع کریں۔'
      : 'Demonstration Mode: AI predictions, weather advisories, speech transcription, and expert profiles use simulated mock data until the FastAPI backend is connected.';

  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3.5 py-2.5 text-xs text-[#166534]">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#166534]" />
      <p className="leading-relaxed">{text ?? defaultText}</p>
    </div>
  );
};
