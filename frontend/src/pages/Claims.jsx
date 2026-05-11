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
