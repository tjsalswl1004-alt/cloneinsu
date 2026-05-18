'use client';

import { useRouter } from 'next/navigation';
import type { MenuItem, MenuKey } from '@/types';

const MenuIcons: Record<MenuKey, React.JSX.Element> = {
  claim: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m9 11 2 2 4-4" />
    </svg>
  ),
  analysis: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  review: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  ),
  design: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m14.5 2 5.5 5.5L8 19.5 2.5 14z" />
      <path d="M14.5 7.5 19 12" />
    </svg>
  ),
};

const LockBadge = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const MENU_ITEMS: MenuItem[] = [
  {
    key: 'claim',
    label: '청구',
    description: '간편한 청구 대행 및 관리 서비스를 이용해보세요.',
    path: '/insurance-select',
    accentColor: 'text-menu-claim',
    bgColor: 'bg-menu-claim-bg',
  },
  {
    key: 'analysis',
    label: '분석',
    description: '고객의 보장 내역을 인공지능으로 정밀하게 분석합니다.',
    path: '/analysis',
    accentColor: 'text-menu-analysis',
    bgColor: 'bg-menu-analysis-bg',
  },
  {
    key: 'review',
    label: '심사',
    description: '인수 심사 가능 여부를 사전에 빠르게 확인하세요.',
    path: '/review',
    accentColor: 'text-menu-review',
    bgColor: 'bg-menu-review-bg',
  },
  {
    key: 'design',
    label: '설계',
    description: '최적의 맞춤 플랜을 비교 설계하고 제안합니다.',
    path: '/design',
    accentColor: 'text-menu-design',
    bgColor: 'bg-menu-design-bg',
  },
];

interface MenuCardGridProps {
  unlockedKeys: MenuKey[];
}

export default function MenuCardGrid({ unlockedKeys }: MenuCardGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {MENU_ITEMS.map((item) => {
        const isLocked = !unlockedKeys.includes(item.key);
        return (
          <button
            key={item.key}
            onClick={() => !isLocked && router.push(item.path)}
            disabled={isLocked}
            className={`group relative text-left p-4 lg:p-5 rounded-2xl border transition-all ${
              isLocked
                ? 'bg-bg-subtle border-border cursor-not-allowed'
                : 'bg-bg-surface border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5'
            }`}
            aria-label={`${item.label}${isLocked ? ' (잠금)' : ''}`}
          >
            {/* 아이콘 + 잠금 표시 */}
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center ${
                  isLocked ? 'bg-bg-main text-text-muted' : `${item.bgColor} ${item.accentColor}`
                }`}
              >
                {MenuIcons[item.key]}
              </div>
              {isLocked && (
                <span className="text-text-muted shrink-0" aria-hidden="true">
                  {LockBadge}
                </span>
              )}
            </div>

            <p
              className={`font-bold text-base lg:text-lg mb-1 ${
                isLocked ? 'text-text-muted' : 'text-text-primary'
              }`}
            >
              {item.label}
            </p>
            <p
              className={`text-xs lg:text-sm leading-relaxed line-clamp-2 ${
                isLocked ? 'text-text-muted' : 'text-text-secondary'
              }`}
            >
              {item.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
