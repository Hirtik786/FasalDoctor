import { initialMockNotifications } from '../data/mockNotifications';
import type { AppNotification, UserRole } from '../types';

const NOTIF_KEY = 'fd_notifications_v1';

function loadAll(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (!raw) {
      localStorage.setItem(NOTIF_KEY, JSON.stringify(initialMockNotifications));
      return initialMockNotifications;
    }
    return JSON.parse(raw) as AppNotification[];
  } catch {
    return initialMockNotifications;
  }
}

function saveAll(items: AppNotification[]): void {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(items));
}

export const notificationService = {
  getForRole(role: UserRole): AppNotification[] {
    return loadAll().filter((n) => n.role === role);
  },

  addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification[] {
    const all = loadAll();
    const created: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    const next = [created, ...all];
    saveAll(next);
    return next.filter((n) => n.role === notif.role);
  },

  markAsRead(id: string, role: UserRole): AppNotification[] {
    const next = loadAll().map((n) => (n.id === id ? { ...n, read: true } : n));
    saveAll(next);
    return next.filter((n) => n.role === role);
  },

  markAllAsRead(role: UserRole): AppNotification[] {
    const next = loadAll().map((n) => (n.role === role ? { ...n, read: true } : n));
    saveAll(next);
    return next.filter((n) => n.role === role);
  },

  clearForRole(role: UserRole): AppNotification[] {
    const next = loadAll().filter((n) => n.role !== role);
    saveAll(next);
    return [];
  },
};
