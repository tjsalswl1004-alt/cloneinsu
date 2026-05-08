import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

test('DRAFT 상태는 임시저장 텍스트를 보여준다', () => {
  render(<StatusBadge status="DRAFT" />);
  expect(screen.getByText('임시저장')).toBeInTheDocument();
});

test('SENT 상태는 발송완료 텍스트를 보여준다', () => {
  render(<StatusBadge status="SENT" />);
  expect(screen.getByText('발송완료')).toBeInTheDocument();
});

test('PAID 상태는 지급완료 텍스트를 보여준다', () => {
  render(<StatusBadge status="PAID" />);
  expect(screen.getByText('지급완료')).toBeInTheDocument();
});
