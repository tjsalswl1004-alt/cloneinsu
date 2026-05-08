# cloneinsu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** FIELDARENA 보험금 청구 관리 페이지를 React + Spring Boot + PostgreSQL로 클론 구현한다.

**Architecture:** 모노레포(frontend/ + backend/) 구조로, 1단계에서 React UI를 더미 데이터로 완성하고, 2단계에서 Spring Boot REST API를 구현한 뒤, 3단계에서 프론트엔드를 실제 API에 연결한다.

**Tech Stack:** React 19 (CRA), React Router v6, Tailwind CSS v3, axios / Spring Boot 3.2, Gradle, JPA, PostgreSQL

---

## 파일 구조

```
cloneinsu/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── data/
│   │   │   └── dummyClaims.js
│   │   ├── components/
│   │   │   ├── BottomNav.jsx
│   │   │   ├── ClaimCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── StatsSummary.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ClaimNew.jsx
│   │   │   ├── Claims.jsx
│   │   │   ├── Documents.jsx
│   │   │   └── Settings.jsx
│   │   └── services/
│   │       └── claimService.js
│   ├── tailwind.config.js
│   └── package.json
└── backend/
    ├── build.gradle
    ├── settings.gradle
    └── src/
        ├── main/
        │   ├── java/com/cloneinsu/
        │   │   ├── CloneinsuApplication.java
        │   │   ├── entity/
        │   │   │   ├── Claim.java
        │   │   │   └── ClaimStatus.java
        │   │   ├── repository/
        │   │   │   └── ClaimRepository.java
        │   │   ├── dto/
        │   │   │   ├── ClaimRequest.java
        │   │   │   ├── ClaimResponse.java
        │   │   │   └── ClaimStatsResponse.java
        │   │   ├── service/
        │   │   │   └── ClaimService.java
        │   │   └── controller/
        │   │       └── ClaimController.java
        │   └── resources/
        │       └── application.yml
        └── test/
            └── java/com/cloneinsu/
                └── controller/
                    └── ClaimControllerTest.java
```

---

## Phase 0: 모노레포 셋업

### Task 1: 모노레포 구조로 재편

**Files:**
- Create: `frontend/` (기존 React 파일 이동)
- Create: `backend/` (빈 폴더)
- Modify: `.gitignore`

- [ ] **Step 1: frontend 폴더 생성 후 기존 React 파일 이동**

```powershell
cd C:\Users\minji\cloneinsu
New-Item -ItemType Directory -Name frontend
Move-Item src, public, package.json, package-lock.json, .gitignore -Destination frontend\
```

- [ ] **Step 2: 루트 .gitignore 생성**

`C:\Users\minji\cloneinsu\.gitignore` 파일 생성:

```
# frontend
frontend/node_modules/
frontend/build/

# backend
backend/build/
backend/.gradle/
backend/bin/

# IDE
.idea/
*.iml
.vscode/
```

- [ ] **Step 3: App.js → App.jsx 이름 변경**

```powershell
Rename-Item frontend\src\App.js frontend\src\App.jsx
Rename-Item frontend\src\App.test.js frontend\src\App.test.jsx
```

- [ ] **Step 4: backend 폴더 생성**

```powershell
New-Item -ItemType Directory -Name backend
```

- [ ] **Step 5: 동작 확인 후 커밋**

```powershell
cd frontend
npm install
npm start
```

브라우저에서 `http://localhost:3000` 접속 — 기본 React 화면 확인.

```powershell
cd ..
git add -A
git commit -m "chore: restructure as monorepo with frontend/ and backend/"
```

---

### Task 2: Tailwind CSS 설치

**Files:**
- Create: `frontend/tailwind.config.js`
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Tailwind CSS 설치**

```powershell
cd frontend
npm install -D tailwindcss
npx tailwindcss init
```

- [ ] **Step 2: tailwind.config.js 설정**

`frontend/tailwind.config.js`:

```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4F6EF7',
        'primary-dark': '#3B5BDB',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: index.css에 Tailwind 지시어 추가**

`frontend/src/index.css` 파일 상단을 다음으로 교체:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: App.jsx에서 Tailwind 동작 확인**

`frontend/src/App.jsx`:

```jsx
function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-2xl font-bold text-primary">cloneinsu</p>
    </div>
  );
}

export default App;
```

- [ ] **Step 5: 브라우저에서 파란색 텍스트 확인 후 커밋**

```powershell
npm start
```

`http://localhost:3000`에서 파란색 "cloneinsu" 텍스트 확인.

```powershell
git add -A
git commit -m "chore: install and configure Tailwind CSS"
```

---

## Phase 1: 프론트엔드 공통 컴포넌트

### Task 3: 더미 데이터 작성

**Files:**
- Create: `frontend/src/data/dummyClaims.js`

- [ ] **Step 1: data 폴더 생성 및 더미 데이터 작성**

`frontend/src/data/dummyClaims.js`:

```js
export const dummyClaims = [
  {
    id: 1,
    patientName: '이영희',
    insuranceCompany: '한화손해보험',
    insuranceLogoColor: '#FF6B35',
    claimDate: '2026-04-10',
    amount: 150000,
    status: 'DRAFT',
  },
  {
    id: 2,
    patientName: '김민수',
    insuranceCompany: '삼성생명',
    insuranceLogoColor: '#1428A0',
    claimDate: '2026-05-08',
    amount: 320000,
    status: 'SENT',
  },
  {
    id: 3,
    patientName: '이영희',
    insuranceCompany: 'DB손해보험',
    insuranceLogoColor: '#00843D',
    claimDate: '2026-05-08',
    amount: 280000,
    status: 'SENT',
  },
  {
    id: 4,
    patientName: '박지훈',
    insuranceCompany: '메리츠화재',
    insuranceLogoColor: '#E31937',
    claimDate: '2026-05-07',
    amount: 450000,
    status: 'PAID',
  },
  {
    id: 5,
    patientName: '최수연',
    insuranceCompany: '교보생명',
    insuranceLogoColor: '#003087',
    claimDate: '2026-05-06',
    amount: 890000,
    status: 'PAID',
  },
];

export const dummyStats = {
  totalAmount: 27790000,
  total: 15,
  sent: 12,
  paid: 10,
  completionRate: 80,
  monthlyAmounts: [8, 12, 6, 14, 10, 18, 22],
};

export const dummyUser = {
  name: '대표',
  todayClaimCount: 2,
};
```

