import { render, screen } from '@testing-library/react';
import StatsSummary from './StatsSummary';

const stats = {
  totalAmount: 27790000,
  total: 15,
  sent: 12,
  paid: 10,
  completionRate: 80,
  monthlyAmounts: [8, 12, 6, 14, 10, 18, 22],
};

test('총 지급액을 포맷팅하여 보여준다', () => {
  render(<StatsSummary stats={stats} />);
  expect(screen.getByText('27,790,000원')).toBeInTheDocument();
});

test('완료율 퍼센트를 보여준다', () => {
  render(<StatsSummary stats={stats} />);
  expect(screen.getByText('80%')).toBeInTheDocument();
});
