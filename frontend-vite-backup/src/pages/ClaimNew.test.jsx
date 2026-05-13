import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ClaimNew from './ClaimNew';

test('1단계 환자정보 폼이 처음에 보인다', () => {
  render(<MemoryRouter><ClaimNew /></MemoryRouter>);
  expect(screen.getByText('환자 정보')).toBeInTheDocument();
});

test('환자명 입력 후 다음 버튼 클릭 시 2단계로 이동한다', () => {
  render(<MemoryRouter><ClaimNew /></MemoryRouter>);
  fireEvent.change(screen.getByPlaceholderText('환자명 입력'), { target: { value: '홍길동' } });
  fireEvent.click(screen.getByText('다음'));
  expect(screen.getByText('병원 정보')).toBeInTheDocument();
});

test('진행 단계 표시기가 보인다', () => {
  render(<MemoryRouter><ClaimNew /></MemoryRouter>);
  expect(screen.getByText('1 / 3')).toBeInTheDocument();
});
