'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Facebook, Youtube, MessageCircle } from 'lucide-react';

export function Footer() {
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();

    if (pathname?.startsWith('/admin') || pathname?.startsWith('/exam') || pathname?.startsWith('/login')) {
        return null;
    }

    return (
        <footer className="relative mt-auto border-t border-white/5 bg-black/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">N</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                NckxEdu
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Nền tảng ôn thi trực tuyến ứng dụng công nghệ AI tiên tiến, giúp học sinh THPT chuẩn bị tốt nhất cho kỳ thi Quốc gia.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 flex items-center justify-center transition-colors">
                                <Facebook className="w-4 h-4 text-muted-foreground hover:text-cyan-400" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 flex items-center justify-center transition-colors">
                                <Youtube className="w-4 h-4 text-muted-foreground hover:text-cyan-400" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-white/10 flex items-center justify-center transition-colors">
                                <MessageCircle className="w-4 h-4 text-muted-foreground hover:text-cyan-400" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Khám phá</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Trang chủ', href: '/' },
                                { label: 'Các môn học', href: '/dashboard' },
                                { label: 'Đề thi thử', href: '/exams' },
                                { label: 'Giới thiệu', href: '/about' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Pháp lý</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Điều khoản sử dụng', href: '/terms' },
                                { label: 'Chính sách bảo mật', href: '/privacy' },
                                { label: 'Hướng dẫn sử dụng', href: '/guide' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Liên hệ</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                <span>support@nckxedu.vn</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                <span>1900 xxxx xx</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                                <span>Hà Nội, Việt Nam</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            {currentYear} NckxEdu. Mọi quyền được bảo lưu.
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                            Nội dung câu hỏi được biên soạn và kiểm duyệt bởi AI tiên tiến
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
