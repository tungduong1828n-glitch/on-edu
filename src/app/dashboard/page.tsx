'use client';

import { useEffect, useState } from 'react';
import { Subject } from '@/lib/types';
import { SubjectCard } from '@/components/subject-card';
import { Atom, Landmark, BookOpen, Search } from 'lucide-react';
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

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 font-outfit">Kho Học Liệu</h1>
                    <p className="text-muted-foreground">Chọn môn học để bắt đầu ôn luyện</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm môn học..."
                        className="pl-9 bg-white/5 border-white/10 focus-visible:ring-cyan-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-16">
                    {/* Natural Sciences */}
                    {naturalSciences.length > 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <Atom className="h-5 w-5 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold font-outfit text-foreground">Khoa học Tự nhiên</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {naturalSciences.map(subject => (
                                    <SubjectCard key={subject.id} subject={subject} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Social Sciences */}
                    {socialSciences.length > 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                                    <Landmark className="h-5 w-5 text-pink-400" />
                                </div>
                                <h3 className="text-2xl font-bold font-outfit text-foreground">Khoa học Xã hội</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {socialSciences.map(subject => (
                                    <SubjectCard key={subject.id} subject={subject} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Others */}
                    {otherSubjects.length > 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                    <BookOpen className="h-5 w-5 text-purple-400" />
                                </div>
                                <h3 className="text-2xl font-bold font-outfit text-foreground">Môn học khác</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {otherSubjects.map(subject => (
                                    <SubjectCard key={subject.id} subject={subject} />
                                ))}
                            </div>
                        </div>
                    )}

                    {filteredSubjects.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">Không tìm thấy môn học nào phù hợp.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
