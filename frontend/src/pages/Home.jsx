import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimService } from '../services/claimService';
import StatsSummary from '../components/StatsSummary';
import ClaimCard from '../components/ClaimCard';

const SECONDARY_MENUS = [
  {
    label: '청구내역', path: '/claims',
    iconBg: '#EDE9FF', iconColor: '#7B61FF',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    label: '서류안내', path: '/documents',
    iconBg: '#E0F7F5', iconColor: '#38B2AC',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="4" rx="1"/>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <line x1="9" y1="12" x2="15" y2="12"/>
        <line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
  },
  {
    label: '실비계산기', path: '/calculator',
    iconBg: '#FFE8EC', iconColor: '#E8557A',
    icon: (c) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="8" y1="6" x2="16" y2="6"/>
        <line x1="8" y1="10" x2="8" y2="10" strokeWidth="2.5"/>
        <line x1="12" y1="10" x2="12" y2="10" strokeWidth="2.5"/>
        <line x1="16" y1="10" x2="16" y2="10" strokeWidth="2.5"/>
        <line x1="8" y1="14" x2="8" y2="14" strokeWidth="2.5"/>
        <line x1="12" y1="14" x2="12" y2="14" strokeWidth="2.5"/>
        <line x1="16" y1="14" x2="16" y2="14" strokeWidth="2.5"/>
        <line x1="8" y1="18" x2="8" y2="18" strokeWidth="2.5"/>
        <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.5"/>
        <line x1="16" y1="18" x2="16" y2="18" strokeWidth="2.5"/>
      </svg>
    ),
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('my');
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
    <div className="p-4 space-y-3">
      {/* 인사말 + 퀵메뉴 (하나의 카드) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4">
        {/* 인사말 */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">{today}</p>
            <h1 className="text-xl font-bold text-gray-900">대표님, 안녕하세요</h1>
            <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full font-bold text-gray-600 dark:text-gray-300" style={{fontSize:'10px'}}>
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              오늘 {todayCount}건 청구했어요
            </div>
          </div>
          <img src="/greeting-characters.png" alt="캐릭터" className="w-44 object-contain" style={{mixBlendMode: 'multiply'}} />
        </div>

        {/* 퀵메뉴 — 4열 균등 */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => navigate('/insurance-select')} className="w-full aspect-square bg-primary rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1">
            <span className="text-white text-3xl font-thin leading-none">+</span>
            <span className="text-xs font-medium text-white">청구하기</span>
          </button>
          {SECONDARY_MENUS.map((menu) => (
            <button
              key={menu.label}
              onClick={() => menu.path && navigate(menu.path)}
              className="w-full aspect-square bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1.5"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor: menu.iconBg}}>
                {menu.icon(menu.iconColor)}
              </div>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{menu.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 내 청구 현황 */}
      {stats && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-900">내 청구 현황</h2>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs">
              <button
                onClick={() => setActiveTab('my')}
                className={`px-3 py-1 ${activeTab === 'my' ? 'bg-gray-100 text-gray-800 font-semibold' : 'text-gray-400'}`}
              >내 청구</button>
              <div className="w-px bg-gray-200" />
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 ${activeTab === 'all' ? 'bg-gray-100 text-gray-800 font-semibold' : 'text-gray-400'}`}
              >전체 회원</button>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4">
            <StatsSummary stats={{ ...stats, monthlyAmounts: [8, 12, 6, 14, 10, 18, 22] }} />
          </div>
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4">
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