- [ ] **Step 2: 커밋**

```powershell
git add frontend/src/data/dummyClaims.js
git commit -m "feat: add dummy claims data"
```

---

### Task 4: StatusBadge 컴포넌트

**Files:**
- Create: `frontend/src/components/StatusBadge.jsx`
- Test: `frontend/src/components/StatusBadge.test.jsx`

- [ ] **Step 1: 테스트 작성**

`frontend/src/components/StatusBadge.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

test('DRAFT 상태는 임시저장 텍스트를 보여준다', () => {
  render(<StatusBadge status="DRAFT" />);
  expect(screen.getByText('임시저장')).toBeInTheDocument();
});

test('SENT 상태는 발송완료 텍스트를 보여준다', () => {
  render(<StatusBadge status="SENT" />);
  expect(screen.getByText('발송완료')).toBeInTheDocument();
});

test('PAID 상태는 지급완료 텍스트를 보여준다', () => {
  render(<StatusBadge status="PAID" />);
  expect(screen.getByText('지급완료')).toBeInTheDocument();
});
```

- [ ] **Step 2: 테스트 실패 확인**

```powershell
cd frontend
npm test -- --watchAll=false --testPathPattern=StatusBadge
```

Expected: FAIL (StatusBadge.jsx not found)

- [ ] **Step 3: StatusBadge 구현**

`frontend/src/components/StatusBadge.jsx`:

```jsx
const STATUS_CONFIG = {
  DRAFT: { label: '임시저장', className: 'bg-yellow-100 text-yellow-700' },
  SENT:  { label: '발송완료', className: 'bg-blue-100 text-blue-700' },
  PAID:  { label: '지급완료', className: 'bg-green-100 text-green-700' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```powershell
npm test -- --watchAll=false --testPathPattern=StatusBadge
```

Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```powershell
git add frontend/src/components/
git commit -m "feat: add StatusBadge component"
```

---

### Task 5: ClaimCard 컴포넌트

**Files:**
- Create: `frontend/src/components/ClaimCard.jsx`
- Test: `frontend/src/components/ClaimCard.test.jsx`

- [ ] **Step 1: 테스트 작성**

`frontend/src/components/ClaimCard.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import ClaimCard from './ClaimCard';

const claim = {
  id: 1,
  patientName: '이영희',
  insuranceCompany: '한화손해보험',
  insuranceLogoColor: '#FF6B35',
  claimDate: '2026-04-10',
  amount: 150000,
  status: 'DRAFT',
};

test('환자명을 보여준다', () => {
  render(<ClaimCard claim={claim} />);
  expect(screen.getByText('이영희')).toBeInTheDocument();
});

test('보험사명을 보여준다', () => {
  render(<ClaimCard claim={claim} />);
  expect(screen.getByText(/한화손해보험/)).toBeInTheDocument();
});

test('임시저장 뱃지를 보여준다', () => {
  render(<ClaimCard claim={claim} />);
  expect(screen.getByText('임시저장')).toBeInTheDocument();
});
```

- [ ] **Step 2: 테스트 실패 확인**

```powershell
npm test -- --watchAll=false --testPathPattern=ClaimCard
```

Expected: FAIL

- [ ] **Step 3: ClaimCard 구현**

`frontend/src/components/ClaimCard.jsx`:

```jsx
import StatusBadge from './StatusBadge';

const COMPANY_COLORS = {
  '한화손해보험': '#FF6B35',
  '삼성생명':     '#1428A0',
  'DB손해보험':   '#00843D',
  '메리츠화재':   '#E31937',
  '교보생명':     '#003087',
  '현대해상':     '#FF6600',
};

export default function ClaimCard({ claim }) {
  const { patientName, insuranceCompany, insuranceLogoColor, claimDate, status } = claim;
  const logoColor = insuranceLogoColor ?? COMPANY_COLORS[insuranceCompany] ?? '#4F6EF7';
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: logoColor }}
        >
          {insuranceCompany.slice(0, 2)}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{patientName}</p>
          <p className="text-sm text-gray-500">
            {claimDate} · {insuranceCompany}
          </p>
        </div>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```powershell
npm test -- --watchAll=false --testPathPattern=ClaimCard
```

Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```powershell
git add frontend/src/components/ClaimCard.jsx frontend/src/components/ClaimCard.test.jsx
git commit -m "feat: add ClaimCard component"
```

---

### Task 6: StatsSummary 컴포넌트

**Files:**
- Create: `frontend/src/components/StatsSummary.jsx`
- Test: `frontend/src/components/StatsSummary.test.jsx`

- [ ] **Step 1: 테스트 작성**

`frontend/src/components/StatsSummary.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import StatsSummary from './StatsSummary';

const stats = {
  totalAmount: 27790000,
  total: 15,
  sent: 12,
  paid: 10,
  completionRate: 80,
  monthlyAmounts: [8, 12, 6, 14, 10, 18, 22],
};

test('총 지급액을 포맷팅하여 보여준다', () => {
  render(<StatsSummary stats={stats} />);
  expect(screen.getByText('27,790,000원')).toBeInTheDocument();
});

test('완료율 퍼센트를 보여준다', () => {
  render(<StatsSummary stats={stats} />);
  expect(screen.getByText('80%')).toBeInTheDocument();
});
```

- [ ] **Step 2: 테스트 실패 확인**

```powershell
npm test -- --watchAll=false --testPathPattern=StatsSummary
```

Expected: FAIL

- [ ] **Step 3: StatsSummary 구현**

`frontend/src/components/StatsSummary.jsx`:

