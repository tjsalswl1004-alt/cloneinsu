import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimService } from '../services/claimService';


const STATUS_CONFIG = {
  DRAFT:  { label: '임시저장', color: '#D97706', bg: '#FEF3C7' },
  SENT:   { label: '발송완료', color: '#059669', bg: '#D1FAE5' },
  FAILED: { label: '발송실패', color: '#DC2626', bg: '#FEE2E2' },
  PAID:   { label: '지급완료', color: '#2563EB', bg: '#DBEAFE' },
};

const TABS = [
  { label: '전체',   value: null,     dotColor: '#6B7280' },
  { label: '임시저장', value: 'DRAFT',  dotColor: '#D97706' },
  { label: '발송완료', value: 'SENT',   dotColor: '#059669' },
  { label: '발송실패', value: 'FAILED', dotColor: '#DC2626' },
];

function formatClaimDate(dateStr) {
  if (!dateStr) return '';
  return dateStr.replace(/-/g, '.');
}

function formatAccidentDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return '방금 전';
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}일 전`;
  return formatClaimDate(dateStr);
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: '#6B7280', bg: '#F3F4F6' };
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      {cfg.label}
    </span>
  );
}

function ClaimDetailCard({ claim, onDelete }) {
  const { id, customer, insuranceCompany, accidentDate, hospitalName, status, attachmentCount, createdAt } = claim;
  const patientName = customer?.name ?? '';
  const logoColor = insuranceCompany?.color ?? '#4F6EF7';
  const companyName = insuranceCompany?.name ?? '';
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 space-y-3">
      {/* 상단: 회사 + 상태 + 날짜 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: logoColor }}>
            {companyName.slice(0, 2) || '??'}
          </div>
          <span className="font-bold text-sm text-gray-900 dark:text-white">{companyName}</span>
          <StatusBadge status={status} />
        </div>
        <span className="text-xs text-gray-400">{timeAgo(createdAt)}</span>
      </div>

      {/* 상세 정보 */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {patientName}
        </div>
        {hospitalName && (
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="9" width="18" height="13" rx="1"/><path d="M3 10l9-7 9 7"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
            {hospitalName}
          </div>
        )}
        {accidentDate && (
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            사고일 {formatAccidentDate(accidentDate)}
          </div>
        )}
      </div>

      {/* 첨부파일 / 개인정보 */}
      <div className="space-y-1 border-t border-gray-100 pt-2">
        <div className="flex items-center justify-between text-sm text-gray-500 py-1">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            <span>첨부파일 {attachmentCount ?? 0}건</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 py-1">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>개인정보 동의서</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-2">
        <button className="flex items-center gap-1 text-xs text-primary font-semibold">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F6EF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          양식 미리보기
        </button>
        {status === 'DRAFT' && (
          <button onClick={() => navigate(`/claim/new?id=${id}`)} className="flex items-center gap-1 text-xs text-orange-400 font-semibold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            이어서 작성
          </button>
        )}
        {status !== 'DRAFT' && <span />}
        <button onClick={() => onDelete(id)} className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          삭제
        </button>
      </div>
    </div>
  );
}

function formatIdFront(idFront) {
  if (!idFront || idFront.length < 6) return idFront ?? '';
  return `${idFront.slice(0,2)}.${idFront.slice(2,4)}.${idFront.slice(4,6)}`;
}

function CustomerGroupCard({ patientName, phone, idFront, claims }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 space-y-2">
      {/* 고객 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-sm text-gray-900 dark:text-white">{patientName}</span>
          {idFront && <span className="text-xs text-gray-400">{formatIdFront(idFront)}</span>}
          {phone && (
            <>
              <span className="text-gray-300 text-xs">|</span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.56a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {phone}
              </span>
            </>
          )}
        </div>
        <span className="text-sm font-bold text-primary flex-shrink-0">{claims.length}건</span>
      </div>

      {/* 청구 목록 */}
      <div className="space-y-2 border-t border-gray-100 pt-2">
        {claims.map((claim) => {
          const logoColor = claim.insuranceCompany?.color ?? '#4F6EF7';
          const name = claim.insuranceCompany?.name ?? '';
          return (
            <div key={claim.id} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: logoColor }}>
                {name.slice(0, 2) || '??'}
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex-1 truncate">{name}</span>
              <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(claim.createdAt ?? claim.claimDate)}</span>
              <StatusBadge status={claim.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Claims() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [viewMode, setViewMode] = useState('전체');

  useEffect(() => {
    claimService.getAll().then(setClaims).catch(console.error);
  }, []);

  const countByStatus = (status) => status ? claims.filter(c => c.status === status).length : claims.length;
  const filtered = activeTab ? claims.filter(c => c.status === activeTab) : claims;

  const grouped = filtered.reduce((acc, claim) => {
    const key = claim.customer?.id != null ? String(claim.customer.id) : `name:${claim.customer?.name ?? '미입력'}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(claim);
    return acc;
  }, {});

  const handleDelete = async (id) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    await claimService.remove(id);
    setClaims(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen dark:bg-gray-950" style={{ backgroundColor: '#F7F8FC' }}>
      {/* 서브 헤더 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 px-4 py-3 relative flex items-center justify-center">
        <button onClick={() => navigate(-1)} className="absolute left-4 text-gray-500 text-2xl font-light leading-none">‹</button>
        <h1 className="text-base font-bold text-gray-900 dark:text-white">청구내역</h1>
        <div className="absolute right-4 flex border border-gray-200 rounded-lg overflow-hidden text-xs">
          {['전체', '고객별'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1 ${viewMode === mode ? 'bg-gray-100 font-semibold text-gray-800' : 'text-gray-400'}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* 상태 탭 */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 px-4 flex gap-0 overflow-x-auto">
        {TABS.map(({ label, value, dotColor }) => (
          <button
            key={label}
            onClick={() => setActiveTab(value)}
            className={`flex items-center gap-1 px-3 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === value ? 'border-primary text-primary' : 'border-transparent text-gray-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: dotColor }} />
            {label}
            <span className="font-bold">{countByStatus(value)}</span>
          </button>
        ))}
      </div>

      {/* 목록 */}
      <div className="p-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">청구 내역이 없습니다</p>
        ) : viewMode === '고객별' ? (
          Object.entries(grouped).map(([key, clms]) => (
            <CustomerGroupCard
              key={key}
              patientName={clms[0]?.customer?.name}
              phone={clms[0]?.customer?.phone}
              idFront={clms[0]?.customer?.idFront}
              claims={clms}
            />
          ))
        ) : (
          filtered.map(claim => (
            <ClaimDetailCard key={claim.id} claim={claim} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}
