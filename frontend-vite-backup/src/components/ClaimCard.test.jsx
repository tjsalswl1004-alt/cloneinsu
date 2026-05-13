import { render, screen } from '@testing-library/react';
import ClaimCard from './ClaimCard';

const claim = {
  id: 1,
  patientName: '이영희',
  insuranceCompany: '한화손해보험',
  insuranceLogoColor: '#FF6B35',
  claimDate: '2026-04-10',
  amount: 150000,
  status: 'DRAFT',
};

test('환자명을 보여준다', () => {
  render(<ClaimCard claim={claim} />);
  expect(screen.getByText('이영희')).toBeInTheDocument();
});

test('보험사명을 보여준다', () => {
  render(<ClaimCard claim={claim} />);
  expect(screen.getByText(/한화손해보험/)).toBeInTheDocument();
});

test('임시저장 뱃지를 보여준다', () => {
  render(<ClaimCard claim={claim} />);
  expect(screen.getByText('임시저장')).toBeInTheDocument();
});
