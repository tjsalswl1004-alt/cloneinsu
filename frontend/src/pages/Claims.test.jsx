import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Claims from './Claims';

test('전체 청구 목록을 보여준다', () => {
  render(<MemoryRouter><Claims /></MemoryRouter>);
  expect(screen.getAllByText(/이영희|김민수|박지훈|최수연/).length).toBeGreaterThan(0);
});

test('전체 필터 탭이 기본으로 선택된다', () => {
  render(<MemoryRouter><Claims /></MemoryRouter>);
  expect(screen.getByRole('button', { name: '전체' })).toHaveClass('bg-primary');
});

test('발송완료 탭 클릭 시 SENT 항목만 보인다', () => {
  render(<MemoryRouter><Claims /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: '발송완료' }));
  // Filter by SENT, should show 2 claims (김민수, 이영희)
  // DRAFT claim (이영희) should be hidden after filtering
  // Check that only 2 cards appear (2 SENT) instead of 5 (all)
  const claimCards = screen.queryAllByText(/삼성생명|한화손해보험|DB손해보험|메리츠화재|교보생명/);
  // After filter: should only show the claims with insurers that have SENT status
  expect(claimCards.length).toBe(2); // 2 SENT items
});
