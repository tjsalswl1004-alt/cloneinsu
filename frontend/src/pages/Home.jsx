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
