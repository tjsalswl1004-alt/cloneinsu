'use client';

import { useRouter } from 'next/navigation';

export default function AuthBanner() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 bg-badge-banner-bg border border-orange-200/60 rounded-2xl px-4 py-3">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-badge-banner-text"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p className="flex-1 text-sm font-semibold text-badge-banner-text">
        인증을 완료하면 모든 기능을 사용할 수 있어요
      </p>
      <button
        type="button"
        onClick={() => router.push('/verify')}
        className="shrink-0 h-9 px-4 rounded-lg text-sm font-semibold text-white bg-badge-banner-text hover:opacity-90 transition-opacity"
      >
        인증하기
      </button>
    </div>
  );
}
