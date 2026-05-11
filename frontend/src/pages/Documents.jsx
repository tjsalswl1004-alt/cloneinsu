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
