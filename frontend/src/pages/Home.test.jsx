import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

test('사용자 이름 인사말을 보여준다', () => {
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(screen.getByText(/안녕하세요/)).toBeInTheDocument();
});

test('퀵메뉴 4개를 보여준다', () => {
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(screen.getByText('청구하기')).toBeInTheDocument();
  expect(screen.getByText('청구내역')).toBeInTheDocument();
  expect(screen.getByText('서류안내')).toBeInTheDocument();
  expect(screen.getByText('실비계산기')).toBeInTheDocument();
});

test('내 청구 현황 섹션을 보여준다', () => {
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(screen.getByText('내 청구 현황')).toBeInTheDocument();
});

test('최근 청구 섹션을 보여준다', () => {
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(screen.getByText('최근 청구')).toBeInTheDocument();
});
