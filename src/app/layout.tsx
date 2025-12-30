import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: "NckxEdu - Ôn Thi Lớp 12",
  description: "Nền tảng ôn thi lớp 12 hàng đầu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-gradient-mesh selection:bg-cyan-500/30 selection:text-cyan-200`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col relative">
            {/* Header */}
            <SiteHeader />
            <main className="flex-1 relative z-10 p-0">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
