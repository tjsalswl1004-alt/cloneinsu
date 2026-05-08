# cloneinsu 설계 문서

**날짜:** 2026-05-08  
**프로젝트:** FIELDARENA 보험금 청구 페이지 클론 코딩

---

## 개요

보험 설계사를 위한 보험금 청구 관리 플랫폼 "청구의 모든 것" 페이지를 클론 구현한다.  
간편 청구 접수 / 실시간 진행 현황 / 보험금 지급 확인 기능을 포함한다.

---

## 기술 스택

| 항목 | 선택 |
|------|------|
| 프론트엔드 | React (CRA), Tailwind CSS, axios |
| 백엔드 | Spring Boot 3.x, Gradle |
| 데이터베이스 | PostgreSQL |
| 상태 관리 | React Context API |
| 인증 | 없음 |
| 반응형 | 모바일 우선 (375px) → 데스크탑 대응 |

---

## 섹션 1: 전체 아키텍처

### 디렉토리 구조 (모노레포)

```
cloneinsu/
├── frontend/                  ← React (CRA, 기존 파일 이동)
│   ├── src/
│   │   ├── pages/             ← 라우트별 페이지 컴포넌트
│   │   ├── components/        ← 재사용 UI 컴포넌트
│   │   ├── services/          ← API 호출 함수 (axios)
│   │   └── data/              ← 1단계용 더미 데이터 JSON
│   └── package.json
│
└── backend/                   ← Spring Boot (Gradle)
    └── src/main/java/
        ├── controller/        ← REST API 엔드포인트
        ├── service/           ← 비즈니스 로직
        ├── repository/        ← JPA + PostgreSQL
        └── entity/            ← DB 테이블 매핑
```

### 통신 방식

```
React (port 3000) ↔ REST API ↔ Spring Boot (port 8080) ↔ PostgreSQL
```

---

## 섹션 2: 프론트엔드 화면 구성

### 주요 화면 (5개)

| 화면 | 경로 | 주요 내용 |
|------|------|-----------|
| 홈 (대시보드) | `/` | 인사말, 퀵메뉴 4개, 내 청구 현황 통계, 최근 청구 목록 |
| 청구하기 | `/claim/new` | 다단계 폼 (환자정보 → 병원정보 → 서류첨부 → 제출) |
| 청구내역 | `/claims` | 전체 청구 리스트, 상태 필터 (임시저장/발송완료/지급완료) |
| 서류안내 | `/documents` | 보험사별 필요 서류 안내 |
| 설정 | `/settings` | 사용자 정보 및 앱 설정 |

### 공통 컴포넌트

- `BottomNav` — 하단 탭 네비게이션
- `ClaimCard` — 청구 항목 카드 (이름, 날짜, 보험사, 상태 뱃지)
- `StatusBadge` — 상태 표시 뱃지 (DRAFT/SENT/PAID)
- `StatsSummary` — 총 지급액 + 바차트 + 원형 진행률

---

## 섹션 3: 백엔드 API 설계

### Claim 엔티티

| 필드 | 타입 | 설명 |
|------|------|------|
| id | Long | PK (auto increment) |
| patientName | String | 환자명 |
| insuranceCompany | String | 보험사명 |
| claimDate | LocalDate | 청구일 |
| amount | Long | 청구 금액 (원) |
| status | Enum | DRAFT / SENT / PAID |
| createdAt | LocalDateTime | 생성일시 |

### REST API 엔드포인트

| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/claims` | 전체 청구 목록 (status 쿼리 파라미터로 필터) |
| GET | `/api/claims/{id}` | 청구 단건 조회 |
| POST | `/api/claims` | 청구 신규 접수 |
| PUT | `/api/claims/{id}` | 청구 수정 |
| DELETE | `/api/claims/{id}` | 청구 삭제 |
| GET | `/api/claims/stats` | 통계 (총액, 전체/발송완료/지급완료 건수) |

**CORS 설정:** `http://localhost:3000` 허용 (개발 환경)

---

## 섹션 4: 개발 단계 및 데이터 흐름

### 단계별 진행 (방식 A: UI 우선)

```
1단계 — frontend agent
  - 모노레포 구조 셋업 (기존 파일 → frontend/ 이동)
  - Tailwind CSS 설치 및 설정
  - 더미 데이터 JSON 작성
  - 5개 화면 UI 구현 (반응형)

2단계 — backend agent
  - Spring Boot 프로젝트 생성 (backend/)
  - PostgreSQL 연결 설정 (application.yml)
  - Claim 엔티티 + JPA Repository 구현
  - REST API 구현 + CORS 설정

3단계 — frontend agent
  - axios 설치 및 services/claimService.js 작성
  - 더미 데이터 → 실제 API 호출로 교체
```

### 데이터 흐름 (3단계 완료 후)

```
사용자 액션
  → React 컴포넌트
  → services/claimService.js (axios)
  → GET/POST /api/claims
  → Spring Boot Controller
  → Service → Repository
  → PostgreSQL
  → 응답 → 화면 업데이트
```

### 에이전트 구조

```
메인 agent (오케스트레이터)
├── frontend agent  → frontend/ 폴더 담당
└── backend agent   → backend/ 폴더 담당
```
