# FIELDARENA 구현 계획

> 작성일: 2026-05-13
> 관련 spec: `docs/superpowers/specs/2026-05-13-cloneinsu-design.md`

## Context

기존 Vite + React 기반 풀스택 앱(2026-05-08~12 구현/배포 완료)을 **Next.js 15 + TypeScript**로 마이그레이션 진행. 회사 요구사항(Next.js 15 호환). 백엔드/DB/배포 인프라는 기존 그대로 유지.

**현재 상태 (2026-05-13 기준):**
- ✅ 백엔드 + DB + 배포 인프라 운영 중 (Render/Supabase/Netlify)
- ✅ Next.js 15 마이그레이션 완료 (7개 페이지)
- ✅ Vitest 테스트 34개 작성/통과
- ⏳ 새 코드 브라우저 동작 확인 필요
- ⏳ Netlify에 옛날 Vite 버전이 배포돼 있음 (Next.js 버전 재배포 필요)

## 완료된 작업

### Phase 1: 백엔드 + DB 구축 (5/8~11)
- [x] Spring Boot 3.2 프로젝트 셋업
- [x] JPA 엔티티 설계 (Claim, Customer, InsuranceCompany, ClaimAccount, ClaimSignature, Attachment)
- [x] REST API (ClaimController, InsuranceCompanyController, CustomerController)
- [x] DataInitializer로 보험사 56개 시드
- [x] CustomerService.findOrCreate 중복 방지

### Phase 2: Vite + React 프론트 구축 (5/8~10)
- [x] CRA로 초기 셋업 → Vite 마이그레이션 (5/12)
- [x] 7개 페이지 구현 (홈, 청구내역, 청구하기, 보험사선택, 서류안내, 설정, 계산기)
- [x] Tailwind CSS 적용
- [x] React Router 기반 라우팅

### Phase 3: 클라우드 배포 (5/12)
- [x] Supabase PostgreSQL 프로젝트 생성 + Session Pooler 연결
- [x] `application.yml` 환경변수 분리 (DB_URL, DB_USERNAME, DB_PASSWORD, PORT)
- [x] Dockerfile 작성 (gradle:8.5-jdk17 + eclipse-temurin:17-jre)
- [x] Render Web Service에 백엔드 배포
- [x] Netlify에 프론트엔드 배포
- [x] CORS에 운영 도메인 추가

### Phase 4: Next.js 15 마이그레이션 (5/13)
- [x] `frontend` 폴더 `frontend-vite-backup`으로 백업
- [x] `npx create-next-app@15`로 새 프로젝트 (TS + Tailwind + App Router + Turbopack)
- [x] 환경변수 패턴 변경 (`VITE_API_URL` → `NEXT_PUBLIC_API_URL`)
- [x] 공통 레이아웃 (`app/layout.tsx`, Header, BottomNav) 작성
- [x] 7개 페이지 TypeScript 변환:
  - [x] 홈 (`app/page.tsx`) — StatsSummary 그래프 + 내 청구/전체 회원 탭 포함
  - [x] 청구내역 (`app/claims/page.tsx`) — ClaimDetailCard + CustomerGroupCard + 전체/고객별 토글
  - [x] 청구하기 (`app/claim/new/page.tsx`) — 6 섹션 폼 + Canvas 서명 + 파일 업로드
  - [x] 보험사 선택 (`app/insurance-select/page.tsx`)
  - [x] 실비 계산기 (`app/calculator/page.tsx`) — 6 세대 × 통원/입원
  - [x] 서류 안내 (`app/documents/page.tsx`)
  - [x] 설정 (`app/settings/page.tsx`)
- [x] axios 인스턴스 (`lib/api.ts`) + TypeScript 타입 (`types/index.ts`)
- [x] 공통 컴포넌트 (StatusBadge, ClaimCard, StatsSummary)

### Phase 5: 테스트 작성 (5/13)
- [x] Vitest + RTL 설정 (`vitest.config.ts`, `vitest.setup.ts`)
- [x] `next/navigation` mock
- [x] 핵심 페이지 3개 테스트 (성공 + 실패 케이스)
  - 홈: 11개 테스트
  - 청구내역: 10개 테스트
  - 청구하기: 13개 테스트
- [x] 전체 34개 테스트 통과 확인

### Phase 6: 빌드 검증 (5/13)
- [x] `npm run build` 성공 (Turbopack, 11/11 페이지 정적 생성)
- [x] TypeScript 타입 에러 0개
- [x] ESLint warning 1개만 (`<img>` → `<Image />` 권장사항, 무시 가능)

## 남은 작업

### Task 1: 브라우저 동작 확인 (사용자 작업)

**파일:**
- 확인용: 모든 페이지

**단계:**
- [ ] `npm run dev`로 로컬 서버 띄우기 (포트 3000 또는 3001)
- [ ] 각 페이지 클릭하면서 동작 확인
- [ ] 다음 기능 정상 동작 여부:
  - 홈 통계, 메뉴 클릭
  - 청구내역 탭 + 토글
  - 보험사 선택 → 청구 폼 진입
  - 청구 폼 입력 → 저장 → DB 반영
  - 계산기 실시간 계산
- [ ] 문제 있으면 콘솔 에러 확인 후 보고

