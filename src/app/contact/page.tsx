'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Link href="/">
                <Button variant="ghost" className="mb-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
            </Link>

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-outfit text-white mb-4">Liên hệ với chúng tôi</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Bạn có câu hỏi, góp ý hay cần hỗ trợ? Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                        <h2 className="text-xl font-semibold text-white mb-6">Thông tin liên hệ</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">Email</p>
                                    <p className="text-muted-foreground">support@nckxedu.vn</p>
                                    <p className="text-sm text-muted-foreground/60">Phản hồi trong vòng 24 giờ</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">Hotline</p>
                                    <p className="text-muted-foreground">1900 xxxx xx</p>
                                    <p className="text-sm text-muted-foreground/60">Thứ 2 - Thứ 7: 8:00 - 22:00</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">Zalo/Facebook</p>
                                    <p className="text-muted-foreground">@NckxEdu</p>
                                    <p className="text-sm text-muted-foreground/60">Hỗ trợ trực tuyến nhanh chóng</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">Địa chỉ</p>
                                    <p className="text-muted-foreground">Hà Nội, Việt Nam</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
                        <h3 className="font-semibold text-white mb-2">Câu hỏi thường gặp</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Tìm câu trả lời nhanh cho các thắc mắc phổ biến.
                        </p>
                        <Link href="/guide">
                            <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                                Xem hướng dẫn sử dụng
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5">
                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                <Send className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Đã gửi thành công!</h3>
                            <p className="text-muted-foreground">
                                Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold text-white mb-6">Gửi tin nhắn cho chúng tôi</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">Họ và tên</label>
                                        <Input
                                            placeholder="Nguyễn Văn A"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                                        <Input
                                            type="email"
                                            placeholder="email@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Chủ đề</label>
                                    <Input
                                        placeholder="Bạn cần hỗ trợ về vấn đề gì?"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Nội dung</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Mô tả chi tiết câu hỏi hoặc vấn đề của bạn..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>

                                <Button type="submit" className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white">
                                    <Send className="mr-2 h-4 w-4" />
                                    Gửi tin nhắn
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
