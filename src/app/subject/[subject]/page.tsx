'use client';

import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { Subject, Unit } from '@/lib/types';
import {
    BookOpen, ArrowLeft, ArrowRight, Clock,
    FileText, BookOpenCheck, Calculator, Atom, FlaskConical, Landmark
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'book-open': BookOpen,
    'calculator': Calculator,
    'atom': Atom,
    'flask-conical': FlaskConical,
    'languages': BookOpenCheck,
    'landmark': Landmark,
};

interface Props {
    params: Promise<{ subject: string }>;
}

export default function SubjectPage({ params }: Props) {
    const { subject: subjectId } = use(params);
    const [subject, setSubject] = useState<Subject | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`/api/subjects/${subjectId}`).then(r => r.json()),
            fetch(`/api/units?subjectId=${subjectId}`).then(r => r.json())
        ]).then(([subjectData, unitsData]) => {
            setSubject(subjectData);
            setUnits(unitsData);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [subjectId]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="space-y-4">
                    <div className="h-6 skeleton rounded w-24"></div>
                    <div className="h-10 skeleton rounded w-2/3"></div>
                    <div className="h-5 skeleton rounded w-1/2"></div>
                    <div className="space-y-3 mt-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card p-6 h-24"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!subject) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy môn học</h1>
                <Link href="/" className="btn-primary">Quay lại trang chủ</Link>
            </div>
        );
    }

    const IconComponent = iconMap[subject.icon] || BookOpen;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
            </Link>

            <div className="flex items-start gap-4 mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-2">{subject.name}</h1>
                    <p className="text-white/50">{subject.description}</p>
                </div>
            </div>

            <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-white/40 text-sm">
                    <FileText className="w-4 h-4" />
                    <span>{units.length} bài học</span>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>~{units.length * 30} phút</span>
                </div>
            </div>

            <div className="space-y-3">
                {units.map((unit, idx) => (
                    <Link key={unit.id} href={`/subject/${subjectId}/${unit.id}`}>
                        <div className="glass-card p-5 group cursor-pointer flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                                <span className="text-lg font-bold text-white">{idx + 1}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                                    {unit.title}
                                </h3>
                                <p className="text-white/40 text-sm line-clamp-1">{unit.description}</p>

                                <div className="flex items-center gap-4 mt-2 text-xs text-white/30">
                                    <span>{unit.lessons?.length || 0} phần</span>
                                    <span>{unit.lessons?.reduce((acc, l) => acc + (l.exercises?.length || 0), 0) || 0} bài tập</span>
                                </div>
                            </div>

                            <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                    </Link>
                ))}
            </div>

            {units.length === 0 && (
                <div className="glass-card p-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-white/20" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Chưa có bài học</h3>
                    <p className="text-white/40">Môn học này chưa có nội dung. Vui lòng quay lại sau.</p>
                </div>
            )}
        </div>
    );
}
