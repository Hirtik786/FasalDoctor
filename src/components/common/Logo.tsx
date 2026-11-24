import React from 'react';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface LogoProps {
  to?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  to = '/',
  size = 'md',
  showTagline = false,
}) => {
  const { t } = useLanguage();
  const iconBox =
    size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-11 w-11' : 'h-9 w-9';
  const textSize =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';

  return (
    <Link to={to} className="inline-flex items-center gap-2.5 group focus:outline-none">
      <div
        className={`${iconBox} flex items-center justify-center rounded-xl bg-[#166534] text-white shadow-sm transition-transform group-hover:scale-105`}
      >
        <Leaf className="h-5 w-5 text-[#84CC16]" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className={`${textSize} font-bold tracking-tight text-[#17251B]`}>
          {t('brand')}
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium text-[#64748B]">
            {t('tagline')}
          </span>
        )}
      </div>
    </Link>
  );
};
