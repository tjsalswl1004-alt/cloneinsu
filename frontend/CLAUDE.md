# Frontend

Next.js 15.5 + React 19 + TypeScript + Tailwind v4 (App Router, Turbopack).

## 명령어
- `npm run dev` — 개발 서버 (포트 3000)
- `npm run build` — 프로덕션 빌드 (.next/ 생성)
- `npm test` — Vitest 테스트 실행
- `npm run test:watch` — 테스트 watch 모드

## 폴더 구조
- `app/`         App Router 페이지 (파일 = 라우트)
- `components/`  공통 컴포넌트 (Header, BottomNav, ClaimCard 등)
- `lib/`         axios 인스턴스, API 서비스 (`api.ts`)
- `types/`       TypeScript 타입 정의 (`index.ts`)
- `public/`      정적 자원 (이미지, favicon)

## 페이지 (7개)
- `/`                    홈 (인사말, 메뉴, 통계, 최근 청구)
- `/claims`              청구내역 (탭, 전체/고객별 토글)
- `/claim/new`           청구 작성 폼 (6 섹션)
- `/insurance-select`    보험사 선택 (3 카테고리)
- `/calculator`          실비 계산기 (6 세대)
- `/documents`           청구서류 안내
- `/settings`            프로필 설정

## App Router 규칙
- 페이지: `app/경로/page.tsx`
- 레이아웃: `app/layout.tsx` (전역), 페이지별 헤더는 페이지 내에서
- 클라이언트 컴포넌트: 파일 맨 위에 `'use client'` 추가
  - useState, useEffect, onClick, useRouter 사용 시 필수
- 페이지 이동: `useRouter from 'next/navigation'` (react-router 아님)
- URL 쿼리: `useSearchParams from 'next/navigation'`
  - useSearchParams 쓰는 컴포넌트는 `<Suspense>`로 감싸기

## Tailwind v4
- 커스텀 색상: `app/globals.css`의 `@theme`에 정의
- 기본 색상: `primary: #4F6EF7`, `primary-dark: #3B5BDB`
- v3와 설정 방식 다름 (tailwind.config.js 사용 X)

## 환경변수
- `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8080/api`
- `NEXT_PUBLIC_` 접두사 없으면 브라우저에서 접근 불가
- 운영 환경: Netlify 대시보드에서 설정

## API 호출
- `lib/api.ts`의 `claimService`, `insuranceCompanyService` 사용
- axios 인스턴스에 baseURL 설정됨
- 응답 타입은 `types/index.ts`의 인터페이스 사용

## 테스트 (Vitest + RTL)
- 위치: `app/.../__tests__/page.test.tsx`
- `next/navigation`은 `vitest.setup.ts`에서 mock 처리됨
- 새 테스트 작성 시: 성공 케이스 + 실패 케이스 모두 작성
- mock된 push 함수: `globalThis.__mockPush`

## 자주 하는 실수
- `'use client'` 빼먹고 useState 사용 → 빌드 에러
- `useNavigate` (react-router-dom) 사용 → 존재하지 않음
- `process.env.VITE_API_URL` 사용 → `process.env.NEXT_PUBLIC_API_URL`로

## 배포 (Netlify)
- 빌드 명령: `npm run build`
- Publish 디렉토리: `frontend/.next` (또는 `@netlify/plugin-nextjs` 자동)
- 환경변수: `NEXT_PUBLIC_API_URL`
