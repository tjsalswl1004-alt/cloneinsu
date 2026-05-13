export default function Header() {
  return (
    <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10" style={{backgroundColor: '#F7F8FC'}}>
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
          <span style={{background:'linear-gradient(to right, #E8312A, #4A8FE8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'0.15em', fontWeight:900, fontSize:'18px'}}>FIELDARENA</span>
        </span>
        <span className="text-gray-200 mx-1 text-sm">|</span>
        <span className="text-gray-900 font-semibold" style={{fontSize:'10px'}}>설계사의 현장, 필드아레나</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200" style={{backgroundColor: '#ECEEF5'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200" style={{backgroundColor: '#ECEEF5'}}>
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
