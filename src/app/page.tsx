'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Subject } from '@/lib/types';
import {
  BookOpen, Calculator, Atom, FlaskConical,
  BookOpenCheck, Landmark, GraduationCap, Sparkles,
  ArrowRight, Users, FileText, Trophy, Zap
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'book-open': BookOpen,
  'calculator': Calculator,
  'atom': Atom,
  'flask-conical': FlaskConical,
  'languages': BookOpenCheck,
  'landmark': Landmark,
};

function SubjectCard({ subject }: { subject: Subject }) {
  const IconComponent = iconMap[subject.icon] || BookOpen;

  return (
    <Link href={`/subject/${subject.id}`}>
      <div className="glass-card p-6 group cursor-pointer h-full">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
          {subject.name}
        </h3>

        <p className="text-white/50 text-sm line-clamp-2">
          {subject.description}
        </p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/subjects')
      .then(res => res.json())
      .then(data => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400 font-medium">Ôn thi hiệu quả - Đạt điểm cao</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          <span className="gradient-text">Ôn Thi Lớp 12</span>
          <br />
          <span className="text-white">Dễ Dàng & Hiệu Quả</span>
        </h1>

        <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          Nền tảng ôn tập trực tuyến với lý thuyết chi tiết, bài tập đa dạng
          và phản hồi tức thì. Giúp bạn tự tin chinh phục kỳ thi THPT Quốc gia.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a href="#subjects" className="btn-primary flex items-center gap-2 text-base">
            <GraduationCap className="w-5 h-5" />
            Bắt đầu ôn tập
          </a>
          <Link href="/admin" className="btn-secondary flex items-center gap-2 text-base">
            <Zap className="w-5 h-5" />
            Quản lý nội dung
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
        {[
          { icon: BookOpen, label: 'Môn học', value: '6+', desc: 'đa dạng' },
          { icon: FileText, label: 'Bài tập', value: '500+', desc: 'câu hỏi' },
          { icon: Users, label: 'Học sinh', value: '1000+', desc: 'tham gia' },
          { icon: Trophy, label: 'Tỷ lệ đậu', value: '95%', desc: 'thành công' },
        ].map((stat, idx) => (
          <div key={idx} className="glass-card p-5 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-3">
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-0.5">{stat.value}</div>
            <div className="text-white/40 text-xs sm:text-sm">{stat.label}</div>
          </div>
        ))}
      </section>

      <section id="subjects">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Các môn học</h2>
          <span className="tag tag-cyan">{subjects.length} môn</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card p-6">
                <div className="w-12 h-12 rounded-xl skeleton mb-4"></div>
                <div className="h-5 skeleton rounded mb-2 w-2/3"></div>
                <div className="h-4 skeleton rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(subject => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
