import StatusBadge from './StatusBadge';

const COMPANY_COLORS = {
  '한화손해보험': '#FF6B35',
  '삼성생명':     '#1428A0',
  'DB손해보험':   '#00843D',
  '메리츠화재':   '#E31937',
  '교보생명':     '#003087',
  '현대해상':     '#FF6600',
};

export default function ClaimCard({ claim }) {
  const { patientName, insuranceCompany, insuranceLogoColor, claimDate, status } = claim;
  const logoColor = insuranceLogoColor ?? COMPANY_COLORS[insuranceCompany] ?? '#4F6EF7';
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: logoColor }}
        >
          {insuranceCompany?.slice(0, 2) ?? '??'}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{patientName}</p>
          <p className="text-sm text-gray-500">
            {claimDate} · {insuranceCompany}
          </p>
        </div>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}
