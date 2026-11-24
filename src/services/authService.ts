import { mockExpertAccounts, mockFarmers } from '../data/mockFarmers';
import type { Language, User, UserRole } from '../types';
import { apiRequest } from './api';

const CURRENT_USER_KEY = 'fd_current_user_v1';
const USERS_STORAGE_KEY = 'fd_demo_users_v1';

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  preferredLanguage: Language;
  location: string;
  role: UserRole;
}

function getStoredUsers(): User[] {
  const defaults = [...mockFarmers, ...mockExpertAccounts];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw) as User[];
    return parsed.length ? parsed : defaults;
  } catch {
    return defaults;
  }
}

function saveStoredUsers(users: User[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export const authService = {
  async login(payload: LoginPayload): Promise<User> {
    try {
      const response = await apiRequest<{ user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.user));
      return response.user;
    } catch {
      // Demo simulation fallback
      await new Promise((r) => setTimeout(r, 450));
      const users = getStoredUsers();
      const normalized = payload.email.trim().toLowerCase();
      const matched = users.find((u) => u.email.toLowerCase() === normalized);

      if (!matched) {
        // Allow convenient demo login if password >= 6 chars with any email
        if (payload.password.length < 6) {
          throw new Error('Invalid email or password. Try one of the demo accounts below.');
        }
        const inferredRole: UserRole = normalized.includes('expert') ? 'expert' : 'farmer';
        const fallbackUser: User = {
          ...(inferredRole === 'expert' ? mockExpertAccounts[0] : mockFarmers[0]),
          id: `${inferredRole}-custom`,
          email: payload.email.trim(),
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(fallbackUser));
        return fallbackUser;
      }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matched));
      return matched;
    }
  },

  async loginAsDemo(role: UserRole): Promise<User> {
    await new Promise((r) => setTimeout(r, 300));
    const users = getStoredUsers();
    const demoUser =
      users.find((u) => u.role === role) ??
      (role === 'expert' ? mockExpertAccounts[0] : mockFarmers[0]);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
    return demoUser;
  },

  async register(payload: RegisterPayload): Promise<User> {
    try {
      const response = await apiRequest<{ user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.user));
      return response.user;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
      const users = getStoredUsers();
      const exists = users.some(
        (u) => u.email.toLowerCase() === payload.email.trim().toLowerCase()
      );
      if (exists) {
        throw new Error('An account with this email already exists in this demo session.');
      }
      const newUser: User = {
        id: `${payload.role}-${Date.now()}`,
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        role: payload.role,
        preferredLanguage: payload.preferredLanguage,
        location: payload.location.trim(),
        createdAt: new Date().toISOString(),
        ...(payload.role === 'farmer'
          ? {
              farmName: `${payload.name.split(' ')[0]}'s Melon Farm`,
              farmSizeAcres: 5,
              melonVariety: 'Cantaloupe / Muskmelon',
            }
          : {
              specialization: 'Melon & Cucurbit Crop Advisory',
              qualifications: 'Agricultural Specialist (Demo Account)',
              experienceYears: 4,
              languages: ['English', 'Urdu'],
              availability: 'Available' as const,
              bio: 'Registered demonstration agricultural specialist profile.',
            }),
      };
      saveStoredUsers([newUser, ...users]);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      return newUser;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' }, 800);
    } catch {
      // ignore when backend offline
    }
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    await new Promise((r) => setTimeout(r, 300));
    const users = getStoredUsers();
    const current = this.getCurrentUser();
    const updatedUser: User = {
      ...(current ?? mockFarmers[0]),
      ...updates,
      id: userId,
    };
    const nextUsers = users.map((u) => (u.id === userId ? updatedUser : u));
    if (!nextUsers.some((u) => u.id === userId)) {
      nextUsers.unshift(updatedUser);
    }
    saveStoredUsers(nextUsers);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 350));
  },
};