```jsx
export default function StatsSummary({ stats }) {
  const { totalAmount, completionRate, monthlyAmounts } = stats;
  const maxVal = Math.max(...monthlyAmounts);

  const circumference = 2 * Math.PI * 30;
  const strokeDashoffset = circumference * (1 - completionRate / 100);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-5 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-1">TOTAL CLAIMS PAID</p>
        <p className="text-2xl font-bold text-blue-600">
          {totalAmount.toLocaleString()}원
        </p>
        <div className="flex items-end gap-1 mt-3 h-10">
          {monthlyAmounts.map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-blue-300 rounded-sm opacity-70"
              style={{ height: `${(val / maxVal) * 100}%` }}
            />
          ))}
        </div>
      </div>
      <div className="ml-4">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="30" fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="40" cy="40" r="30"
            fill="none"
            stroke="#4F6EF7"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 40 40)"
          />
          <text x="40" y="44" textAnchor="middle" className="text-sm font-bold" fill="#4F6EF7" fontSize="14">
            {completionRate}%
          </text>
        </svg>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```powershell
npm test -- --watchAll=false --testPathPattern=StatsSummary
```

Expected: PASS (2 tests)

- [ ] **Step 5: 커밋**

```powershell
git add frontend/src/components/StatsSummary.jsx frontend/src/components/StatsSummary.test.jsx
git commit -m "feat: add StatsSummary component"
```

---

### Task 7: BottomNav + 라우팅 설정

**Files:**
- Create: `frontend/src/components/BottomNav.jsx`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/package.json` (react-router-dom 추가)

- [ ] **Step 1: react-router-dom 설치**

```powershell
npm install react-router-dom
```

- [ ] **Step 2: BottomNav 구현**

`frontend/src/components/BottomNav.jsx`:

```jsx
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',          label: '홈',     icon: '🏠' },
  { path: '/claims',    label: '청구내역', icon: '📄' },
  { path: '/claim/new', label: '',        icon: '+', isCenter: true },
  { path: '/documents', label: '서류안내', icon: '📁' },
  { path: '/settings',  label: '설정',    icon: '⚙️' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around h-16 max-w-lg mx-auto px-2 z-50">
      {NAV_ITEMS.map((item) =>
        item.isCenter ? (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-light shadow-lg -mt-4"
          >
            {item.icon}
          </button>
        ) : (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 text-xs ${
              pathname === item.path ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        )
      )}
    </nav>
  );
}
```

- [ ] **Step 3: App.jsx에 라우팅 설정**

`frontend/src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ClaimNew from './pages/ClaimNew';
import Claims from './pages/Claims';
import Documents from './pages/Documents';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 max-w-lg mx-auto pb-20">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/claim/new"  element={<ClaimNew />} />
          <Route path="/claims"     element={<Claims />} />
          <Route path="/documents"  element={<Documents />} />
          <Route path="/settings"   element={<Settings />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
```

- [ ] **Step 4: 페이지 플레이스홀더 생성 (빌드 에러 방지)**

`frontend/src/pages/Home.jsx`:
```jsx
export default function Home() { return <div className="p-4">홈</div>; }
```

`frontend/src/pages/ClaimNew.jsx`:
```jsx
export default function ClaimNew() { return <div className="p-4">청구하기</div>; }
```

`frontend/src/pages/Claims.jsx`:
```jsx
export default function Claims() { return <div className="p-4">청구내역</div>; }
```

`frontend/src/pages/Documents.jsx`:
```jsx
export default function Documents() { return <div className="p-4">서류안내</div>; }
```

`frontend/src/pages/Settings.jsx`:
```jsx
export default function Settings() { return <div className="p-4">설정</div>; }
```

- [ ] **Step 5: 브라우저에서 탭 네비게이션 동작 확인 후 커밋**

```powershell
npm start
```

하단 탭 클릭 시 URL 변경 확인.

```powershell
git add -A
git commit -m "feat: add BottomNav and routing setup"
```

---

## Phase 2: 프론트엔드 페이지 구현

### Task 8: 홈 페이지

**Files:**
- Modify: `frontend/src/pages/Home.jsx`
- Test: `frontend/src/pages/Home.test.jsx`

- [ ] **Step 1: 테스트 작성**

`frontend/src/pages/Home.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

test('사용자 이름 인사말을 보여준다', () => {
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(screen.getByText(/안녕하세요/)).toBeInTheDocument();
});

test('퀵메뉴 4개를 보여준다', () => {
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(screen.getByText('청구하기')).toBeInTheDocument();
  expect(screen.getByText('청구내역')).toBeInTheDocument();
  expect(screen.getByText('서류안내')).toBeInTheDocument();
  expect(screen.getByText('실비계산기')).toBeInTheDocument();
});

test('내 청구 현황 섹션을 보여준다', () => {
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(screen.getByText('내 청구 현황')).toBeInTheDocument();
});

test('최근 청구 섹션을 보여준다', () => {
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(screen.getByText('최근 청구')).toBeInTheDocument();
});
```

- [ ] **Step 2: 테스트 실패 확인**

```powershell
npm test -- --watchAll=false --testPathPattern=pages/Home
```

Expected: FAIL

- [ ] **Step 3: Home 페이지 구현**

`frontend/src/pages/Home.jsx`:

