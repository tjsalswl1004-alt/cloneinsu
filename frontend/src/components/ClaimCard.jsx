import StatusBadge from './StatusBadge';

export default function ClaimCard({ claim }) {
  const { customer, insuranceCompany, accidentDate, status } = claim;
  const patientName = customer?.name ?? '';
  const logoColor = insuranceCompany?.color ?? '#4F6EF7';
  const companyName = insuranceCompany?.name ?? '';

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: logoColor }}
        >
          {companyName.slice(0, 2) || '??'}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{patientName}</p>
          <p className="text-sm text-gray-500">
            {accidentDate} · {companyName}
          </p>
        </div>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}