### Task 2: 옛날 frontend-vite-backup 폴더 정리

**파일:**
- 삭제: `frontend-vite-backup/`

**단계:**
- [ ] 새 Next.js 버전이 모든 기능 잘 동작하는지 확인 후 삭제 결정
- [ ] 필요하면 `git tag v1-vite`로 태그 후 삭제
- [ ] PowerShell: `Remove-Item -Recurse frontend-vite-backup`
- [ ] 커밋: `chore: 옛 Vite 버전 백업 폴더 제거`

### Task 3: GitHub에 push

**파일:**
- 변경된 모든 파일

**단계:**
- [ ] `git status`로 변경사항 확인
- [ ] `git add .`
- [ ] `git commit -m "feat: Vite → Next.js 15 + TypeScript 마이그레이션"`
- [ ] `git push`

### Task 4: Netlify 빌드 설정 변경 (Vite → Next.js)

**컨텍스트:** 현재 Netlify에는 Vite 기준 빌드 설정이 돼있어서, Next.js로 바꿔야 함.

**Netlify 대시보드 → Site Configuration → Build & Deploy:**

**기존 설정 (Vite):**
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

**변경 후 설정 (Next.js):**
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/.next
```

**또는** Netlify에서 Next.js 자동 감지 → `@netlify/plugin-nextjs` 플러그인 설치 (대시보드에서 자동 적용)

**단계:**
- [ ] Netlify 대시보드 → cloneinsu 프로젝트 → Site Configuration
- [ ] Build settings 변경 (Publish directory)
- [ ] Next.js 플러그인 추가 (자동 추천됨)
- [ ] "Trigger deploy" 또는 다음 git push로 재배포 트리거
- [ ] 배포 로그에서 빌드 성공 확인
- [ ] 사이트 접속해서 동작 확인 (`https://cloneinsu.netlify.app`)

### Task 5: 운영 환경변수 확인

**파일:**
- Netlify 환경변수: `NEXT_PUBLIC_API_URL`

**단계:**
- [ ] Netlify → Environment variables
- [ ] `NEXT_PUBLIC_API_URL=https://cloneinsu-backend.onrender.com/api` 확인 (Vite 시절 `VITE_API_URL`로 설정돼 있으면 이름 변경)
- [ ] 변경 후 재배포 필요

### Task 6: 운영 사이트 통합 테스트

**단계:**
- [ ] `https://cloneinsu.netlify.app` 접속
- [ ] 홈 → 통계 표시 확인
- [ ] 청구하기 → 새 청구 작성 → Supabase에 저장되는지 확인
- [ ] 청구내역 → 방금 만든 청구 보이는지 확인
- [ ] DevTools Network 탭에서 CORS 에러 없는지 확인

### Task 7: 옵션 — `<Image />` 마이그레이션

**파일:**
- `frontend/app/page.tsx`

**단계:**
- [ ] `<img src="/greeting-characters.png">` → `<Image src="/greeting-characters.png" width={176} height={...} />`로 변경
- [ ] `npm run build`로 warning 사라졌는지 확인
- [ ] 커밋: `chore: img → next/image 마이그레이션`

### Task 8: 옵션 — `frontend/test-output.txt` 정리

**파일:**
- 삭제: 운영에 불필요한 임시 파일들

**단계:**
- [ ] `frontend-vite-backup/test-output.txt` 등 임시 파일 확인
- [ ] `.gitignore`에 패턴 추가

## Verification

### 로컬 검증
```powershell
cd C:\Users\minji\cloneinsu\frontend
npm run dev          # localhost:3000/3001 동작 확인
npm run build        # 빌드 + 타입 체크 통과
npm test             # 34개 테스트 통과
```

백엔드 (별도 PowerShell):
```powershell
cd C:\Users\minji\cloneinsu\backend
.\gradlew bootRun    # localhost:8080
```

### 운영 검증
```bash
curl https://cloneinsu-backend.onrender.com/api/insurance-companies
# 56개 보험사 JSON 응답 확인

# 브라우저에서
# https://cloneinsu.netlify.app
# → 홈/청구내역/보험사선택 동작 확인
# → DevTools Network 탭 200 OK 확인
```

## Critical Files

### 마이그레이션 핵심
- `frontend/app/page.tsx` — 홈
- `frontend/app/claims/page.tsx` — 청구내역
- `frontend/app/claim/new/page.tsx` — 청구 폼 (가장 복잡)
- `frontend/app/calculator/page.tsx` — 계산기
- `frontend/app/layout.tsx` — 공통 레이아웃
- `frontend/lib/api.ts` — axios + 서비스
- `frontend/types/index.ts` — TypeScript 타입

### 설정
- `frontend/.env.local` — 로컬 환경변수
- `frontend/next.config.ts` — Next.js 설정
- `frontend/vitest.config.ts` — 테스트 설정
- `frontend/package.json` — scripts (`dev`, `build`, `test`)

### 배포 관련
- `backend/Dockerfile` — Render 배포용
- `backend/src/main/resources/application.yml` — 환경변수 패턴
- `backend/.../controller/*.java` — CORS 설정

## 변경 이력 (이 plan)

| 일자 | 변경 |
|---|---|
| 2026-05-13 | 최초 작성 (Next.js 마이그레이션 후 현재 상태 반영) |
