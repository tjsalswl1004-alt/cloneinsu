export const dummyClaims = [
  {
    id: 1,
    patientName: '이영희',
    insuranceCompany: '한화손해보험',
    insuranceLogoColor: '#FF6B35',
    claimDate: '2026-04-10',
    amount: 150000,
    status: 'DRAFT',
  },
  {
    id: 2,
    patientName: '김민수',
    insuranceCompany: '삼성생명',
    insuranceLogoColor: '#1428A0',
    claimDate: '2026-05-08',
    amount: 320000,
    status: 'SENT',
  },
  {
    id: 3,
    patientName: '이영희',
    insuranceCompany: 'DB손해보험',
    insuranceLogoColor: '#00843D',
    claimDate: '2026-05-08',
    amount: 280000,
    status: 'SENT',
  },
  {
    id: 4,
    patientName: '박지훈',
    insuranceCompany: '메리츠화재',
    insuranceLogoColor: '#E31937',
    claimDate: '2026-05-07',
    amount: 450000,
    status: 'PAID',
  },
  {
    id: 5,
    patientName: '최수연',
    insuranceCompany: '교보생명',
    insuranceLogoColor: '#003087',
    claimDate: '2026-05-06',
    amount: 890000,
    status: 'PAID',
  },
];

export const dummyStats = {
  totalAmount: 27790000,
  total: 15,
  sent: 12,
  paid: 10,
  completionRate: 80,
  monthlyAmounts: [8, 12, 6, 14, 10, 18, 22],
};

export const dummyUser = {
  name: '대표',
  todayClaimCount: 2,
};
