'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Lock, Unlock, Clock, ArrowRight, Brain, Trophy } from 'lucide-react';
import { sampleEnglishUnits, defaultSubjects } from '@/lib/sampleData';
import { Unit } from '@/lib/types';

export default function ExamsPage() {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/exams')
            .then(res => res.json())
            .then(data => {
                setExams(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch exams", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-mesh font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <Badge variant="outline" className="mb-4 bg-white/5 text-cyan-400 border-cyan-500/30">
                            <Sparkles className="w-3 h-3 mr-2" />
                            Ngân hàng đề thi
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-2">
                            Thử Thách & Luyện Tập
                        </h1>
                        <p className="text-lg text-white/60 max-w-2xl">
                            Danh sách các đề thi thử và bài tập luyện tập được biên soạn kỹ lưỡng. Chọn chế độ phù hợp với mục tiêu của bạn.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Mock Locked Exam */}
                        <Card className="p-1 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm group relative overflow-hidden opacity-70">
                            <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center backdrop-blur-[2px]">
                                <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4">
                                    <Lock className="w-8 h-8 text-white/40" />
                                </div>
                                <span className="font-bold text-white/60">Đề thi chưa mở</span>
                            </div>
                            <div className="p-6 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant="secondary" className="bg-white/5 text-white/60">Official Exam</Badge>
                                    <span className="text-white/40 text-sm font-mono">CODE: T882</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 font-outfit">Đề thi khảo sát chất lượng Đợt 1</h3>
                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center gap-4 text-white/40 text-sm">
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 60 phút</span>
                                        <span className="flex items-center gap-1"><Brain className="w-4 h-4" /> 50 câu</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Available Exams */}
                        {exams.map((exam, idx) => (
                            <Card key={exam.id} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]">
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <div className="bg-cyan-500/10 p-2 rounded-full border border-cyan-500/20">
                                        <ArrowRight className="w-4 h-4 text-cyan-400 -rotate-45" />
                                    </div>
                                </div>

                                <div className="p-6 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/30">
                                            <Unlock className="w-3 h-3 mr-1" /> Mở tự do
                                        </Badge>
                                        <span className="text-white/40 text-xs font-mono px-2 py-1 rounded bg-white/5">CODE: {idx + 1}</span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2 font-outfit leading-tight group-hover:text-cyan-400 transition-colors">
                                        {exam.title}
                                    </h3>
                                    <p className="text-white/60 text-sm line-clamp-2 mb-6">
                                        {exam.description || 'Bài thi trắc nghiệm trực tuyến'}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-4 text-white/50 text-sm mb-6">
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {exam.duration} phút</span>
                                            <span className="flex items-center gap-1.5"><Brain className="w-4 h-4" /> {exam.questions?.length || exam.questionCount || 0} câu</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Link href={`/exam?examId=${exam.id}&mode=practice`} className="w-full">
                                                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 hover:text-cyan-400 hover:border-cyan-500/30">
                                                    Luyện tập
                                                </Button>
                                            </Link>
                                            <Link href={`/exam?examId=${exam.id}&mode=exam`} className="w-full">
                                                <Button className="w-full bg-white/10 hover:bg-cyan-500 hover:text-white text-white/90 border border-white/5 shadow-lg group-hover:bg-cyan-500 transition-all">
                                                    <Trophy className="w-4 h-4 mr-2" />
                                                    Thi thử
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
