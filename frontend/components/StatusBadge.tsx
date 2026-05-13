import type { ClaimStatus } from '@/types';

const STATUS_CONFIG: Record<ClaimStatus, { label: string; color: string; bg: string }> = {
  DRAFT:  { label: '임시저장', color: '#D97706', bg: '#FEF3C7' },
  SENT:   { label: '발송완료', color: '#059669', bg: '#D1FAE5' },
  FAILED: { label: '발송실패', color: '#DC2626', bg: '#FEE2E2' },
  PAID:   { label: '지급완료', color: '#2563EB', bg: '#DBEAFE' },
};

interface StatusBadgeProps {
  status: ClaimStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: '#6B7280', bg: '#F3F4F6' };
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      {cfg.label}
    </span>
  );
}
