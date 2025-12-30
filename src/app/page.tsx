'use client';

import Link from 'next/link';
import {
  BookOpen, Users, FileText, Trophy, Zap, Sparkles, GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Elements */}
      <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-cyan-500/5 blur-[120px] -z-10" />
      <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 space-y-32">
        {/* Hero Section */}
        <section className="text-center relative max-w-4xl mx-auto animate-in fade-in zoom-in duration-700">
          <Badge variant="outline" className="mb-6 rounded-full border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-cyan-400 backdrop-blur-sm">
            <Sparkles className="mr-2 h-3.5 w-3.5 fill-cyan-400/20" />
            Nền tảng ôn thi trực tuyến số 1 Việt Nam
          </Badge>

          <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-7xl font-outfit">
            <span className="block text-white">Chinh Phục</span>
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent pb-2">
              Kỳ Thi THPT Quốc Gia
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground/80 leading-relaxed">
            Hệ thống bài giảng, trắc nghiệm và đề thi thử được biên soạn bởi đội ngũ giáo viên giàu kinh nghiệm. Cá nhân hóa lộ trình học tập của bạn ngay hôm nay.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 rounded-full px-10 text-lg bg-cyan-500 hover:bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-1">
                <GraduationCap className="mr-3 h-5 w-5" />
                Bắt đầu học ngay
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="h-14 rounded-full px-10 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white transition-all">
                <Zap className="mr-2 h-5 w-5" />
                Tìm hiểu thêm
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Section with Glassmorphism */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: BookOpen, label: 'Môn học', value: '8+', desc: 'Đầy đủ các môn' },
            { icon: FileText, label: 'Ngân hàng câu hỏi', value: '10k+', desc: 'Cập nhật liên tục' },
            { icon: Users, label: 'Học sinh tin dùng', value: '5000+', desc: 'Trên cả nước' },
            { icon: Trophy, label: 'Điểm trung bình', value: '8.5', desc: 'Thành tích cao' },
          ].map((stat, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center backdrop-blur-sm transition-all hover:bg-white/[0.04] animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-white/5 to-white/0 shadow-inner ring-1 ring-white/10 group-hover:scale-110 transition-transform">
                <stat.icon className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1 font-outfit">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
              <p className="text-xs text-muted-foreground/50 mt-1">{stat.desc}</p>
            </div>
          ))}
        </section>

        {/* Feature Highlights (New Section to fill Landing Page) */}
        <section className="py-16 border-t border-white/5">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-outfit mb-4 text-white">Tại sao chọn NckxEdu?</h2>
            <p className="text-muted-foreground">Công nghệ hiện đại kết hợp phương pháp giáo dục tiên tiến</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Lộ trình cá nhân hóa', desc: 'Hệ thống tự động phân tích và gợi ý bài học phù hợp với năng lực.' },
              { title: 'Thi thử như thi thật', desc: 'Giao diện và áp lực thời gian mô phỏng chính xác kỳ thi THPT QG.' },
              { title: 'Báo cáo chi tiết', desc: 'Xem biểu đồ tiến bộ và nhận xét chi tiết sau mỗi bài kiểm tra.' }
            ].map((feat, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/20 transition-colors">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">{feat.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
