import type { Metadata } from 'next';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import ConditionalLayout from '@/components/ConditionalLayout';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'FIELDARENA',
  description: '설계사의 현장, 필드아레나',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-bg-main text-text-primary">
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
