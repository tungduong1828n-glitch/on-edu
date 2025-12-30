'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Subject, Unit } from '@/lib/types';
import {
    BookOpen, Plus, Edit2, Trash2,
    LayoutDashboard, FileText, Settings,
    BookOpenCheck, Calculator, Atom, FlaskConical, Landmark,
    ChevronRight, Users, TrendingUp
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'book-open': BookOpen,
    'calculator': Calculator,
    'atom': Atom,
    'flask-conical': FlaskConical,
    'languages': BookOpenCheck,
    'landmark': Landmark,
};

export default function AdminDashboard() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [units, setUnits] = useState<Record<string, Unit[]>>({});
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('dashboard');

    useEffect(() => {
        fetch('/api/subjects')
            .then(r => r.json())
            .then(async (subjectsData) => {
                setSubjects(subjectsData);

                const unitsMap: Record<string, Unit[]> = {};
                for (const subject of subjectsData) {
                    const unitsData = await fetch(`/api/units?subjectId=${subject.id}`).then(r => r.json());
                    unitsMap[subject.id] = unitsData;
                }
                setUnits(unitsMap);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const totalUnits = Object.values(units).reduce((acc, u) => acc + u.length, 0);
    const totalExercises = Object.values(units).reduce((acc, subjectUnits) =>
        acc + subjectUnits.reduce((uAcc, u) =>
            uAcc + (u.lessons?.reduce((lAcc, l) => lAcc + (l.exercises?.length || 0), 0) || 0), 0
        ), 0
    );

    return (
        <div className="flex min-h-[calc(100vh-5rem)]">
            <aside className="w-64 glass-card rounded-none border-t-0 border-l-0 border-b-0 hidden lg:block">
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5" />
                        Admin Panel
                    </h2>

                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveSection('dashboard')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeSection === 'dashboard' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10'
                                }`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </button>

                        <button
                            onClick={() => setActiveSection('subjects')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeSection === 'subjects' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10'
                                }`}
                        >
                            <BookOpen className="w-5 h-5" />
                            Mon hoc
                        </button>

                        <button
                            onClick={() => setActiveSection('content')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeSection === 'content' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10'
                                }`}
                        >
                            <FileText className="w-5 h-5" />
                            Noi dung
                        </button>
                    </nav>
                </div>
            </aside>

            <main className="flex-1 p-6 lg:p-8">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="glass-card p-6 animate-pulse">
                                <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
                                <div className="h-8 bg-white/10 rounded w-1/3"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {activeSection === 'dashboard' && (
                            <div>
                                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div className="glass-card p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white/60 text-sm">Mon hoc</span>
                                            <BookOpen className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div className="text-3xl font-bold">{subjects.length}</div>
                                    </div>

                                    <div className="glass-card p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white/60 text-sm">Bai hoc</span>
                                            <FileText className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div className="text-3xl font-bold">{totalUnits}</div>
                                    </div>

                                    <div className="glass-card p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white/60 text-sm">Bai tap</span>
                                            <TrendingUp className="w-5 h-5 text-violet-400" />
                                        </div>
                                        <div className="text-3xl font-bold">{totalExercises}</div>
                                    </div>

                                    <div className="glass-card p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white/60 text-sm">Hoc sinh</span>
                                            <Users className="w-5 h-5 text-amber-400" />
                                        </div>
                                        <div className="text-3xl font-bold">0</div>
                                    </div>
                                </div>

                                <div className="glass-card p-6">
                                    <h2 className="text-lg font-semibold mb-4">Mon hoc gan day</h2>
                                    <div className="space-y-3">
                                        {subjects.slice(0, 5).map(subject => {
                                            const IconComponent = iconMap[subject.icon] || BookOpen;
                                            const subjectUnits = units[subject.id] || [];

                                            return (
                                                <Link key={subject.id} href={`/admin/subject/${subject.id}`}>
                                                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center`}>
                                                                <IconComponent className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium group-hover:text-blue-400 transition-colors">{subject.name}</div>
                                                                <div className="text-sm text-white/60">{subjectUnits.length} bai hoc</div>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'subjects' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h1 className="text-2xl font-bold">Quan ly mon hoc</h1>
                                    <Link href="/admin/subject/new" className="btn-primary flex items-center gap-2">
                                        <Plus className="w-5 h-5" />
                                        Them mon hoc
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {subjects.map(subject => {
                                        const IconComponent = iconMap[subject.icon] || BookOpen;
                                        const subjectUnits = units[subject.id] || [];

                                        return (
                                            <div key={subject.id} className="glass-card p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center`}>
                                                        <IconComponent className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link href={`/admin/subject/${subject.id}`} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                                            <Edit2 className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </div>

                                                <h3 className="font-semibold text-lg mb-1">{subject.name}</h3>
                                                <p className="text-sm text-white/60 mb-4">{subject.description}</p>

                                                <div className="flex items-center gap-4 text-sm text-white/40">
                                                    <span>{subjectUnits.length} bai hoc</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {activeSection === 'content' && (
                            <div>
                                <h1 className="text-2xl font-bold mb-6">Quan ly noi dung</h1>

                                <div className="space-y-6">
                                    {subjects.map(subject => {
                                        const IconComponent = iconMap[subject.icon] || BookOpen;
                                        const subjectUnits = units[subject.id] || [];

                                        return (
                                            <div key={subject.id} className="glass-card p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center`}>
                                                            <IconComponent className="w-5 h-5 text-white" />
                                                        </div>
                                                        <h3 className="font-semibold text-lg">{subject.name}</h3>
                                                    </div>
                                                    <Link href={`/admin/subject/${subject.id}/unit/new`} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                                                        <Plus className="w-4 h-4" />
                                                        Them bai
                                                    </Link>
                                                </div>

                                                {subjectUnits.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {subjectUnits.map((unit, idx) => (
                                                            <Link key={unit.id} href={`/admin/subject/${subject.id}/unit/${unit.id}`}>
                                                                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-medium">
                                                                            {idx + 1}
                                                                        </span>
                                                                        <div>
                                                                            <div className="font-medium group-hover:text-blue-400 transition-colors">{unit.title}</div>
                                                                            <div className="text-sm text-white/60">
                                                                                {unit.lessons?.length || 0} bai - {unit.lessons?.reduce((acc, l) => acc + (l.exercises?.length || 0), 0) || 0} bai tap
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 text-white/40">
                                                        Chua co bai hoc nao
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
