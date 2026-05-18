'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/components/providers/AuthProvider';
import { ApiError, authService } from '@/lib/api';
import type { UserRole } from '@/types';

const EmailIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const KakaoLogo = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <path d="M9 1.5C4.86 1.5 1.5 4.16 1.5 7.45c0 2.1 1.36 3.94 3.4 5.02L4.13 15.3c-.08.27.23.49.46.33L8 13.42c.33.04.66.07 1 .07 4.14 0 7.5-2.67 7.5-5.95S13.14 1.5 9 1.5z" />
  </svg>
);

const NaverLogo = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor">
    <path d="M11.18 9.62 6.74 3H3v12h3.82V8.38L11.26 15H15V3h-3.82v6.62z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      login({
        id: String(response.id),
        name: response.name,
        email: response.email,
        role: response.role.toLowerCase() as UserRole,
      });
      router.push('/');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError(err.message || '이메일 또는 비밀번호가 일치하지 않습니다.');
        } else if (err.status === 400) {
          setError(err.message || '입력값을 확인해주세요.');
        } else {
          setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else {
        setError('네트워크 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = (provider: 'kakao' | 'naver') => {
    // TODO: 카카오/네이버 OAuth 연동 (현재 미구현)
    setError(`${provider === 'kakao' ? '카카오' : '네이버'} 간편 로그인은 준비 중입니다.`);
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-bg-main">
      {/* 좌측: 브랜드 영역 */}
      <section className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-fa-purple-light via-bg-main to-bg-main p-12 xl:p-16 flex-col">
        <div className="flex items-center gap-3 mb-12">
          <span className="text-5xl xl:text-6xl font-black tracking-tight text-fa-purple">
            FIELDARENA
          </span>
        </div>
        <p className="text-xs font-semibold tracking-[0.2em] text-text-muted mb-6">
          INSTITUTIONAL GRADE
        </p>
        <h1 className="text-4xl xl:text-5xl font-bold text-text-primary leading-tight mb-6">
          설계사의 실무를 하나로
          <br />
          연결하는 통합 영업 플랫폼
        </h1>
        <p className="text-slate-600 font-medium leading-relaxed max-w-md">
          분석부터 청구까지, 한 곳에서 완벽하게 관리하세요.
        </p>
      </section>

      {/* 우측: 로그인 폼 */}
      <section className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-bg-surface rounded-2xl border border-border shadow-card p-8 lg:p-10">
          {/* 모바일 전용 로고 */}
          <div className="lg:hidden mb-8 text-center">
            <span className="text-3xl font-black tracking-tight text-fa-purple">FIELDARENA</span>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-text-muted mt-1">
              INSTITUTIONAL GRADE
            </p>
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-2">환영합니다</h2>
          <p className="text-sm text-text-secondary mb-8">
            계정으로 로그인하여 비즈니스를 시작하세요
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="이메일"
              type="email"
              placeholder="email@fieldarena.com"
              icon={EmailIcon}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
            <Input
              label="비밀번호"
              togglePassword
              placeholder="••••••••"
              icon={LockIcon}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />

            {/* 아이디 / 비밀번호 찾기 — 우측 정렬 */}
            <div className="flex justify-end gap-3 text-xs">
              <Link
                href="/find-id"
                className="text-text-secondary hover:text-fa-purple transition-colors"
              >
                아이디 찾기
              </Link>
              <span className="text-border" aria-hidden="true">|</span>
              <Link
                href="/find-password"
                className="text-fa-purple font-semibold hover:underline"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" fullWidth disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          {/* 간편 로그인 */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-muted">간편 로그인</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => handleSocial('kakao')}
                disabled={loading}
                aria-label="카카오로 로그인"
                className="w-12 h-12 rounded-full bg-kakao text-kakao-text flex items-center justify-center hover:brightness-95 disabled:opacity-50 transition-all"
              >
                {KakaoLogo}
              </button>
              <button
                type="button"
                onClick={() => handleSocial('naver')}
                disabled={loading}
                aria-label="네이버로 로그인"
                className="w-12 h-12 rounded-full bg-naver text-naver-text flex items-center justify-center hover:brightness-95 disabled:opacity-50 transition-all"
              >
                {NaverLogo}
              </button>
            </div>
          </div>

          {/* 회원가입 */}
          <p className="text-center text-sm text-text-secondary mt-8">
            아직 회원이 아니신가요?{' '}
            <Link href="/signup" className="text-fa-purple font-semibold hover:underline">
              회원가입
            </Link>
          </p>

          {/* 푸터 */}
          <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-border text-xs text-text-muted">
            <Link href="/terms" className="hover:text-text-secondary">이용약관</Link>
            <Link href="/privacy" className="hover:text-text-secondary">개인정보처리방침</Link>
            <Link href="/help" className="hover:text-text-secondary">도움말</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
