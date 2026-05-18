'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import AuthBanner from '@/components/AuthBanner';
import MenuCardGrid from '@/components/MenuCardGrid';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/components/providers/AuthProvider';
import { claimService } from '@/lib/api';
import type { Claim, MenuKey } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isUnauthenticated, setRole } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    claimService
      .getAll()
      .then((data) => setClaims(data.slice(0, 2)))
      .catch(() => setClaims([]));
  }, []);

  const unlockedKeys: MenuKey[] = isAuthenticated
    ? ['claim', 'analysis', 'review', 'design']
    : ['claim'];

  const greetingName = user?.name ?? '설계사';

  return (
    <>
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6 space-y-5 lg:space-y-6">
        {/* 인증 유도 배너 (미인증 시) */}
        {isUnauthenticated && <AuthBanner />}

        {/* 인사말 + 배지 */}
        <div>
          <Badge variant={isAuthenticated ? 'auth' : 'unauth'} className="mb-2">
            {isAuthenticated ? '인증 설계사' : '미인증 설계사'}
          </Badge>
          <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
            안녕하세요, {greetingName} 설계사님
          </h1>
        </div>

        {/* 4개 메뉴 카드 그리드 */}
        <MenuCardGrid unlockedKeys={unlockedKeys} />

        {/* 하단 2단 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* 좌측: 최근 청구 현황 */}
          <section className="bg-bg-surface rounded-2xl border border-border shadow-card p-5 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-text-primary text-base lg:text-lg">최근 청구 현황</h2>
              <button
                type="button"
                onClick={() => router.push('/claims')}
                className="text-xs lg:text-sm text-fa-purple font-semibold hover:underline"
              >
                전체보기 &gt;
              </button>
            </div>

            {claims.length === 0 ? (
              <p className="text-center text-text-muted text-sm py-8">
                청구 내역이 없습니다
              </p>
            ) : (
              <ul className="space-y-3">
                {claims.map((claim) => (
                  <li
                    key={claim.id}
                    className="flex items-center gap-3 p-3 lg:p-4 bg-bg-subtle rounded-xl"
                  >
                    <span className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-menu-analysis-bg text-menu-analysis flex items-center justify-center shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                      </svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm lg:text-base font-semibold text-text-primary truncate">
                        {claim.customer?.name ?? '고객'} 고객님
                      </p>
                      <p className="text-xs lg:text-sm text-text-muted truncate">
                        {claim.accidentType ?? '청구'} · {claim.createdAt?.slice(0, 10) ?? '-'}
                      </p>
                    </div>
                    <Badge
                      variant={
                        claim.status === 'PAID'
                          ? 'success'
                          : claim.status === 'SENT'
                            ? 'review'
                            : 'pending'
                      }
                    >
                      {claim.status === 'PAID'
                        ? '지급완료'
                        : claim.status === 'SENT'
                          ? '발송완료'
                          : '임시저장'}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 우측: 공지사항 + 학습 가이드 (세로 스택) */}
          <div className="space-y-4 lg:space-y-6">
            {/* 공지사항 */}
            <section className="bg-bg-surface rounded-2xl border border-border shadow-card p-5 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-text-primary text-base lg:text-lg">공지사항</h2>
                <button type="button" className="text-text-muted" aria-label="더보기">···</button>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span className="text-sm lg:text-base text-text-primary truncate">개인정보 처리방침 개정 안내</span>
                  <span className="text-xs lg:text-sm text-text-muted shrink-0 ml-2">11.24</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm lg:text-base text-text-primary truncate">시스템 정기 점검 안내 (11/30)</span>
                  <span className="text-xs lg:text-sm text-text-muted shrink-0 ml-2">11.22</span>
                </li>
              </ul>
            </section>

            {/* 학습 가이드 (보라/남색 박스) */}
            <button
              type="button"
              onClick={() => router.push('/guide')}
              className="block w-full text-left bg-fa-purple hover:bg-fa-purple-hover transition-colors rounded-2xl p-5 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <p className="font-bold mb-1 text-base lg:text-lg">학습 가이드</p>
                  <p className="text-xs lg:text-sm text-white/80">
                    {isAuthenticated ? '플랫폼 활용 팁 모음' : '미인증 설계사를 위한 이용 방법 총정리'}
                  </p>
                </div>
                <span className="text-white shrink-0" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* DEV: 인증 상태 토글 (개발 전용) */}
        <div className="mt-6 p-3 bg-bg-subtle border border-dashed border-border rounded-xl text-xs text-text-muted max-w-md">
          <p className="mb-2 font-semibold">🛠️ DEV: 인증 상태 토글</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRole('authenticated')}
              className={`px-3 py-1 rounded-md ${
                isAuthenticated ? 'bg-fa-purple text-white' : 'bg-bg-surface border border-border'
              }`}
            >
              인증 설계사
            </button>
            <button
              type="button"
              onClick={() => setRole('unauthenticated')}
              className={`px-3 py-1 rounded-md ${
                isUnauthenticated ? 'bg-fa-purple text-white' : 'bg-bg-surface border border-border'
              }`}
            >
              미인증 설계사
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
