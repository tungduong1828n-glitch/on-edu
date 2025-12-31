'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, Users, FileText, Trophy, Zap, Sparkles, GraduationCap,
  Brain, Target, BarChart3, Clock, Shield, CheckCircle2, Star, ArrowRight, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function AnimatedSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`animate-on-scroll ${className}`}>
      {children}
    </div>
  );
}

function CountUp({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const startTime = Date.now();
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOut = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(end * easeOut));
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function MiniChart() {
  const bars = [40, 65, 45, 80, 55, 90, 70, 95];

  return (
    <div className="flex items-end gap-1 h-16">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-3 rounded-t-sm bg-gradient-to-t from-cyan-500 to-blue-500 animate-fade-in-up"
          style={{
            height: `${height}%`,
            animationDelay: `${i * 100}ms`,
            opacity: 0.6 + (i * 0.05)
          }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-cyan-500/5 blur-[120px] -z-10" />
      <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[120px] -z-10" />
      <div className="absolute top-[60%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[100px] -z-10 animate-float" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 space-y-32">
        <section className="text-center relative max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6 rounded-full border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-cyan-400 backdrop-blur-sm animate-fade-in-up">
            <Sparkles className="mr-2 h-3.5 w-3.5 fill-cyan-400/20" />
            Nền tảng ôn thi trực tuyến số 1 Việt Nam
          </Badge>

          <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-7xl font-outfit animate-fade-in-up delay-100">
            <span className="block text-white">Chinh Phục</span>
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent pb-2">
              Kỳ Thi THPT Quốc Gia
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground/80 leading-relaxed animate-fade-in-up delay-200">
            Hệ thống bài giảng, trắc nghiệm và đề thi thử được biên soạn bởi công nghệ AI tiên tiến,
            kiểm duyệt chặt chẽ và cập nhật liên tục theo chương trình mới nhất của Bộ GD-ĐT.
          </p>

          <p className="mx-auto mb-10 max-w-xl text-sm text-muted-foreground/60 animate-fade-in-up delay-300">
            Hơn 10.000+ câu hỏi trắc nghiệm | 8+ môn học | Phân tích điểm yếu tự động
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-400">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 rounded-full px-10 text-lg bg-cyan-500 hover:bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-1">
                <GraduationCap className="mr-3 h-5 w-5" />
                Bắt đầu học ngay
              </Button>
            </Link>
            <Link href="/exams">
              <Button size="lg" variant="outline" className="h-14 rounded-full px-10 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white transition-all">
                <Zap className="mr-2 h-5 w-5" />
                Làm đề thi thử
              </Button>
            </Link>
          </div>
        </section>

        <AnimatedSection>
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: BookOpen, label: 'Môn học', value: 8, suffix: '+', desc: 'Đầy đủ các môn', color: 'cyan' },
              { icon: FileText, label: 'Ngân hàng câu hỏi', value: 10, suffix: 'k+', desc: 'Cập nhật liên tục', color: 'blue' },
              { icon: Users, label: 'Học sinh tin dùng', value: 5000, suffix: '+', desc: 'Trên cả nước', color: 'purple' },
              { icon: Trophy, label: 'Điểm trung bình', value: 8.5, suffix: '', desc: 'Thành tích cao', color: 'yellow' },
            ].map((stat, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center backdrop-blur-sm transition-all hover:bg-white/[0.04] hover:border-cyan-500/20" style={{ transitionDelay: `${idx * 100}ms` }}>
                <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/10 shadow-inner ring-1 ring-white/10 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                </div>
                <div className="text-3xl font-bold text-white mb-1 font-outfit">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                <p className="text-xs text-muted-foreground/50 mt-1">{stat.desc}</p>
              </div>
            ))}
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-16 border-t border-white/5">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4 rounded-full border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-cyan-400">
                  <TrendingUp className="mr-2 h-3 w-3" />
                  Hiệu quả đã được chứng minh
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold font-outfit mb-6 text-white">Tăng điểm nhanh chóng với phương pháp khoa học</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Hệ thống AI phân tích điểm mạnh và điểm yếu của bạn, từ đó gợi ý lộ trình học tập tối ưu.
                  Trung bình học sinh tăng 1.5-2 điểm sau 3 tháng sử dụng.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-2xl font-bold text-cyan-400 font-outfit">+1.5</div>
                    <div className="text-xs text-muted-foreground mt-1">Điểm tăng TB</div>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-2xl font-bold text-cyan-400 font-outfit">89%</div>
                    <div className="text-xs text-muted-foreground mt-1">Hài lòng</div>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-2xl font-bold text-cyan-400 font-outfit">24/7</div>
                    <div className="text-xs text-muted-foreground mt-1">Hỗ trợ</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-xs text-cyan-400/80 uppercase tracking-wider font-medium">Tiến độ học tập</p>
                      <p className="text-2xl font-bold text-white font-outfit">Tháng 12</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="text-xs text-muted-foreground">Điểm số</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[100, 75, 50, 25, 0].map((val, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground/40 w-6 text-right">{val}</span>
                          <div className="flex-1 h-px bg-white/5" />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-end justify-between gap-2 h-40 pl-8 relative z-10">
                      {[
                        { value: 35, month: 'T1' },
                        { value: 45, month: 'T2' },
                        { value: 40, month: 'T3' },
                        { value: 60, month: 'T4' },
                        { value: 55, month: 'T5' },
                        { value: 75, month: 'T6' },
                        { value: 70, month: 'T7' },
                        { value: 85, month: 'T8' },
                        { value: 80, month: 'T9' },
                        { value: 92, month: 'T10' },
                        { value: 88, month: 'T11' },
                        { value: 95, month: 'T12' },
                      ].map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                          <div className="relative w-full">
                            <div
                              className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600 via-cyan-500 to-blue-400 transition-all duration-700 ease-out group-hover:from-cyan-500 group-hover:to-blue-300 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40"
                              style={{
                                height: `${item.value * 1.5}px`,
                                animationDelay: `${i * 80}ms`
                              }}
                            />
                            <div
                              className="absolute inset-0 rounded-t-lg bg-gradient-to-t from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-cyan-500/90 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap backdrop-blur-sm">
                              {item.value}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pl-8 mt-3">
                    {['T1', '', '', 'T4', '', '', 'T7', '', '', 'T10', '', 'T12'].map((label, i) => (
                      <span key={i} className="flex-1 text-center text-[10px] text-muted-foreground/60">{label}</span>
                    ))}
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full bg-cyan-500/20 blur-3xl -z-10" />
                <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl -z-10" />
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-16 border-t border-white/5">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4 rounded-full border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-cyan-400">
                <Brain className="mr-2 h-3 w-3" />
                Công nghệ AI
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold font-outfit mb-4 text-white">Tại sao chọn NckxEdu?</h2>
              <p className="text-muted-foreground">Công nghệ hiện đại kết hợp phương pháp giáo dục tiên tiến, mang đến trải nghiệm học tập tối ưu nhất</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Target, title: 'Lộ trình cá nhân hóa', desc: 'Hệ thống AI tự động phân tích năng lực và gợi ý bài học phù hợp với trình độ của bạn.' },
                { icon: Clock, title: 'Thi thử như thi thật', desc: 'Giao diện và áp lực thời gian mô phỏng chính xác kỳ thi THPT Quốc gia.' },
                { icon: BarChart3, title: 'Báo cáo chi tiết', desc: 'Xem biểu đồ tiến bộ, phân tích điểm mạnh/yếu và nhận xét chi tiết sau mỗi bài kiểm tra.' }
              ].map((feat, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/20 transition-all hover:bg-white/[0.05]">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feat.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-16 border-t border-white/5">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold font-outfit mb-4 text-white">Bắt đầu chỉ với 3 bước</h2>
              <p className="text-muted-foreground">Đơn giản, nhanh chóng và hiệu quả</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-cyan-500/20 via-cyan-500/40 to-cyan-500/20 -translate-y-1/2 z-0" />

              {[
                { step: '01', title: 'Chọn môn học', desc: 'Lựa chọn môn học bạn muốn ôn tập từ 8+ môn chính thức' },
                { step: '02', title: 'Làm bài tập', desc: 'Làm các bài trắc nghiệm, đề thi thử được cá nhân hóa' },
                { step: '03', title: 'Theo dõi tiến độ', desc: 'Xem báo cáo chi tiết và cải thiện điểm số của bạn' },
              ].map((item, i) => (
                <div key={i} className="relative z-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
                    <span className="text-2xl font-bold text-white font-outfit">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-16 border-t border-white/5">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold font-outfit mb-4 text-white">Học sinh nói gì về chúng tôi?</h2>
              <p className="text-muted-foreground">Những chia sẻ từ các học sinh đã sử dụng NckxEdu</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Nguyễn Văn A', school: 'THPT Chuyên Hà Nội - Amsterdam', score: '9.5', quote: 'Nhờ NckxEdu mà em đã cải thiện đáng kể môn Toán. Các đề thi thử sát với đề thật giúp em tự tin hơn khi vào phòng thi.' },
                { name: 'Trần Thị B', school: 'THPT Chu Văn An', score: '9.2', quote: 'Hệ thống phân tích điểm yếu rất chính xác, giúp em biết tập trung ôn dạng nào. Em đã tăng 2 điểm Lý chỉ sau 2 tháng.' },
                { name: 'Lê Văn C', school: 'THPT Lê Hồng Phong', score: '8.8', quote: 'Giao diện đẹp, dễ sử dụng. Em thích tính năng thi thử vì nó giống hệt thi thật, giúp em làm quen với áp lực thời gian.' },
              ].map((testimonial, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/20 transition-all">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.school}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-cyan-400 font-outfit">{testimonial.score}</p>
                      <p className="text-xs text-muted-foreground">Điểm TB</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-16 border-t border-white/5">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="outline" className="mb-4 rounded-full border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-cyan-400">
                <Shield className="mr-2 h-3 w-3" />
                Chất lượng đảm bảo
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold font-outfit mb-4 text-white">Cam kết của chúng tôi</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                'Nội dung được AI biên soạn và kiểm duyệt kỹ lưỡng',
                'Cập nhật theo chương trình mới nhất của Bộ GD-ĐT',
                'Đề thi mô phỏng sát với thực tế',
                'Hỗ trợ học sinh 24/7 qua nhiều kênh',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-all">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-16">
            <div className="relative rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 p-12 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(6,182,212,0.2),transparent_60%)]" />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold font-outfit mb-4 text-white">Sẵn sàng chinh phục kỳ thi?</h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Tham gia cùng hơn 5.000+ học sinh đang sử dụng NckxEdu để chuẩn bị cho kỳ thi THPT Quốc gia
                </p>
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 rounded-full px-10 text-lg bg-cyan-500 hover:bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-1">
                    Bắt đầu miễn phí
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </div>
    </div>
  );
}
