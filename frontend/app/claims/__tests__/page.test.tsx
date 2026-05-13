import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Claims from '../page';
import { claimService } from '@/lib/api';
import type { Claim } from '@/types';

vi.mock('@/lib/api', () => ({
  claimService: {
    getAll: vi.fn(),
    remove: vi.fn(),
  },
}));

const makeClaim = (overrides: Partial<Claim>): Claim => ({
  id: 1,
  customer: { id: 1, name: '홍길동', idFront: '900101', phone: '010-1111-1111' },
  insuranceCompany: { id: 1, name: '삼성화재', shortName: '삼성', category: '손해보험', color: '#1428A0', vfax: false },
  status: 'SENT',
  accidentDate: '2026-05-01',
  hospitalName: '서울대병원',
  createdAt: '2026-05-13T10:00:00',
  ...overrides,
});

describe('Claims (청구내역 페이지)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ 성공 케이스
  describe('성공 케이스', () => {
    it('헤더와 상태 탭이 표시된다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([]);

      render(<Claims />);

      expect(screen.getByText('청구내역')).toBeInTheDocument();
      expect(screen.getByText('임시저장')).toBeInTheDocument();
      expect(screen.getByText('발송완료')).toBeInTheDocument();
      expect(screen.getByText('발송실패')).toBeInTheDocument();
    });

    it('API에서 받은 청구 목록이 표시된다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([
        makeClaim({ id: 1, customer: { id: 1, name: '홍길동', idFront: '900101', phone: '010-1111-1111' } }),
        makeClaim({ id: 2, customer: { id: 2, name: '김철수', idFront: '850505', phone: '010-2222-2222' } }),
      ]);

      render(<Claims />);

      await waitFor(() => {
        expect(screen.getByText('홍길동')).toBeInTheDocument();
        expect(screen.getByText('김철수')).toBeInTheDocument();
      });
    });

    it('상태 탭 클릭 시 필터링된다 (발송완료)', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([
        makeClaim({ id: 1, status: 'DRAFT', customer: { id: 1, name: '임시저장유저', idFront: '900101', phone: '010-1111-1111' } }),
        makeClaim({ id: 2, status: 'SENT', customer: { id: 2, name: '발송된유저', idFront: '850505', phone: '010-2222-2222' } }),
      ]);

      const user = userEvent.setup();
      render(<Claims />);

      await waitFor(() => {
        expect(screen.getByText('임시저장유저')).toBeInTheDocument();
        expect(screen.getByText('발송된유저')).toBeInTheDocument();
      });

      // 탭 컨테이너에서 발송완료 버튼 찾기 (StatusBadge와 충돌 방지)
      const sentTab = screen.getAllByText('발송완료').find(
        (el) => el.tagName === 'BUTTON'
      );
      await user.click(sentTab!);

      await waitFor(() => {
        expect(screen.queryByText('임시저장유저')).not.toBeInTheDocument();
        expect(screen.getByText('발송된유저')).toBeInTheDocument();
      });
    });

    it('"고객별" 토글 시 그룹핑되어 표시된다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([
        makeClaim({ id: 1, customer: { id: 1, name: '홍길동', idFront: '900101', phone: '010-1111-1111' } }),
        makeClaim({ id: 2, customer: { id: 1, name: '홍길동', idFront: '900101', phone: '010-1111-1111' } }),
      ]);

      const user = userEvent.setup();
      render(<Claims />);

      const customerToggle = await screen.findByText('고객별');
      await user.click(customerToggle);

      await waitFor(() => {
        // 고객별 그룹 카드에서 "2건" 표시
        expect(screen.getByText('2건')).toBeInTheDocument();
      });
    });

    it('"양식 미리보기", "이어서 작성", "삭제" 버튼이 표시된다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([
        makeClaim({ status: 'DRAFT' }),
      ]);

      render(<Claims />);

      await waitFor(() => {
        expect(screen.getByText('양식 미리보기')).toBeInTheDocument();
        expect(screen.getByText('이어서 작성')).toBeInTheDocument();
        expect(screen.getByText('삭제')).toBeInTheDocument();
      });
    });
  });

  // ❌ 실패 케이스
  describe('실패 케이스', () => {
    it('청구 목록이 비어있을 때 "청구 내역이 없습니다" 메시지가 표시된다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([]);

      render(<Claims />);

      await waitFor(() => {
        expect(screen.getByText('청구 내역이 없습니다')).toBeInTheDocument();
      });
    });

    it('API 호출 실패 시 에러를 콘솔에 로깅한다', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(claimService.getAll).mockRejectedValue(new Error('Network Error'));

      render(<Claims />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });

    it('삭제 confirm을 거부하면 삭제가 실행되지 않는다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([makeClaim()]);
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      const user = userEvent.setup();
      render(<Claims />);

      const deleteButton = await screen.findByText('삭제');
      await user.click(deleteButton);

      expect(claimService.remove).not.toHaveBeenCalled();
    });

    it('DRAFT가 아닌 청구는 "이어서 작성" 버튼이 표시되지 않는다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([
        makeClaim({ status: 'SENT' }),
      ]);

      render(<Claims />);

      await waitFor(() => {
        expect(screen.queryByText('이어서 작성')).not.toBeInTheDocument();
      });
    });

    it('필터 결과가 비어있을 때 "청구 내역이 없습니다" 메시지가 표시된다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([
        makeClaim({ status: 'SENT' }),
      ]);

      const user = userEvent.setup();
      render(<Claims />);

      // FAILED 탭 클릭 → 매칭 없음
      const failedTab = await screen.findByText('발송실패');
      await user.click(failedTab);

      await waitFor(() => {
        expect(screen.getByText('청구 내역이 없습니다')).toBeInTheDocument();
      });
    });
  });
});
