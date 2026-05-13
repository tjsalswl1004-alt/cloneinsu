# FIELDARENA 보험 청구 시스템 설계

> 작성일: 2026-05-13
> 이전 문서: `2026-05-08-cloneinsu-design.md`
> 변경 사유: 프론트엔드 Vite → Next.js 15 마이그레이션, 클라우드 배포 환경 추가

## 1. 개요

**프로젝트명:** FIELDARENA (필드아레나 클론)
**유형:** 보험설계사용 웹 기반 청구 관리 시스템

설계사가 고객을 대신해 보험 청구를 작성/저장/전송하는 모바일 우선 SPA. 백엔드는 Spring Boot 기반 REST API, 데이터는 PostgreSQL에 저장.

## 2. 기술 스택

### Frontend
- **Framework:** Next.js 15.5.18 (App Router)
- **언어:** TypeScript 5
- **스타일:** Tailwind CSS v4
- **HTTP 클라이언트:** axios 1.16
- **빌드 도구:** Turbopack (내장)
- **테스트:** Vitest 4 + React Testing Library

### Backend
- **Framework:** Spring Boot 3.2.5
- **언어:** Java 17
- **ORM:** JPA / Hibernate
- **빌드 도구:** Gradle 8.5
- **컨테이너:** Docker (eclipse-temurin:17-jre)

### Database
- **로컬:** PostgreSQL 16 (localhost:5432, db명: cloneinsu)
- **운영:** Supabase PostgreSQL (Session Pooler, IPv4 호환)

### Infrastructure
- **프론트엔드 호스팅:** Netlify
- **백엔드 호스팅:** Render (Docker)
- **DB 호스팅:** Supabase
- **소스 관리:** GitHub (`tjsalswl1004-alt/cloneinsu`)

## 3. 아키텍처

```
[브라우저]
   ↓ HTTPS
[Netlify CDN — Next.js 정적 빌드]
   ↓ XHR (axios)
[Render — Spring Boot Docker 컨테이너]
   ↓ JDBC (Session Pooler)
[Supabase PostgreSQL]
```

### 환경 분리
- **로컬:** 프론트 localhost:3000/3001, 백엔드 localhost:8080, 로컬 PostgreSQL
- **운영:** cloneinsu.netlify.app → cloneinsu-backend.onrender.com → Supabase

## 4. 데이터 모델

### 4.1 테이블

| 테이블 | 역할 | 주요 컬럼 |
|---|---|---|
| `customers` | 고객 (피보험자) | `id`, `name`, `id_front`, `id_back`, `phone` |
| `insurance_companies` | 보험사 (56개 시드) | `id`, `name`, `short_name`, `category`, `color`, `vfax` |
| `claims` | 청구 본체 | `id`, `customer_id`, `insurance_company_id`, `status`, `accident_type`, `accident_date`, `hospital_name`, `amount` |
| `claim_accounts` | 계좌 정보 (1:1) | `claim_id`, `account_type`, `bank_name`, `account_number`, `account_holder` |
| `claim_signatures` | 서명 (1:1) | `claim_id`, `sign_method`, `signature_data` (TEXT) |
| `attachments` | 첨부파일 (1:N) | `claim_id`, `original_name`, `file_size` |

### 4.2 ClaimStatus
- `DRAFT` (임시저장)
- `SENT` (발송완료)
- `FAILED` (발송실패)
- `PAID` (지급완료)

### 4.3 고객 식별
- `id_front + id_back` (주민번호)로 unique 식별
- `CustomerService.findOrCreate()`로 중복 방지

### 4.4 시드 데이터
- `DataInitializer` (ApplicationRunner + @Transactional)
- 서버 첫 실행 시 `insurance_companies` 테이블에 56개 보험사 자동 insert
  - 손해보험 20개, 생명보험 23개, 배상책임 13개

## 5. 페이지 구조 (7개)

App Router 파일 기반 라우팅:

