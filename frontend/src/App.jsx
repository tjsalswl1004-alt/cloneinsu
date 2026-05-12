import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ClaimNew from './pages/ClaimNew';
import Claims from './pages/Claims';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import InsuranceSelect from './pages/InsuranceSelect';
import Calculator from './pages/Calculator';

function Header({ isDark, toggleDark }) {
  return (
    <div className="dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10" style={{backgroundColor: '#F7F8FC'}}>
      <div className="flex items-center gap-2">
        {/* 방패 로고 */}
        <svg width="30" height="34" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0L1 5V16C1 24 7.5 31 15 34C22.5 31 29 24 29 16V5L15 0Z" fill="#F0B429"/>
          <path d="M15 3L4 7.5V16C4 22.5 9 28.5 15 31C21 28.5 26 22.5 26 16V7.5L15 3Z" fill="#F7CC50"/>
          <rect x="6" y="13" width="18" height="2" fill="#D4900A" rx="1"/>
          <rect x="6" y="18" width="18" height="2" fill="#D4900A" rx="1"/>
          <text x="15" y="12" textAnchor="middle" fill="#C47F0A" fontSize="8" fontWeight="900" fontFamily="Arial">A</text>
        </svg>
        <span className="font-black text-base tracking-tight">
          <span style={{background:'linear-gradient(to right, #E8312A, #4A8FE8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'0.15em', fontWeight:'900', fontSize:'18px'}}>FIELDARENA</span>
        </span>
        <span className="text-gray-200 dark:text-gray-600 mx-1 text-sm">|</span>
        <span className="text-gray-900 dark:text-gray-300 font-semibold" style={{fontSize:'10px'}}>설계사의 현장, 필드아레나</span>
      </div>
      <div className="flex items-center gap-2">
        {/* 다크모드 토글 */}
        <button
          onClick={toggleDark}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1 ${isDark ? 'bg-indigo-600' : 'bg-gray-300'}`}
        >
          <span className={`absolute w-5 h-5 rounded-full bg-white flex items-center justify-center transition-all duration-300 shadow-sm ${isDark ? 'translate-x-6' : 'translate-x-0'}`}>
            {isDark ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#6366F1" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="4" fill="#F59E0B"/>
                <line x1="12" y1="2" x2="12" y2="5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="19" x2="12" y2="22" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                <line x1="2" y1="12" x2="5" y2="12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                <line x1="19" y1="12" x2="22" y2="12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </span>
        </button>
        {/* 사용자 아이콘 */}
        <button className="w-8 h-8 rounded-lg dark:bg-gray-800 flex items-center justify-center border border-gray-200" style={{backgroundColor: '#ECEEF5'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
        {/* 로그아웃 아이콘 */}
        <button className="w-8 h-8 rounded-lg dark:bg-gray-800 flex items-center justify-center border border-gray-200" style={{backgroundColor: '#ECEEF5'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

const HIDE_HEADER_PATHS = ['/documents', '/claim/new', '/settings', '/claims', '/insurance-select', '/calculator'];
const HIDE_BOTTOMNAV_PATHS = ['/documents', '/settings'];

function AppInner({ isDark, toggleDark }) {
  const location = useLocation();
  const hideHeader = HIDE_HEADER_PATHS.includes(location.pathname);
  const hideBottomNav = HIDE_BOTTOMNAV_PATHS.includes(location.pathname);

  return (
    <div className="min-h-screen dark:bg-gray-950 max-w-lg mx-auto transition-colors duration-300" style={{backgroundColor: isDark ? '#030712' : '#F7F8FC'}}>
      {!hideHeader && <Header isDark={isDark} toggleDark={toggleDark} />}
      <div className={!hideBottomNav ? 'pb-20' : ''}>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/insurance-select" element={<InsuranceSelect />} />
          <Route path="/claim/new"  element={<ClaimNew />} />
          <Route path="/claims"     element={<Claims />} />
          <Route path="/documents"  element={<Documents />} />
          <Route path="/settings"    element={<Settings />} />
          <Route path="/calculator"  element={<Calculator />} />
        </Routes>
      </div>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}

function App() {
  const [isDark, setIsDark] = useState(false);
  const toggleDark = () => setIsDark((prev) => !prev);

  return (
    <div className={isDark ? 'dark' : ''} style={{backgroundColor: isDark ? '#030712' : '#F7F8FC', minHeight: '100vh'}}>
      <BrowserRouter>
        <AppInner isDark={isDark} toggleDark={toggleDark} />
      </BrowserRouter>
    </div>
  );
}

export default App;
