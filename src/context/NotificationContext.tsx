import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';
import type { AppNotification } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const role = user?.role ?? 'farmer';
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    notificationService.getForRole(role)
  );

  useEffect(() => {
    setNotifications(notificationService.getForRole(role));
  }, [role]);

  const markAsRead = useCallback(
    (id: string) => {
      setNotifications(notificationService.markAsRead(id, role));
    },
    [role]
  );

  const markAllAsRead = useCallback(() => {
    setNotifications(notificationService.markAllAsRead(role));
  }, [role]);

  const clearNotifications = useCallback(() => {
    setNotifications(notificationService.clearForRole(role));
  }, [role]);

  const addNotification = useCallback(
    (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
      const next = notificationService.addNotification(notif);
      if (notif.role === role) {
        setNotifications(next);
      }
    },
    [role]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
