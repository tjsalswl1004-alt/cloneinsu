'use client';

import { FormEvent, useEffect, useState } from 'react';
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

const UserIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PhoneIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const BuildingIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="9" y1="22" x2="9" y2="2" />
    <line x1="15" y1="22" x2="15" y2="2" />
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

const ShieldIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    company: '',
  });
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);
    return () => clearTimeout(timer);
  }, [success, router]);

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleVerify = () => {
    if (!form.name || !form.phone) {
      setError('이름과 휴대폰 번호를 먼저 입력해주세요.');
      return;
    }
    setError(null);
    // TODO: 실제 본인인증 연동 (PASS / NICE 등)
    setVerified(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.email || !form.password || !form.name || !form.phone || !form.company) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!verified) {
      setError('본인인증을 완료해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await authService.signup({
        email: form.email,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        name: form.name,
        phone: form.phone,
        company: form.company,
      });

      login({
        id: String(response.id),
        name: response.name,
        email: response.email,
        role: response.role.toLowerCase() as UserRole,
      });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError(err.message || '이미 사용 중인 이메일입니다.');
        } else if (err.status === 400) {
          setError(err.message || '입력값을 확인해주세요.');
        } else {
          setError('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else {
        setError('네트워크 오류가 발생했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-bg-main">
      {/* 좌측: 브랜드 영역 (로그인 페이지와 동일) */}
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

      {/* 우측: 회원가입 폼 카드 */}
      <section className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-bg-surface rounded-2xl border border-border shadow-card p-8 lg:p-10">
          {/* 모바일 전용 로고 */}
          <div className="lg:hidden mb-8 text-center">
            <span className="text-3xl font-black tracking-tight text-fa-purple">FIELDARENA</span>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-text-muted mt-1">
              INSTITUTIONAL GRADE
            </p>
          </div>

          {success ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-menu-analysis-bg text-menu-analysis flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                회원가입이 완료되었습니다
              </h2>
              <p className="text-sm text-text-secondary mb-1">
                {form.name} 설계사님, 환영합니다!
              </p>
              <p className="text-sm text-text-muted mb-7">
                잠시 후 메인 화면으로 이동합니다...
              </p>
              <Button size="lg" fullWidth onClick={() => router.push('/')}>
                지금 이동
              </Button>
            </div>
          ) : (
            <>
          {/* 뒤로가기 */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-fa-purple mb-5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            로그인으로 돌아가기
          </Link>

          <h2 className="text-2xl font-bold text-text-primary mb-2">회원가입</h2>
          <p className="text-sm text-text-secondary mb-7">새 계정을 만들어 시작하세요</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="이메일"
              type="email"
              placeholder="email@fieldarena.com"
              icon={EmailIcon}
              value={form.email}
              onChange={update('email')}
              autoComplete="email"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="비밀번호"
                togglePassword
                placeholder="비밀번호"
                icon={LockIcon}
                value={form.password}
                onChange={update('password')}
                autoComplete="new-password"
              />
              <Input
                label="비밀번호 확인"
                togglePassword
                placeholder="재입력"
                icon={LockIcon}
                value={form.passwordConfirm}
                onChange={update('passwordConfirm')}
                autoComplete="new-password"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="이름"
                placeholder="홍길동"
                icon={UserIcon}
                value={form.name}
                onChange={update('name')}
                autoComplete="name"
              />
              <Input
                label="휴대폰 번호"
                type="tel"
                placeholder="010-0000-0000"
                icon={PhoneIcon}
                value={form.phone}
                onChange={update('phone')}
                autoComplete="tel"
              />
            </div>

            {/* 본인인증 버튼 */}
            <button
              type="button"
              onClick={handleVerify}
              className={`w-full h-11 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
                verified
                  ? 'border-menu-analysis bg-menu-analysis-bg text-menu-analysis'
                  : 'border-fa-purple/40 text-fa-purple hover:bg-fa-purple-light'
              }`}
            >
              {ShieldIcon}
              {verified ? '본인인증 완료' : '본인인증'}
            </button>

            <Input
              label="소속 회사"
              placeholder="소속 회사를 입력해주세요"
              icon={BuildingIcon}
              value={form.company}
              onChange={update('company')}
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" fullWidth className="mt-2" disabled={submitting}>
              {submitting ? '가입 처리 중...' : '다음 단계'}
            </Button>
          </form>

          {/* 푸터 */}
          <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-border text-xs text-text-muted">
            <Link href="/terms" className="hover:text-text-secondary">이용약관</Link>
            <Link href="/privacy" className="hover:text-text-secondary">개인정보처리방침</Link>
            <Link href="/help" className="hover:text-text-secondary">도움말</Link>
          </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
