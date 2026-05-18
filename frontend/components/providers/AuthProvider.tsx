'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { User, UserRole } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  role: UserRole | null;
  login: (user: User) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'fa-auth-user';

const DEFAULT_MOCK_USER: User = {
  id: 'demo-1',
  name: '홍길동',
  email: 'demo@fieldarena.com',
  role: 'unauthenticated',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User);
      } catch {
        setUser(DEFAULT_MOCK_USER);
      }
    } else {
      setUser(DEFAULT_MOCK_USER);
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: User | null) => {
    setUser(next);
    if (typeof window !== 'undefined') {
      if (next) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isAuthenticated: user?.role === 'authenticated' || user?.role === 'admin',
      isUnauthenticated: user?.role === 'unauthenticated',
      role: user?.role ?? null,
      login: (next) => persist(next),
      logout: () => persist(null),
      setRole: (nextRole) => {
        const base = user ?? DEFAULT_MOCK_USER;
        persist({ ...base, role: nextRole });
      },
    };
  }, [user, persist]);

  if (!hydrated) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