```jsx
import { useNavigate } from 'react-router-dom';
import { dummyClaims, dummyStats, dummyUser } from '../data/dummyClaims';
import StatsSummary from '../components/StatsSummary';
import ClaimCard from '../components/ClaimCard';

const QUICK_MENUS = [
  { label: '청구하기', icon: '➕', path: '/claim/new', primary: true },
  { label: '청구내역', icon: '📄', path: '/claims' },
  { label: '서류안내', icon: '📋', path: '/documents' },
  { label: '실비계산기', icon: '🧮', path: null },
];

export default function Home() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
  const recentClaims = dummyClaims.slice(0, 3);

  return (
    <div className="p-4 space-y-4">
      {/* 헤더 인사말 */}
      <div className="bg-white rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{today}</p>
          <h1 className="text-xl font-bold text-gray-900 mt-1">
            {dummyUser.name}님, 안녕하세요
          </h1>
          <p className="text-sm text-primary mt-1">
            ● 오늘 {dummyUser.todayClaimCount}건 청구했어요
          </p>
        </div>
        <div className="text-5xl">🧑‍💼</div>
      </div>

      {/* 퀵메뉴 */}
      <div className="bg-white rounded-2xl p-4 grid grid-cols-4 gap-2">
        {QUICK_MENUS.map((menu) => (
          <button
            key={menu.label}
            onClick={() => menu.path && navigate(menu.path)}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
              menu.primary ? 'bg-primary text-white' : 'bg-gray-100'
            }`}>
              {menu.icon}
            </div>
            <span className="text-xs text-gray-600">{menu.label}</span>
          </button>
        ))}
      </div>

      {/* 내 청구 현황 */}
      <div className="bg-white rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-900">내 청구 현황</h2>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1 rounded-full bg-primary text-white">내 청구</button>
            <button className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">전체 회원</button>
          </div>
        </div>
        <StatsSummary stats={dummyStats} />
        <div className="flex justify-around mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{dummyStats.total}<span className="text-sm font-normal">건</span></p>
            <p className="text-xs text-gray-500">전체</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">{dummyStats.sent}<span className="text-sm font-normal">건</span></p>
            <p className="text-xs text-gray-500">발송완료</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">{dummyStats.paid}<span className="text-sm font-normal">건</span></p>
            <p className="text-xs text-gray-500">지급완료</p>
          </div>
        </div>
      </div>

      {/* 최근 청구 */}
      <div className="bg-white rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-gray-900">최근 청구</h2>
          <button onClick={() => navigate('/claims')} className="text-xs text-primary">더보기 &gt;</button>
        </div>
        {recentClaims.map((claim) => (
          <ClaimCard key={claim.id} claim={claim} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```powershell
npm test -- --watchAll=false --testPathPattern=pages/Home
```

Expected: PASS (4 tests)

- [ ] **Step 5: 커밋**

```powershell
git add frontend/src/pages/Home.jsx frontend/src/pages/Home.test.jsx
git commit -m "feat: implement Home dashboard page"
```

---

### Task 9: 청구내역 페이지

**Files:**
- Modify: `frontend/src/pages/Claims.jsx`
- Test: `frontend/src/pages/Claims.test.jsx`

- [ ] **Step 1: 테스트 작성**

`frontend/src/pages/Claims.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Claims from './Claims';

test('전체 청구 목록을 보여준다', () => {
  render(<MemoryRouter><Claims /></MemoryRouter>);
  expect(screen.getAllByText(/이영희|김민수|박지훈|최수연/).length).toBeGreaterThan(0);
});

test('전체 필터 탭이 기본으로 선택된다', () => {
  render(<MemoryRouter><Claims /></MemoryRouter>);
  expect(screen.getByRole('button', { name: '전체' })).toHaveClass('bg-primary');
});

test('발송완료 탭 클릭 시 SENT 항목만 보인다', () => {
  render(<MemoryRouter><Claims /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: '발송완료' }));
  expect(screen.queryByText('임시저장')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: 테스트 실패 확인**

```powershell
npm test -- --watchAll=false --testPathPattern=pages/Claims
```

Expected: FAIL

- [ ] **Step 3: Claims 페이지 구현**

`frontend/src/pages/Claims.jsx`:

```jsx
import { useState } from 'react';
import { dummyClaims } from '../data/dummyClaims';
import ClaimCard from '../components/ClaimCard';

const FILTERS = [
  { label: '전체', value: null },
  { label: '임시저장', value: 'DRAFT' },
  { label: '발송완료', value: 'SENT' },
  { label: '지급완료', value: 'PAID' },
];

export default function Claims() {
  const [activeFilter, setActiveFilter] = useState(null);

  const filtered = activeFilter
    ? dummyClaims.filter((c) => c.status === activeFilter)
    : dummyClaims;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-900 mb-4">청구내역</h1>

      {/* 필터 탭 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {FILTERS.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setActiveFilter(value)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              activeFilter === value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 청구 목록 */}
      <div className="bg-white rounded-2xl p-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-8">청구 내역이 없습니다</p>
        ) : (
          filtered.map((claim) => <ClaimCard key={claim.id} claim={claim} />)
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```powershell
npm test -- --watchAll=false --testPathPattern=pages/Claims
```

Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```powershell
git add frontend/src/pages/Claims.jsx frontend/src/pages/Claims.test.jsx
git commit -m "feat: implement Claims list page with status filter"
```

---

### Task 10: 청구하기 페이지 (다단계 폼)

**Files:**
- Modify: `frontend/src/pages/ClaimNew.jsx`
- Test: `frontend/src/pages/ClaimNew.test.jsx`

- [ ] **Step 1: 테스트 작성**

`frontend/src/pages/ClaimNew.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ClaimNew from './ClaimNew';

test('1단계 환자정보 폼이 처음에 보인다', () => {
  render(<MemoryRouter><ClaimNew /></MemoryRouter>);
  expect(screen.getByText('환자 정보')).toBeInTheDocument();
});

test('환자명 입력 후 다음 버튼 클릭 시 2단계로 이동한다', () => {
  render(<MemoryRouter><ClaimNew /></MemoryRouter>);
  fireEvent.change(screen.getByPlaceholderText('환자명 입력'), { target: { value: '홍길동' } });
  fireEvent.click(screen.getByText('다음'));
  expect(screen.getByText('병원 정보')).toBeInTheDocument();
});

test('진행 단계 표시기가 보인다', () => {
  render(<MemoryRouter><ClaimNew /></MemoryRouter>);
  expect(screen.getByText('1 / 3')).toBeInTheDocument();
});
```

- [ ] **Step 2: 테스트 실패 확인**

```powershell
npm test -- --watchAll=false --testPathPattern=pages/ClaimNew
```

Expected: FAIL

- [ ] **Step 3: ClaimNew 구현**

`frontend/src/pages/ClaimNew.jsx`:

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INSURANCE_COMPANIES = ['한화손해보험', '삼성생명', 'DB손해보험', '메리츠화재', '교보생명', '현대해상'];

export default function ClaimNew() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    patientName: '',
    birthDate: '',
    phone: '',
    hospitalName: '',
    treatmentDate: '',
    amount: '',
    insuranceCompany: '',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = () => {
    alert('청구가 접수되었습니다.');
    navigate('/claims');
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="text-gray-600">
          ← 
        </button>
        <h1 className="text-xl font-bold text-gray-900 flex-1">청구하기</h1>
        <span className="text-sm text-gray-400">{step} / 3</span>
      </div>

      {/* 진행 바 */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
        <div
          className="bg-primary h-1.5 rounded-full transition-all"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-bold text-gray-800">환자 정보</h2>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">환자명</label>
            <input
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              placeholder="환자명 입력"
              value={form.patientName}
              onChange={update('patientName')}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">생년월일</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              value={form.birthDate}
              onChange={update('birthDate')}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">연락처</label>
            <input
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={update('phone')}
            />
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!form.patientName}
            className="w-full bg-primary text-white py-4 rounded-2xl font-semibold disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-bold text-gray-800">병원 정보</h2>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">병원명</label>
            <input
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              placeholder="병원명 입력"
              value={form.hospitalName}
              onChange={update('hospitalName')}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">진료일</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              value={form.treatmentDate}
              onChange={update('treatmentDate')}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">청구 금액</label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              placeholder="금액 입력 (원)"
              value={form.amount}
              onChange={update('amount')}
            />
          </div>
          <button
            onClick={() => setStep(3)}
            disabled={!form.hospitalName}
            className="w-full bg-primary text-white py-4 rounded-2xl font-semibold disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-bold text-gray-800">보험사 선택 및 제출</h2>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">보험사</label>
            <select
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary"
              value={form.insuranceCompany}
              onChange={update('insuranceCompany')}
            >
              <option value="">보험사 선택</option>
              {INSURANCE_COMPANIES.map((co) => (
                <option key={co} value={co}>{co}</option>
              ))}
            </select>
          </div>

          {/* 요약 */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            <p className="text-sm"><span className="text-gray-500">환자명:</span> {form.patientName}</p>
            <p className="text-sm"><span className="text-gray-500">병원명:</span> {form.hospitalName}</p>
            <p className="text-sm"><span className="text-gray-500">진료일:</span> {form.treatmentDate}</p>
            <p className="text-sm"><span className="text-gray-500">금액:</span> {Number(form.amount).toLocaleString()}원</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.insuranceCompany}
            className="w-full bg-primary text-white py-4 rounded-2xl font-semibold disabled:opacity-40"
          >
            청구 접수하기
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

```powershell
npm test -- --watchAll=false --testPathPattern=pages/ClaimNew
```

Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```powershell
git add frontend/src/pages/ClaimNew.jsx frontend/src/pages/ClaimNew.test.jsx
git commit -m "feat: implement multi-step ClaimNew form"
```

---

### Task 11: 서류안내 & 설정 페이지

**Files:**
- Modify: `frontend/src/pages/Documents.jsx`
- Modify: `frontend/src/pages/Settings.jsx`

- [ ] **Step 1: Documents 구현**

`frontend/src/pages/Documents.jsx`:

```jsx
const DOCUMENTS = [
  {
    company: '한화손해보험',
    color: '#FF6B35',
    docs: ['진단서 또는 소견서', '진료비 영수증', '진료비 세부내역서', '통장 사본'],
  },
  {
    company: '삼성생명',
    color: '#1428A0',
    docs: ['진단서 (원본)', '입퇴원 확인서', '진료비 납입 영수증', '주민등록등본'],
  },
  {
    company: 'DB손해보험',
    color: '#00843D',
    docs: ['진료 확인서', '진료비 영수증', '진료비 세부내역서'],
  },
];

export default function Documents() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-900 mb-4">서류안내</h1>
      <div className="space-y-3">
        {DOCUMENTS.map(({ company, color, docs }) => (
          <div key={company} className="bg-white rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: color }}
              >
                {company.slice(0, 2)}
              </div>
              <h2 className="font-semibold text-gray-900">{company}</h2>
            </div>
            <ul className="space-y-1">
              {docs.map((doc) => (
                <li key={doc} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-primary">•</span> {doc}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Settings 구현**

`frontend/src/pages/Settings.jsx`:

```jsx
const SETTINGS_ITEMS = [
  { label: '알림 설정', icon: '🔔' },
  { label: '개인정보 처리방침', icon: '🔒' },
  { label: '이용약관', icon: '📃' },
  { label: '앱 버전', icon: 'ℹ️', value: 'v1.0.0' },
];

export default function Settings() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-900 mb-4">설정</h1>
      <div className="bg-white rounded-2xl p-4 mb-3">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
            👤
          </div>
          <div>
            <p className="font-bold text-gray-900">대표님</p>
            <p className="text-sm text-gray-500">보험 설계사</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl divide-y divide-gray-100">
        {SETTINGS_ITEMS.map(({ label, icon, value }) => (
          <div key={label} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span>{icon}</span>
              <span className="text-gray-800">{label}</span>
            </div>
            <span className="text-gray-400 text-sm">{value ?? '>'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 전체 화면 동작 확인 후 커밋**

```powershell
npm start
```

5개 탭 모두 클릭하며 화면 확인.

```powershell
git add frontend/src/pages/Documents.jsx frontend/src/pages/Settings.jsx
git commit -m "feat: implement Documents and Settings pages"
```

---

## Phase 3: 백엔드 구현

### Task 12: Spring Boot 프로젝트 생성

**Files:**
- Create: `backend/build.gradle`
- Create: `backend/settings.gradle`
- Create: `backend/src/main/java/com/cloneinsu/CloneinsuApplication.java`
- Create: `backend/src/main/resources/application.yml`

- [ ] **Step 1: Spring Initializr에서 프로젝트 생성**

브라우저에서 `https://start.spring.io` 접속 후:
- Project: Gradle - Groovy
- Language: Java
- Spring Boot: 3.2.x
- Group: `com.cloneinsu`
- Artifact: `backend`
- Packaging: Jar
- Java: 17
- Dependencies: Spring Web, Spring Data JPA, PostgreSQL Driver, Lombok

Generate 후 `backend/` 폴더 내용으로 압축 해제.

또는 아래 파일을 직접 생성:

`backend/settings.gradle`:
```groovy
rootProject.name = 'backend'
```

`backend/build.gradle`:
```groovy
plugins {
    id 'org.springframework.boot' version '3.2.5'
    id 'io.spring.dependency-management' version '1.1.4'
    id 'java'
}

group = 'com.cloneinsu'
version = '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = '17'
}

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly 'org.postgresql:postgresql'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

- [ ] **Step 2: 메인 클래스 생성**

`backend/src/main/java/com/cloneinsu/CloneinsuApplication.java`:

```java
package com.cloneinsu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CloneinsuApplication {
    public static void main(String[] args) {
        SpringApplication.run(CloneinsuApplication.class, args);
    }
}
```

- [ ] **Step 3: application.yml 설정**

`backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/cloneinsu
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect

server:
  port: 8080
```

- [ ] **Step 4: PostgreSQL 데이터베이스 생성**

PostgreSQL이 실행 중인 상태에서:

```powershell
psql -U postgres -c "CREATE DATABASE cloneinsu;"
```

- [ ] **Step 5: 빌드 확인 후 커밋**

```powershell
cd backend
./gradlew build -x test
```

Expected: BUILD SUCCESSFUL

```powershell
cd ..
git add backend/
git commit -m "chore: add Spring Boot backend project setup"
```

---

### Task 13: Claim 엔티티 및 Repository

**Files:**
- Create: `backend/src/main/java/com/cloneinsu/entity/ClaimStatus.java`
- Create: `backend/src/main/java/com/cloneinsu/entity/Claim.java`
- Create: `backend/src/main/java/com/cloneinsu/repository/ClaimRepository.java`

- [ ] **Step 1: ClaimStatus enum 생성**

`backend/src/main/java/com/cloneinsu/entity/ClaimStatus.java`:

```java
package com.cloneinsu.entity;

public enum ClaimStatus {
    DRAFT, SENT, PAID
}
```

- [ ] **Step 2: Claim 엔티티 생성**

`backend/src/main/java/com/cloneinsu/entity/Claim.java`:

```java
package com.cloneinsu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private String insuranceCompany;

    private LocalDate claimDate;

    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = ClaimStatus.DRAFT;
    }
}
```

- [ ] **Step 3: ClaimRepository 생성**

`backend/src/main/java/com/cloneinsu/repository/ClaimRepository.java`:

```java
package com.cloneinsu.repository;

import com.cloneinsu.entity.Claim;
import com.cloneinsu.entity.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByStatusOrderByCreatedAtDesc(ClaimStatus status);
    List<Claim> findAllByOrderByCreatedAtDesc();
    long countByStatus(ClaimStatus status);
}
```

- [ ] **Step 4: 애플리케이션 실행 후 테이블 자동 생성 확인**

```powershell
cd backend
./gradlew bootRun
```

PostgreSQL에서 확인:
```powershell
psql -U postgres -d cloneinsu -c "\dt"
```

Expected: `claims` 테이블 생성 확인

- [ ] **Step 5: 커밋**

```powershell
cd ..
git add backend/src/
git commit -m "feat: add Claim entity and ClaimRepository"
```

---

### Task 14: DTO 및 ClaimService

**Files:**
- Create: `backend/src/main/java/com/cloneinsu/dto/ClaimRequest.java`
- Create: `backend/src/main/java/com/cloneinsu/dto/ClaimResponse.java`
- Create: `backend/src/main/java/com/cloneinsu/dto/ClaimStatsResponse.java`
- Create: `backend/src/main/java/com/cloneinsu/service/ClaimService.java`

- [ ] **Step 1: ClaimRequest DTO**

`backend/src/main/java/com/cloneinsu/dto/ClaimRequest.java`:

```java
package com.cloneinsu.dto;

import com.cloneinsu.entity.ClaimStatus;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter @Setter
public class ClaimRequest {
    private String patientName;
    private String insuranceCompany;
    private LocalDate claimDate;
    private Long amount;
    private ClaimStatus status;
}
```

- [ ] **Step 2: ClaimResponse DTO**

`backend/src/main/java/com/cloneinsu/dto/ClaimResponse.java`:

```java
package com.cloneinsu.dto;

import com.cloneinsu.entity.Claim;
import com.cloneinsu.entity.ClaimStatus;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class ClaimResponse {
    private final Long id;
    private final String patientName;
    private final String insuranceCompany;
    private final LocalDate claimDate;
    private final Long amount;
    private final ClaimStatus status;
    private final LocalDateTime createdAt;

    public ClaimResponse(Claim claim) {
        this.id = claim.getId();
        this.patientName = claim.getPatientName();
        this.insuranceCompany = claim.getInsuranceCompany();
        this.claimDate = claim.getClaimDate();
        this.amount = claim.getAmount();
        this.status = claim.getStatus();
        this.createdAt = claim.getCreatedAt();
    }
}
```

- [ ] **Step 3: ClaimStatsResponse DTO**

`backend/src/main/java/com/cloneinsu/dto/ClaimStatsResponse.java`:

```java
package com.cloneinsu.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class ClaimStatsResponse {
    private final long totalAmount;
    private final long total;
    private final long sent;
    private final long paid;
    private final int completionRate;
}
```

- [ ] **Step 4: ClaimService 구현**

`backend/src/main/java/com/cloneinsu/service/ClaimService.java`:

```java
package com.cloneinsu.service;

import com.cloneinsu.dto.ClaimRequest;
import com.cloneinsu.dto.ClaimResponse;
import com.cloneinsu.dto.ClaimStatsResponse;
import com.cloneinsu.entity.Claim;
import com.cloneinsu.entity.ClaimStatus;
import com.cloneinsu.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;

    public List<ClaimResponse> getClaims(ClaimStatus status) {
        List<Claim> claims = status != null
            ? claimRepository.findByStatusOrderByCreatedAtDesc(status)
            : claimRepository.findAllByOrderByCreatedAtDesc();
        return claims.stream().map(ClaimResponse::new).toList();
    }

    public ClaimResponse getClaim(Long id) {
        Claim claim = claimRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Claim not found: " + id));
        return new ClaimResponse(claim);
    }

    public ClaimResponse createClaim(ClaimRequest request) {
        Claim claim = Claim.builder()
            .patientName(request.getPatientName())
            .insuranceCompany(request.getInsuranceCompany())
            .claimDate(request.getClaimDate())
            .amount(request.getAmount())
            .status(request.getStatus() != null ? request.getStatus() : ClaimStatus.DRAFT)
            .build();
        return new ClaimResponse(claimRepository.save(claim));
    }

    public ClaimResponse updateClaim(Long id, ClaimRequest request) {
        Claim claim = claimRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Claim not found: " + id));
        claim.setPatientName(request.getPatientName());
        claim.setInsuranceCompany(request.getInsuranceCompany());
        claim.setClaimDate(request.getClaimDate());
        claim.setAmount(request.getAmount());
        if (request.getStatus() != null) claim.setStatus(request.getStatus());
        return new ClaimResponse(claimRepository.save(claim));
    }

    public void deleteClaim(Long id) {
        claimRepository.deleteById(id);
    }

    public ClaimStatsResponse getStats() {
        List<Claim> all = claimRepository.findAllByOrderByCreatedAtDesc();
        long totalAmount = all.stream().mapToLong(c -> c.getAmount() != null ? c.getAmount() : 0).sum();
        long total = all.size();
        long sent = claimRepository.countByStatus(ClaimStatus.SENT);
        long paid = claimRepository.countByStatus(ClaimStatus.PAID);
        int completionRate = total == 0 ? 0 : (int) ((sent * 100) / total);
        return new ClaimStatsResponse(totalAmount, total, sent, paid, completionRate);
    }
}
```

- [ ] **Step 5: 커밋**

```powershell
git add backend/src/
git commit -m "feat: add DTOs and ClaimService"
```

---

### Task 15: ClaimController + CORS + 테스트

**Files:**
- Create: `backend/src/main/java/com/cloneinsu/controller/ClaimController.java`
- Create: `backend/src/test/java/com/cloneinsu/controller/ClaimControllerTest.java`

- [ ] **Step 1: 테스트 작성**

`backend/src/test/java/com/cloneinsu/controller/ClaimControllerTest.java`:

```java
package com.cloneinsu.controller;

import com.cloneinsu.dto.ClaimResponse;
import com.cloneinsu.service.ClaimService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClaimController.class)
class ClaimControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ClaimService claimService;

    @Test
    void getClaims_returns200() throws Exception {
        when(claimService.getClaims(null)).thenReturn(List.of());

        mockMvc.perform(get("/api/claims"))
               .andExpect(status().isOk())
               .andExpect(content().contentType("application/json"));
    }

    @Test
    void getStats_returns200() throws Exception {
        when(claimService.getStats()).thenReturn(
            new com.cloneinsu.dto.ClaimStatsResponse(0L, 0L, 0L, 0L, 0)
        );

        mockMvc.perform(get("/api/claims/stats"))
               .andExpect(status().isOk());
    }
}
```

- [ ] **Step 2: 테스트 실패 확인**

```powershell
cd backend
./gradlew test --tests "com.cloneinsu.controller.ClaimControllerTest"
```

Expected: FAIL (ClaimController not found)

- [ ] **Step 3: ClaimController 구현**

`backend/src/main/java/com/cloneinsu/controller/ClaimController.java`:

```java
package com.cloneinsu.controller;

import com.cloneinsu.dto.ClaimRequest;
import com.cloneinsu.dto.ClaimResponse;
import com.cloneinsu.dto.ClaimStatsResponse;
import com.cloneinsu.entity.ClaimStatus;
import com.cloneinsu.service.ClaimService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @GetMapping
    public List<ClaimResponse> getClaims(
        @RequestParam(required = false) ClaimStatus status
    ) {
        return claimService.getClaims(status);
    }

    @GetMapping("/stats")
    public ClaimStatsResponse getStats() {
        return claimService.getStats();
    }

    @GetMapping("/{id}")
    public ClaimResponse getClaim(@PathVariable Long id) {
        return claimService.getClaim(id);
    }

    @PostMapping
    public ResponseEntity<ClaimResponse> createClaim(@RequestBody ClaimRequest request) {
        return ResponseEntity.ok(claimService.createClaim(request));
    }

    @PutMapping("/{id}")
    public ClaimResponse updateClaim(@PathVariable Long id, @RequestBody ClaimRequest request) {
        return claimService.updateClaim(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
        return ResponseEntity.noContent().build();
    }
}
```

- [ ] **Step 4: 테스트 통과 확인**

```powershell
./gradlew test --tests "com.cloneinsu.controller.ClaimControllerTest"
```

Expected: PASS (2 tests)

- [ ] **Step 5: API 동작 확인 (서버 실행 후)**

```powershell
./gradlew bootRun
```

다른 터미널에서:
```powershell
curl http://localhost:8080/api/claims
```

Expected: `[]` (빈 배열)

- [ ] **Step 6: 커밋**

```powershell
cd ..
git add backend/src/
git commit -m "feat: add ClaimController with CORS and REST endpoints"
```

---

## Phase 4: API 연동

### Task 16: axios 설치 및 claimService.js

**Files:**
- Create: `frontend/src/services/claimService.js`

- [ ] **Step 1: axios 설치**

```powershell
cd frontend
npm install axios
```

- [ ] **Step 2: claimService.js 작성**

`frontend/src/services/claimService.js`:

```js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

export const claimService = {
  getAll: (status) =>
    api.get('/claims', { params: status ? { status } : {} }).then((r) => r.data),

  getById: (id) =>
    api.get(`/claims/${id}`).then((r) => r.data),

  create: (data) =>
    api.post('/claims', data).then((r) => r.data),

  update: (id, data) =>
    api.put(`/claims/${id}`, data).then((r) => r.data),

  remove: (id) =>
    api.delete(`/claims/${id}`),

  getStats: () =>
    api.get('/claims/stats').then((r) => r.data),
};
```

- [ ] **Step 3: 커밋**

```powershell
git add frontend/src/services/claimService.js
git commit -m "feat: add claimService with axios"
```

---

### Task 17: Home 페이지 API 연동

**Files:**
- Modify: `frontend/src/pages/Home.jsx`

- [ ] **Step 1: Home.jsx를 API 호출로 교체**

`frontend/src/pages/Home.jsx`의 상단 import와 데이터 로딩 부분을 교체:

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimService } from '../services/claimService';
import StatsSummary from '../components/StatsSummary';
import ClaimCard from '../components/ClaimCard';

const QUICK_MENUS = [
  { label: '청구하기', icon: '➕', path: '/claim/new', primary: true },
  { label: '청구내역', icon: '📄', path: '/claims' },
  { label: '서류안내', icon: '📋', path: '/documents' },
  { label: '실비계산기', icon: '🧮', path: null },
];

export default function Home() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState(null);
  const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });

  useEffect(() => {
    claimService.getAll().then(setClaims).catch(console.error);
    claimService.getStats().then(setStats).catch(console.error);
  }, []);

  const recentClaims = claims.slice(0, 3);
  const todayCount = claims.filter(
    (c) => c.claimDate === new Date().toISOString().split('T')[0]
  ).length;

  return (
    <div className="p-4 space-y-4">
      {/* 헤더 인사말 */}
      <div className="bg-white rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{today}</p>
          <h1 className="text-xl font-bold text-gray-900 mt-1">대표님, 안녕하세요</h1>
          <p className="text-sm text-primary mt-1">● 오늘 {todayCount}건 청구했어요</p>
        </div>
        <div className="text-5xl">🧑‍💼</div>
      </div>

      {/* 퀵메뉴 */}
      <div className="bg-white rounded-2xl p-4 grid grid-cols-4 gap-2">
        {QUICK_MENUS.map((menu) => (
          <button
            key={menu.label}
            onClick={() => menu.path && navigate(menu.path)}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
              menu.primary ? 'bg-primary text-white' : 'bg-gray-100'
            }`}>
              {menu.icon}
            </div>
            <span className="text-xs text-gray-600">{menu.label}</span>
          </button>
        ))}
      </div>

      {/* 내 청구 현황 */}
      {stats && (
        <div className="bg-white rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-900">내 청구 현황</h2>
          </div>
          <StatsSummary stats={{ ...stats, monthlyAmounts: [8, 12, 6, 14, 10, 18, 22] }} />
          <div className="flex justify-around mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}<span className="text-sm font-normal">건</span></p>
              <p className="text-xs text-gray-500">전체</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.sent}<span className="text-sm font-normal">건</span></p>
              <p className="text-xs text-gray-500">발송완료</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{stats.paid}<span className="text-sm font-normal">건</span></p>
              <p className="text-xs text-gray-500">지급완료</p>
            </div>
          </div>
        </div>
      )}

      {/* 최근 청구 */}
      <div className="bg-white rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-gray-900">최근 청구</h2>
          <button onClick={() => navigate('/claims')} className="text-xs text-primary">더보기 &gt;</button>
        </div>
        {recentClaims.length === 0 ? (
          <p className="text-center text-gray-400 py-4 text-sm">청구 내역이 없습니다</p>
        ) : (
          recentClaims.map((claim) => <ClaimCard key={claim.id} claim={claim} />)
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```powershell
git add frontend/src/pages/Home.jsx
git commit -m "feat: connect Home page to REST API"
```

---

### Task 18: Claims & ClaimNew 페이지 API 연동

**Files:**
- Modify: `frontend/src/pages/Claims.jsx`
- Modify: `frontend/src/pages/ClaimNew.jsx`

- [ ] **Step 1: Claims.jsx API 연동**

`frontend/src/pages/Claims.jsx`의 상단 import와 데이터 로딩을 교체:

```jsx
import { useState, useEffect } from 'react';
import { claimService } from '../services/claimService';
import ClaimCard from '../components/ClaimCard';

const FILTERS = [
  { label: '전체', value: null },
  { label: '임시저장', value: 'DRAFT' },
  { label: '발송완료', value: 'SENT' },
  { label: '지급완료', value: 'PAID' },
];

export default function Claims() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    claimService.getAll(activeFilter).then(setClaims).catch(console.error);
  }, [activeFilter]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-900 mb-4">청구내역</h1>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {FILTERS.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setActiveFilter(value)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              activeFilter === value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-4">
        {claims.length === 0 ? (
          <p className="text-center text-gray-400 py-8">청구 내역이 없습니다</p>
        ) : (
          claims.map((claim) => <ClaimCard key={claim.id} claim={claim} />)
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: ClaimNew.jsx handleSubmit을 API 호출로 교체**

`frontend/src/pages/ClaimNew.jsx`의 handleSubmit 함수만 교체:

```jsx
import { claimService } from '../services/claimService';

// handleSubmit 교체:
const handleSubmit = () => {
  claimService.create({
    patientName: form.patientName,
    insuranceCompany: form.insuranceCompany,
    claimDate: form.treatmentDate,
    amount: Number(form.amount),
    status: 'SENT',
  })
  .then(() => {
    alert('청구가 접수되었습니다.');
    navigate('/claims');
  })
  .catch(() => alert('청구 접수에 실패했습니다.'));
};
```

- [ ] **Step 3: 전체 통합 테스트**

백엔드와 프론트엔드 동시 실행:

```powershell
# 터미널 1
cd backend && ./gradlew bootRun

# 터미널 2
cd frontend && npm start
```

1. `http://localhost:3000` 접속
2. 청구하기 버튼으로 새 청구 접수
3. 청구내역에서 접수된 항목 확인
4. 홈의 통계 숫자 변경 확인

- [ ] **Step 4: 최종 커밋**

```powershell
git add frontend/src/pages/Claims.jsx frontend/src/pages/ClaimNew.jsx
git commit -m "feat: connect Claims and ClaimNew pages to REST API"
```

---

## 완료 체크리스트

- [ ] 모노레포 구조 (frontend/ + backend/)
- [ ] Tailwind CSS 반응형 UI
- [ ] 5개 화면 구현 (홈, 청구하기, 청구내역, 서류안내, 설정)
- [ ] BottomNav 탭 네비게이션
- [ ] Spring Boot REST API (6개 엔드포인트)
- [ ] PostgreSQL 데이터 영속성
- [ ] 프론트엔드 → 백엔드 API 연동
- [ ] 컴포넌트 단위 테스트 (React)
- [ ] 컨트롤러 단위 테스트 (Spring Boot)
