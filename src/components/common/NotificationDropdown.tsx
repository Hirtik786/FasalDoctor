import React, { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, CloudRain, Leaf, MessageSquare, Stethoscope, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import type { AppNotification } from '../../types';
import { formatDateTime } from '../../utils/formatters';

export const NotificationDropdown: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } =
    useNotifications();
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const iconFor = (type: AppNotification['type']) => {
    switch (type) {
      case 'scan':
        return <Leaf className="h-4 w-4 text-[#166534]" />;
      case 'expert':
        return <Stethoscope className="h-4 w-4 text-[#166534]" />;
      case 'weather':
        return <CloudRain className="h-4 w-4 text-[#F59E0B]" />;
      default:
        return <MessageSquare className="h-4 w-4 text-[#166534]" />;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#17251B] hover:bg-slate-50 transition-colors"
        aria-label={t('notifications')}
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 z-40 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#17251B]">{t('notifications')}</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-[#166534]">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#166534] hover:bg-emerald-50"
                    title={t('markAllRead')}
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t('markAllRead')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={clearNotifications}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#64748B] hover:bg-slate-100 hover:text-[#DC2626]"
                    title={t('clearAll')}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-[#64748B]">
                {t('noNotifications')}
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    markAsRead(n.id);
                    setOpen(false);
                    navigate(n.link);
                  }}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-start transition-colors hover:bg-slate-50 ${
                    n.read ? 'bg-white' : 'bg-emerald-50/40'
                  }`}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                    {iconFor(n.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs font-semibold text-[#17251B]">
                        {n.title[language]}
                      </p>
                      {!n.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#22C55E]" />
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[#64748B]">
                      {n.message[language]}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {formatDateTime(n.timestamp, language)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
