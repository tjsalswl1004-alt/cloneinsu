import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { insuranceCompanyService } from '../services/claimService';

const TABS = ['손해보험', '생명보험', '배상책임'];

export default function InsuranceSelect() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('손해보험');
  const [selected, setSelected] = useState(null); // { id, name, color, vfax }
  const [companiesByCategory, setCompaniesByCategory] = useState({});

  useEffect(() => {
    insuranceCompanyService.getAll().then((list) => {
      const grouped = list.reduce((acc, c) => {
        if (!acc[c.category]) acc[c.category] = [];
        acc[c.category].push(c);
        return acc;
      }, {});
      setCompaniesByCategory(grouped);
    }).catch(console.error);
  }, []);

  const companies = companiesByCategory[activeTab] ?? [];
  const hasVfax = companies.some((c) => c.vfax);

  const handleConfirm = () => {
    if (!selected) return;
    navigate(`/claim/new?companyId=${selected.id}&companyName=${encodeURIComponent(selected.name)}`);
  };

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F7F8FC' }}>
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 px-4 py-3 relative flex items-center justify-center">
        <button onClick={() => navigate(-1)} className="absolute left-4 text-gray-500 text-2xl font-light leading-none">‹</button>
        <h1 className="text-base font-bold text-gray-900 dark:text-white">보험사 선택</h1>
        <button className="absolute right-4 flex items-center gap-1 text-xs font-semibold text-primary border border-primary rounded-lg px-2.5 py-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          청구링크
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* 카테고리 탭 */}
        <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelected(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 가상팩스 안내 */}
        {hasVfax && (
          <p className="text-xs text-orange-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            가상팩스 등록이 필요한 보험사
          </p>
        )}

        {/* 보험사 그리드 */}
        <div className="grid grid-cols-3 gap-2">
          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => setSelected(company)}
              className={`relative bg-white dark:bg-gray-900 rounded-xl p-3 flex flex-col items-center gap-2 border-2 transition-colors ${
                selected?.id === company.id ? 'border-primary' : 'border-transparent'
              } shadow-sm`}
            >
              {company.vfax && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-400" />
              )}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: company.color }}
              >
                {company.shortName}
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-300 text-center leading-tight">{company.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto px-4 pb-3 z-40">
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-colors ${
            selected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          {selected ? `${selected.name} 선택` : '보험사를 선택해주세요'}
        </button>
      </div>
    </div>
  );
}