| 경로 | 파일 | 역할 |
|---|---|---|
| `/` | `app/page.tsx` | 홈 (인사말, 메뉴, 통계, 최근 청구) |
| `/insurance-select` | `app/insurance-select/page.tsx` | 보험사 선택 (3 카테고리 × 56개) |
| `/claim/new` | `app/claim/new/page.tsx` | 청구 작성 폼 (6 섹션) |
| `/claims` | `app/claims/page.tsx` | 청구 내역 (탭, 전체/고객별 토글) |
| `/calculator` | `app/calculator/page.tsx` | 실비 계산기 (6 세대 × 통원/입원) |
| `/documents` | `app/documents/page.tsx` | 청구서류 안내 (4 진료 유형) |
| `/settings` | `app/settings/page.tsx` | 프로필 설정 |

### 5.1 공통 레이아웃
- `app/layout.tsx` — BottomNav (전역), Header는 페이지별
- `components/BottomNav.tsx` — 홈/청구내역/+/서류안내/설정
- `components/Header.tsx` — FIELDARENA 로고 (홈에서만)

## 6. API 설계

### 6.1 엔드포인트

| Method | 경로 | 설명 |
|---|---|---|
| GET | `/api/claims` | 전체 청구 조회 (status 필터 가능) |
| GET | `/api/claims/stats` | 통계 (총액, 발송완료, 지급완료, 완료율) |
| GET | `/api/claims/{id}` | 청구 단건 조회 |
| POST | `/api/claims` | 청구 생성 |
| PUT | `/api/claims/{id}` | 청구 수정 |
| DELETE | `/api/claims/{id}` | 청구 삭제 |
| GET | `/api/insurance-companies` | 전체 보험사 조회 (category 필터 가능) |
| GET | `/api/customers` | 전체 고객 조회 |

### 6.2 CORS
- 허용 origin: `localhost:3000`, `localhost:3001`, `cloneinsu.netlify.app`
- 컨트롤러별 `@CrossOrigin` 어노테이션

### 6.3 DTO
- `ClaimRequest` (입력) — 평탄화된 모든 폼 필드
- `ClaimResponse` (출력) — 중첩 구조 (`customer`, `insuranceCompany`, `account`, `signature`)

## 7. 환경변수

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```
- 운영: `https://cloneinsu-backend.onrender.com/api`

### Backend (`application.yml`)
```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/cloneinsu}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}
server:
  port: ${PORT:8080}
```
- 운영 환경변수는 Render에 설정

## 8. 테스트 전략

### 8.1 Vitest + React Testing Library
- 핵심 페이지 3개 (홈, 청구내역, 청구하기)
- 각 페이지마다 성공/실패 케이스 양쪽 작성
- 현재 34개 테스트 통과

### 8.2 백엔드 테스트
- (별도 작성 예정)

## 9. 배포 워크플로우

```
1. 로컬 개발 (frontend/backend)
   ↓
2. master 브랜치 commit + push
   ↓
3. GitHub master 푸시 감지
   ↓
4. 병렬 자동 배포:
   - Netlify: frontend 빌드 → CDN 업로드
   - Render: backend Docker 빌드 → 컨테이너 재시작
   ↓
5. 운영 사이트 갱신:
   - https://cloneinsu.netlify.app
   - https://cloneinsu-backend.onrender.com
```

## 10. 보안/주의사항

- 비밀번호: 평문 저장 안 됨 (환경변수)
- CORS: 명시적 origin만 허용
- `.env.local`: gitignore 처리
- Render Free 플랜: 15분 idle 후 sleep (첫 응답 30~50초 느림)
- Supabase Free: 500MB 한도

## 11. 마이그레이션 이력

| 일자 | 작업 |
|---|---|
| 2026-05-08 | 초기 설계 + Vite + React + 로컬 PostgreSQL |
| 2026-05-11~12 | DB 정규화 (customers/claims/account/signature 분리) |
| 2026-05-11 | Spring Boot CORS 전체 컨트롤러에 적용 |
| 2026-05-12 | CRA → Vite 마이그레이션 |
| 2026-05-12 | 클라우드 배포 (Netlify + Render + Supabase) |
| 2026-05-13 | Vite → Next.js 15 + TypeScript 마이그레이션 |
| 2026-05-13 | Vitest 도입, 핵심 페이지 테스트 작성 |

## 12. 알려진 제한사항

- 다크모드: Vite 버전에 있었으나 Next.js 마이그레이션 시 제외
- 첨부파일: 메타데이터만 저장, 실제 파일 업로드 미구현
- 인증/권한: 없음 (단일 사용자 가정)
- 결제: 없음
