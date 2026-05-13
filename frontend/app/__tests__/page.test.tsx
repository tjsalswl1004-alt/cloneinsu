import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';
import { claimService } from '@/lib/api';
import type { Claim, ClaimStats } from '@/types';

// API mock
vi.mock('@/lib/api', () => ({
  claimService: {
    getAll: vi.fn(),
    getStats: vi.fn(),
  },
}));

const mockClaim: Claim = {
  id: 1,
  customer: { id: 1, name: '홍길동', idFront: '900101', phone: '010-1111-1111' },
  insuranceCompany: { id: 1, name: '삼성화재', shortName: '삼성', category: '손해보험', color: '#1428A0', vfax: false },
  status: 'SENT',
  accidentDate: '2026-05-01',
  hospitalName: '서울대병원',
  createdAt: '2026-05-13T10:00:00',
};

const mockStats: ClaimStats = {
  totalAmount: 1000000,
  total: 5,
  sent: 3,
  paid: 1,
  completionRate: 60,
};

describe('Home (홈 페이지)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ 성공 케이스
  describe('성공 케이스', () => {
    it('인사말이 표시된다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([]);
      vi.mocked(claimService.getStats).mockResolvedValue(mockStats);

      render(<Home />);

      expect(screen.getByText('대표님, 안녕하세요')).toBeInTheDocument();
    });

    it('4개 메뉴 (청구하기, 청구내역, 서류안내, 실비계산기)가 표시된다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([]);
      vi.mocked(claimService.getStats).mockResolvedValue(mockStats);

      render(<Home />);

      expect(screen.getByText('청구하기')).toBeInTheDocument();
      expect(screen.getByText('청구내역')).toBeInTheDocument();
      expect(screen.getByText('서류안내')).toBeInTheDocument();
      expect(screen.getByText('실비계산기')).toBeInTheDocument();
    });

    it('API에서 받은 청구 통계가 표시된다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([mockClaim]);
      vi.mocked(claimService.getStats).mockResolvedValue(mockStats);

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument(); // total
        expect(screen.getByText('3')).toBeInTheDocument(); // sent
        expect(screen.getByText('1')).toBeInTheDocument(); // paid
      });
    });

    it('"청구하기" 클릭 시 보험사 선택 페이지로 이동한다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([]);
      vi.mocked(claimService.getStats).mockResolvedValue(mockStats);

      const user = userEvent.setup();
      render(<Home />);

      const claimButton = screen.getByText('청구하기');
      await user.click(claimButton);

      const mockPush = (globalThis as unknown as { __mockPush: ReturnType<typeof vi.fn> }).__mockPush;
      expect(mockPush).toHaveBeenCalledWith('/insurance-select');
    });

    it('최근 청구가 카드로 표시된다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([mockClaim]);
      vi.mocked(claimService.getStats).mockResolvedValue(mockStats);

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('홍길동')).toBeInTheDocument();
      });
    });

    it('"내 청구" / "전체 회원" 탭이 표시된다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([]);
      vi.mocked(claimService.getStats).mockResolvedValue(mockStats);

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('내 청구')).toBeInTheDocument();
        expect(screen.getByText('전체 회원')).toBeInTheDocument();
      });
    });
  });

  // ❌ 실패 케이스
  describe('실패 케이스', () => {
    it('청구 내역이 비어있을 때 "청구 내역이 없습니다" 메시지가 표시된다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([]);
      vi.mocked(claimService.getStats).mockResolvedValue(mockStats);

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText('청구 내역이 없습니다')).toBeInTheDocument();
      });
    });

    it('API 호출 실패 시 에러를 콘솔에 로깅한다', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const networkError = new Error('Network Error');

      vi.mocked(claimService.getAll).mockRejectedValue(networkError);
      vi.mocked(claimService.getStats).mockRejectedValue(networkError);

      render(<Home />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });

    it('stats가 null일 때 통계 카드는 표시되지 않는다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([]);
      vi.mocked(claimService.getStats).mockRejectedValue(new Error('API Error'));

      render(<Home />);

      // stats 없으면 "내 청구 현황" 카드 안 보임
      await waitFor(() => {
        expect(screen.queryByText('내 청구 현황')).not.toBeInTheDocument();
      });
    });

    it('오늘 청구가 0건일 때 "오늘 0건 청구했어요" 메시지가 표시된다', async () => {
      vi.mocked(claimService.getAll).mockResolvedValue([]);
      vi.mocked(claimService.getStats).mockResolvedValue(mockStats);

      render(<Home />);

      expect(screen.getByText(/오늘 0건/)).toBeInTheDocument();
    });
  });
});
