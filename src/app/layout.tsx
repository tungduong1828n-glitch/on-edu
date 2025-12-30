import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BookOpen, Settings } from "lucide-react";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "EduReview - Ôn Thi Lớp 12",
  description: "Nền tảng ôn thi trực tuyến cho học sinh lớp 12 với nhiều môn học",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">EduReview</span>
              </Link>

              <div className="flex items-center gap-3">
                <Link href="/admin" className="btn-ghost flex items-center gap-2 text-sm">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Quản lý</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-16 min-h-screen">
          {children}
        </main>

        <footer className="border-t border-white/5 py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-white/30 text-sm">
              EduReview - Nền tảng ôn thi trực tuyến cho học sinh lớp 12
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
