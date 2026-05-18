'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

const FULL_SCREEN_PATHS = ['/login', '/signup'];
const WIDE_PATHS = ['/'];

export default function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (FULL_SCREEN_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  if (WIDE_PATHS.includes(pathname)) {
    return (
      <div className="min-h-screen bg-bg-main">
        <div className="pb-20">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-bg-main">
      <div className="pb-20">{children}</div>
    </div>
  );
}
