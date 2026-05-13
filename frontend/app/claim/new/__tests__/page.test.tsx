import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClaimNew from '../page';
import { claimService } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  claimService: {
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

describe('ClaimNew (청구하기 폼)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  // ✅ 성공 케이스
  describe('성공 케이스', () => {
    it('6개 섹션이 모두 표시된다 (피보험자/계약자/진료/계좌/서명/첨부)', () => {
      render(<ClaimNew />);

      expect(screen.getByText('피보험자 정보')).toBeInTheDocument();
      expect(screen.getByText('계약자')).toBeInTheDocument();
      expect(screen.getByText('진료정보')).toBeInTheDocument();
      expect(screen.getByText('계좌정보')).toBeInTheDocument();
      expect(screen.getByText('서명')).toBeInTheDocument();
      expect(screen.getByText('첨부서류')).toBeInTheDocument();
    });

    it('환자 이름을 입력하면 상태가 업데이트된다', async () => {
      const user = userEvent.setup();
      render(<ClaimNew />);

      const nameInput = screen.getByPlaceholderText('이름 입력');
      await user.type(nameInput, '홍길동');

      expect(nameInput).toHaveValue('홍길동');
    });

    it('전화번호 입력 시 자동으로 하이픈 포맷팅된다', async () => {
      const user = userEvent.setup();
      render(<ClaimNew />);

      const phoneInput = screen.getByPlaceholderText('010-0000-0000');
      await user.type(phoneInput, '01012345678');

      expect(phoneInput).toHaveValue('010-1234-5678');
    });

    it('사고 유형으로 "교통사고" 선택 시 자동차보험 처리여부 필드가 등장한다', async () => {
      const user = userEvent.setup();
      render(<ClaimNew />);

      const trafficButton = screen.getByRole('button', { name: '교통사고' });
      await user.click(trafficButton);

      await waitFor(() => {
        expect(screen.getByText('자동차보험 처리여부')).toBeInTheDocument();
      });
    });

    it('계좌 유형으로 "일반" 선택 시 은행/계좌번호/예금주 필드가 등장한다', async () => {
      const user = userEvent.setup();
      render(<ClaimNew />);

      const generalButton = screen.getByRole('button', { name: '일반' });
      await user.click(generalButton);

      await waitFor(() => {
        expect(screen.getByText('은행')).toBeInTheDocument();
        expect(screen.getByText('계좌번호')).toBeInTheDocument();
        expect(screen.getByText('예금주')).toBeInTheDocument();
      });
    });

    it('"임시저장" 버튼 클릭 시 claimService.create가 DRAFT 상태로 호출된다', async () => {
      vi.mocked(claimService.create).mockResolvedValue({} as never);

      const user = userEvent.setup();
      render(<ClaimNew />);

      const draftButton = screen.getByRole('button', { name: '임시저장' });
      await user.click(draftButton);

      await waitFor(() => {
        expect(claimService.create).toHaveBeenCalledWith(
          expect.objectContaining({ status: 'DRAFT' })
        );
      });
    });

    it('"청구서 제출" 버튼 클릭 시 claimService.create가 SENT 상태로 호출된다', async () => {
      vi.mocked(claimService.create).mockResolvedValue({} as never);

      const user = userEvent.setup();
      render(<ClaimNew />);

      const submitButton = screen.getByRole('button', { name: '청구서 제출' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(claimService.create).toHaveBeenCalledWith(
          expect.objectContaining({ status: 'SENT' })
        );
      });
    });

    it('"비대면 서명" 선택 시 캔버스가 표시되지 않는다', async () => {
      const user = userEvent.setup();
      const { container } = render(<ClaimNew />);

      // 처음엔 대면 서명 → 캔버스 있음
      expect(container.querySelector('canvas')).toBeInTheDocument();

      // 비대면 서명 클릭
      const nonContactButton = screen.getByRole('button', { name: '비대면 서명' });
      await user.click(nonContactButton);

      await waitFor(() => {
        expect(container.querySelector('canvas')).not.toBeInTheDocument();
      });
    });
  });

  // ❌ 실패 케이스
  describe('실패 케이스', () => {
    it('API 제출 실패 시 에러를 콘솔에 로깅한다', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(claimService.create).mockRejectedValue(new Error('Server Error'));

      const user = userEvent.setup();
      render(<ClaimNew />);

      const submitButton = screen.getByRole('button', { name: '청구서 제출' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });

    it('주민번호 앞자리는 6자리까지만 입력된다', async () => {
      const user = userEvent.setup();
      render(<ClaimNew />);

      const idFrontInput = screen.getByPlaceholderText('앞 6자리') as HTMLInputElement;
      await user.type(idFrontInput, '12345678901');

      // maxLength 6 → 처음 6자리만
      expect(idFrontInput.value.length).toBeLessThanOrEqual(6);
    });

    it('전화번호에 숫자가 아닌 문자가 입력되면 제거된다', async () => {
      const user = userEvent.setup();
      render(<ClaimNew />);

      const phoneInput = screen.getByPlaceholderText('010-0000-0000');
      await user.type(phoneInput, '010abc1234');

      // 영문자 제거 → 010-1234
      expect(phoneInput).toHaveValue('010-1234');
    });

    it('"교통사고"가 아닐 때는 자동차보험 처리여부 필드가 보이지 않는다', () => {
      render(<ClaimNew />);

      // 기본값은 '질병'이므로
      expect(screen.queryByText('자동차보험 처리여부')).not.toBeInTheDocument();
    });

    it('"기지급계좌"일 때는 은행/계좌번호 필드가 보이지 않는다', () => {
      render(<ClaimNew />);

      // 기본값은 '기지급계좌'이므로
      expect(screen.queryByText('계좌번호')).not.toBeInTheDocument();
      expect(screen.queryByText('예금주')).not.toBeInTheDocument();
    });

    it('계좌번호 입력 시 숫자가 아닌 문자는 제거된다', async () => {
      const user = userEvent.setup();
      render(<ClaimNew />);

      // 계좌 유형 일반 선택
      const generalButton = screen.getByRole('button', { name: '일반' });
      await user.click(generalButton);

      const accountInput = await screen.findByPlaceholderText('숫자만 입력 (- 없이)');
      await user.type(accountInput, '123-456abc');

      // 하이픈과 영문자 제거 → 123456
      expect(accountInput).toHaveValue('123456');
    });
  });
});
