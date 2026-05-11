const SETTINGS_ITEMS = [
  { label: '알림 설정', icon: '🔔' },
  { label: '개인정보 처리방침', icon: '🔒' },
  { label: '이용약관', icon: '📃' },
  { label: '앱 버전', icon: 'ℹ️', value: 'v1.0.0' },
];

export default function Settings() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-900 mb-4">설정</h1>
      <div className="bg-white rounded-2xl p-4 mb-3">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
            👤
          </div>
          <div>
            <p className="font-bold text-gray-900">대표님</p>
            <p className="text-sm text-gray-500">보험 설계사</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl divide-y divide-gray-100">
        {SETTINGS_ITEMS.map(({ label, icon, value }) => (
          <div key={label} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span>{icon}</span>
              <span className="text-gray-800">{label}</span>
            </div>
            <span className="text-gray-400 text-sm">{value ?? '>'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
