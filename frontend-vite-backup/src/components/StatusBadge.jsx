const STATUS_CONFIG = {
  DRAFT: { label: '임시저장', className: 'bg-yellow-100 text-yellow-700' },
  SENT:  { label: '발송완료', className: 'bg-blue-100 text-blue-700' },
  PAID:  { label: '지급완료', className: 'bg-green-100 text-green-700' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
