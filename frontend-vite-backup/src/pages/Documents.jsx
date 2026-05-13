import { useNavigate } from 'react-router-dom';

const HospitalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B6EF7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="9" width="18" height="13" rx="1"/>
    <path d="M3 10l9-7 9 7"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);

const BedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B6EF7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/>
    <path d="M2 14h20"/>
    <path d="M7 14V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6"/>
    <circle cx="8" cy="6" r="1" fill="#5B6EF7" stroke="none"/>
  </svg>
);

const ScissorsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B6EF7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/>
    <circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);

const TriangleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B6EF7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const SECTIONS = [
  {
    title: '통원 치료시',
    Icon: HospitalIcon,
    items: [
      { text: '진료비영수증' },
      { text: '진료비세부내역서' },
      { text: '환자보관용처방전' },
      { text: '약제비영수증', note: '약국 발급' },
    ],
  },
  {
    title: '입원 치료시',
    Icon: BedIcon,
    items: [
      { text: '진료비영수증' },
      { text: '진료비세부내역서' },
      { text: '환자보관용처방전' },
      { text: '입·퇴원 확인서' },
      { text: '수술확인서', note: '수술 했을시' },
      { text: '약제비영수증', note: '약국 발급' },
    ],
  },
  {
    title: '수술시 (용종제거 등)',
    Icon: ScissorsIcon,
    items: [
      { text: '진료비영수증' },
      { text: '진료비세부내역서' },
      { text: '환자보관용처방전' },
      { text: '수술확인서' },
      { text: '조직병리검사서' },
      { text: '약제비영수증', note: '약국 발급' },
    ],
  },
  {
    title: '골절시',
    Icon: TriangleIcon,
    items: [
      { text: '진료비영수증' },
      { text: '진료비세부내역서' },
      { text: '환자보관용처방전' },
      { text: '골절 진단서' },
      { text: '초진차트 사본' },
      { text: '수술확인서', note: '수술시' },
      { text: '입퇴원확인서', note: '입원시' },
      { text: '약제비영수증', note: '약국 발급' },
    ],
  },
];

export default function Documents() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      {/* 서브 헤더 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 -mx-4 -mt-4 mb-4 px-4 py-3 relative flex items-center justify-center">
        <button onClick={() => navigate(-1)} className="absolute left-4 text-gray-500 text-2xl font-light leading-none">‹</button>
        <h1 className="text-base font-bold text-gray-900 dark:text-white">청구서류 안내</h1>
      </div>

      {SECTIONS.map(({ title, Icon, items }) => (
        <div key={title} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm">
          {/* 섹션 헤더 */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: '#EAEDFF' }}>
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <Icon />
            </div>
            <span className="font-bold text-sm" style={{ color: '#3B4A9A' }}>{title}</span>
          </div>

          {/* 항목 목록 */}
          <div className="divide-y divide-gray-100">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 px-4 py-3">
                <span className="text-xs font-bold w-4 text-center" style={{ color: '#5B6EF7' }}>{idx + 1}</span>
                <span className="text-sm font-semibold text-gray-800">{item.text}</span>
                {item.note && (
                  <span className="text-xs text-gray-400 ml-1">({item.note})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
