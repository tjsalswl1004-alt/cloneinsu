import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 각 테스트 후 DOM 정리
afterEach(() => {
  cleanup();
});

// next/navigation mock (App Router용)
const mockPush = vi.fn();
const mockBack = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    replace: mockReplace,
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// 글로벌하게 노출 (테스트에서 검증용)
(globalThis as unknown as { __mockPush: typeof mockPush }).__mockPush = mockPush;
(globalThis as unknown as { __mockBack: typeof mockBack }).__mockBack = mockBack;
