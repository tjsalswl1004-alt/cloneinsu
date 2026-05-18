'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function AppHeader() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-bg-surface/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 h-14 lg:h-16">
        <button onClick={() => router.push('/')} className="flex items-center gap-1">
          <span className="text-2xl lg:text-3xl font-black tracking-tight text-fa-purple">FIELDARENA</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="알림"
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-subtle"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => router.push('/settings')}
            aria-label="프로필"
            className="w-9 h-9 rounded-full bg-fa-purple-light flex items-center justify-center text-fa-purple font-semibold text-sm"
          >
            {user?.name?.[0] ?? '?'}
          </button>
        </div>
      </div>
    </header>
  );
}
