import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-xs"
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
          language === 'en'
            ? 'bg-[#166534] text-white'
            : 'text-[#64748B] hover:text-[#17251B]'
        }`}
      >
        {!compact && <Languages className="h-3.5 w-3.5" />}
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('ur')}
        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
          language === 'ur'
            ? 'bg-[#166534] text-white'
            : 'text-[#64748B] hover:text-[#17251B]'
        }`}
      >
        اردو
      </button>
    </div>
  );
};
