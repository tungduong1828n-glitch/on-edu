'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ModeToggle } from "@/components/mode-toggle";
import { GraduationCap, Menu, X, LayoutDashboard, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SiteHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#09090b]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#09090b]/80">
            {/* Gradient Line */}
            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

            <div className="w-full flex h-16 items-center justify-between px-6 md:px-8 relative">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300 group-hover:scale-105">
                        <GraduationCap className="h-5 w-5" />
                        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
                    </div>
                    <span className="font-outfit font-bold text-xl tracking-wide text-white group-hover:text-cyan-400 transition-colors">
                        NckxEdu
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                    {[
                        { href: '/dashboard', label: 'Vào học', icon: LayoutDashboard },
                        { href: '/exams', label: 'Đề thi', icon: FileText },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/70 transition-all hover:text-white hover:bg-white/5 active:scale-95"
                        >
                            <link.icon className="w-4 h-4" />
                            {link.label}
                        </Link>
                    ))}

                    <div className="mx-2 w-px h-6 bg-white/10" />

                    <ModeToggle />
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <ModeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[9999] bg-[#020817] flex flex-col h-screen w-screen overflow-hidden">
                    {/* Ambient Background in Menu */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-cyan-900/10 blur-[100px]" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[80px]" />
                    </div>

                    <div className="container h-full py-6 px-6 space-y-8 relative z-10 flex flex-col">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-900/20">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <span className="font-outfit font-bold text-2xl tracking-wide text-white">
                                    NckxEdu
                                </span>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="rounded-full hover:bg-white/10 text-white/80"
                            >
                                <X className="h-7 w-7" />
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
                                    <div className="text-sm text-white/40">Luyện tập và thi thử</div>
                                </div>
                            </Link>
                        </div>

                        <div className="mt-auto pb-8 text-center text-white/30 text-sm">
                            © 2024 NckxEdu Platform
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
