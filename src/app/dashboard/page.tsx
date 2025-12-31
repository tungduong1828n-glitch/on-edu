'use client';

import { useEffect, useState } from 'react';
import { Subject } from '@/lib/types';
import { SubjectCard } from '@/components/subject-card';
import { Atom, Landmark, BookOpen, Search, Sparkles, TrendingUp, Target, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function DashboardPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/subjects')
            .then(res => res.json())
            .then(data => {
                setSubjects(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredSubjects = subjects.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const naturalSciences = filteredSubjects.filter(s => ['math', 'physics', 'chemistry', 'biology'].includes(s.id));
    const socialSciences = filteredSubjects.filter(s => ['literature', 'history', 'english', 'geography'].includes(s.id));
    const otherSubjects = filteredSubjects.filter(s => !naturalSciences.includes(s) && !socialSciences.includes(s));

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Chao buoi sang' : currentHour < 18 ? 'Chao buoi chieu' : 'Chao buoi toi';

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 p-6 md:p-8 gpu-accelerate">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.15),transparent_50%)]" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
                            <Sparkles className="h-4 w-4" />
                            <span>{greeting}!</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white font-outfit">
                            Kho Hoc Lieu
                        </h1>
                        <p className="text-white/60 max-w-md">
                            Chon mon hoc de bat dau on luyen. Hay luyen tap moi ngay de dat ket qua tot nhat!
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            <Target className="h-4 w-4 text-cyan-400" />
                            <span className="text-sm text-white/80">{subjects.length} Mon hoc</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-white/80">On luyen</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tim kiem mon hoc..."
                        className="pl-9 bg-white/5 border-white/10 focus-visible:ring-cyan-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-12">
                    {naturalSciences.length > 0 && (
                        <div className="space-y-5 animate-in fade-in duration-300">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <Atom className="h-5 w-5 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold font-outfit text-foreground">Khoa hoc Tu nhien</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {naturalSciences.map((subject, idx) => (
                                    <div key={subject.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <SubjectCard subject={subject} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {socialSciences.length > 0 && (
                        <div className="space-y-5 animate-in fade-in duration-300" style={{ animationDelay: '100ms' }}>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                                    <Landmark className="h-5 w-5 text-pink-400" />
                                </div>
                                <h3 className="text-xl font-bold font-outfit text-foreground">Khoa hoc Xa hoi</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {socialSciences.map((subject, idx) => (
                                    <div key={subject.id} style={{ animationDelay: `${(idx + 4) * 50}ms` }} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <SubjectCard subject={subject} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {otherSubjects.length > 0 && (
                        <div className="space-y-5 animate-in fade-in duration-300" style={{ animationDelay: '200ms' }}>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                    <BookOpen className="h-5 w-5 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold font-outfit text-foreground">Mon hoc khac</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {otherSubjects.map((subject, idx) => (
                                    <div key={subject.id} style={{ animationDelay: `${(idx + 8) * 50}ms` }} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <SubjectCard subject={subject} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {filteredSubjects.length === 0 && (
                        <div className="text-center py-20 space-y-4">
                            <div className="h-16 w-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center">
                                <Search className="h-8 w-8 text-white/30" />
                            </div>
                            <p className="text-muted-foreground">Khong tim thay mon hoc nao phu hop.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
