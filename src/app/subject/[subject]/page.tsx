'use client';

import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { Subject, Unit } from '@/lib/types';
import {
    BookOpen, ArrowLeft, ArrowRight, Clock,
    FileText, BookOpenCheck, Calculator, Atom, FlaskConical, Landmark
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-24 rounded" />
                    <div className="flex gap-4">
                        <Skeleton className="w-16 h-16 rounded-2xl" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-8 w-1/3 rounded" />
                            <Skeleton className="h-4 w-1/2 rounded" />
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-24 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!subject) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy môn học</h1>
                <Link href="/">
                    <Button>Quay lại trang chủ</Button>
                </Link>
            </div>
        );
    }

    const IconComponent = iconMap[subject.icon] || BookOpen;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
            </Link>

            <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 rounded-3xl border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl -z-10 rounded-full" />

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center shadow-lg transform -rotate-3`}>
                        <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{subject.name}</h1>
                        <p className="text-muted-foreground max-w-xl">{subject.description}</p>

                        <div className="flex items-center justify-center sm:justify-start gap-6 pt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="w-4 h-4 text-primary" />
                                <span>{units.length} bài học</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>~{units.length * 30} phút</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold px-2">Danh sách bài học</h2>
                {units.map((unit, idx) => (
                    <Link key={unit.id} href={`/subject/${subjectId}/${unit.id}`}>
                        <Card className="group cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-5 flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
                                    <span className="text-lg font-bold text-white">{idx + 1}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                        {unit.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-1">{unit.description}</p>

                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground/80">
                                        <span className="bg-primary/10 px-2 py-0.5 rounded text-primary">
                                            {unit.lessons?.length || 0} phần
                                        </span>
                                        <span>{unit.lessons?.reduce((acc, l) => acc + (l.exercises?.length || 0), 0) || 0} bài tập</span>
                                    </div>
                                </div>

                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {units.length === 0 && (
                    <div className="py-16 text-center border-2 border-dashed rounded-3xl border-muted">
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Chưa có bài học</h3>
                        <p className="text-muted-foreground">Môn học này chưa có nội dung. Vui lòng quay lại sau.</p>
                    </div>
                )}
            </div>


        </div>
    );
}
