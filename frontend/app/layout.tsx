import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "FIELDARENA",
  description: "설계사의 현장, 필드아레나",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen max-w-lg mx-auto" style={{backgroundColor: '#F7F8FC'}}>
          <div className="pb-20">
            {children}
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
