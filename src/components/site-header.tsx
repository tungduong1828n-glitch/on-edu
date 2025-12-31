'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from "@/components/mode-toggle";
import { GraduationCap, Menu, X, LayoutDashboard, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (pathname?.startsWith('/admin') || pathname?.startsWith('/exam') || pathname?.startsWith('/login')) {
        return null;
    }

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled
            ? 'bg-[#0a0a12]/80 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-black/20'
            : 'bg-transparent'
            }`}>
            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-20 bg-cyan-500/5 blur-3xl rounded-full" />
                <div className="absolute top-0 right-1/4 w-96 h-20 bg-blue-500/5 blur-3xl rounded-full" />
            </div>

            <div className="w-full flex h-18 items-center justify-between px-6 md:px-8 py-4 relative">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-all duration-300 group-hover:scale-105 animate-pulse-glow">
                        <GraduationCap className="h-6 w-6" />
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-outfit font-bold text-xl tracking-wide bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-blue-400 transition-all">
                            NckxEdu
                        </span>
                        <span className="text-[10px] text-cyan-400/60 font-medium tracking-wider uppercase hidden sm:block">
                            Ôn thi THPT
                        </span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-2">
                    <Link
                        href="/dashboard"
                        className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 text-white/80 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                        <LayoutDashboard className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                        Vào học
                    </Link>
                    <Link
                        href="/exams"
                        className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 text-white/80 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                        <FileText className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                        Đề thi
                    </Link>

                    <div className="mx-2 w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                    <ModeToggle />
                </nav>

                <div className="flex items-center gap-3 md:hidden">
                    <ModeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-11 h-11 border border-white/10"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[9999] bg-[#020817] flex flex-col h-screen w-screen overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-cyan-900/10 blur-[100px]" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[80px]" />
                    </div>

                    <div className="container h-full py-6 px-6 space-y-8 relative z-10 flex flex-col">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <span className="font-outfit font-bold text-2xl tracking-wide text-white">
                                    NckxEdu
                                </span>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="rounded-full hover:bg-white/10 text-white/80 w-11 h-11 border border-white/10"
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="space-y-4 pt-8">
                            <Link
                                href="/dashboard"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all active:scale-95"
                            >
                                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30 group-hover:text-cyan-300 transition-colors">
                                    <LayoutDashboard className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white group-hover:text-cyan-50">Vào học</div>
                                    <div className="text-sm text-white/40">Truy cập bài giảng và khóa học</div>
                                </div>
                            </Link>

                            <Link
                                href="/exams"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-purple-500/20 hover:border-purple-500/30 transition-all active:scale-95"
                            >
                                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 group-hover:text-purple-300 transition-colors">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white group-hover:text-purple-50">Đề thi</div>
                                    <div className="text-sm text-white/40">Luyen tap va thi thu</div>
                                </div>
                            </Link>
                        </div>

                        <div className="mt-auto pb-8 text-center text-white/30 text-sm">
                            2024 NckxEdu Platform
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
