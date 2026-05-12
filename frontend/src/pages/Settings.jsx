import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: 'test@gmail.com',
    name: '대표',
    phone: '01012345678',
    company: '한자산홀딩스',
  });

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen dark:bg-gray-950" style={{ backgroundColor: '#F7F8FC' }}>
      {/* 서브 헤더 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 px-4 py-3 relative flex items-center justify-center">
        <button onClick={() => navigate(-1)} className="absolute left-4 text-gray-500 text-2xl font-light leading-none">‹</button>
        <h1 className="text-base font-bold text-gray-900 dark:text-white">설정</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* 프로필 카드 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
            대
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{form.name}</p>
            <p className="text-sm text-gray-400">{form.email}</p>
          </div>
        </div>

        {/* 프로필 정보 섹션 */}
        <div>
          <p className="text-xs text-gray-400 mb-2 px-1">프로필 정보</p>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 space-y-4">
            {[
              { label: '이메일', name: 'email', type: 'email' },
              { label: '이름', name: 'name', type: 'text' },
              { label: '휴대폰', name: 'phone', type: 'tel' },
              { label: '소속', name: 'company', type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{label}</p>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 dark:bg-gray-800 outline-none focus:border-primary"
                />
              </div>
            ))}
            <button className="w-full bg-primary text-white font-bold rounded-xl py-3 text-sm mt-2">
              변경사항 저장
            </button>
          </div>
        </div>

        {/* 기타 섹션 */}
        <div>
          <p className="text-xs text-gray-400 mb-2 px-1">기타</p>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E6F7F0' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38B2AC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-white">도움말</p>
              <p className="text-xs text-gray-400">자주 묻는 질문</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>

        {/* 로그아웃 */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 flex items-center justify-center">
          <button className="text-sm font-bold text-red-500">로그아웃</button>
        </div>
      </div>
    </div>
  );
}
