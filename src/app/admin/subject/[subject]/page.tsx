'use client';

import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Subject, Unit } from '@/lib/types';
import {
    ArrowLeft, Plus, Edit2, Trash2, ChevronRight,
    BookOpen, Save, Loader2
} from 'lucide-react';

interface Props {
    params: Promise<{ subject: string }>;
}

export default function AdminSubjectPage({ params }: Props) {
    const router = useRouter();
    const { subject: subjectId } = use(params);
    const isNew = subjectId === 'new';

    const [subject, setSubject] = useState<Subject>({
        id: '',
        name: '',
        description: '',
        icon: 'book-open',
        color: '#3B82F6',
        gradient: 'from-blue-500 to-indigo-600',
        order: 1,
        isActive: true,
    });
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew) {
            Promise.all([
                fetch(`/api/subjects/${subjectId}`).then(r => r.json()),
                fetch(`/api/units?subjectId=${subjectId}`).then(r => r.json())
            ]).then(([subjectData, unitsData]) => {
                setSubject(subjectData);
                setUnits(unitsData);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [subjectId, isNew]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = isNew ? '/api/subjects' : `/api/subjects/${subjectId}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subject),
            });

            if (res.ok) {
                router.push('/admin');
            }
        } catch (error) {
            console.error('Error saving subject:', error);
        }
        setSaving(false);
    };

    const gradientOptions = [
        { value: 'from-blue-500 to-indigo-600', label: 'Xanh duong' },
        { value: 'from-emerald-500 to-teal-600', label: 'Xanh la' },
        { value: 'from-violet-500 to-purple-600', label: 'Tim' },
        { value: 'from-amber-500 to-orange-600', label: 'Cam' },
        { value: 'from-red-500 to-rose-600', label: 'Do' },
        { value: 'from-pink-500 to-rose-600', label: 'Hong' },
    ];

    const iconOptions = [
        { value: 'book-open', label: 'Sach' },
        { value: 'calculator', label: 'May tinh' },
        { value: 'atom', label: 'Nguyen tu' },
        { value: 'flask-conical', label: 'Ong nghiem' },
        { value: 'languages', label: 'Ngon ngu' },
        { value: 'landmark', label: 'Di tich' },
    ];

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-white/10 rounded w-32"></div>
                    <div className="glass-card p-6 h-64"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link href="/admin" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lai Admin</span>
            </Link>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">
                    {isNew ? 'Them mon hoc moi' : `Chinh sua: ${subject.name}`}
                </h1>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Luu
                </button>
            </div>

            <div className="glass-card p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Thong tin mon hoc</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-white/60 mb-2">ID (khong dau, khong cach)</label>
                        <input
                            type="text"
                            className="input-field"
                            value={subject.id}
                            onChange={(e) => setSubject({ ...subject, id: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                            placeholder="vi-du: english, math"
                            disabled={!isNew}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/60 mb-2">Ten mon hoc</label>
                        <input
                            type="text"
                            className="input-field"
                            value={subject.name}
                            onChange={(e) => setSubject({ ...subject, name: e.target.value })}
                            placeholder="Vi du: Tieng Anh"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm text-white/60 mb-2">Mo ta</label>
                        <textarea
                            className="input-field resize-none"
                            rows={3}
                            value={subject.description}
                            onChange={(e) => setSubject({ ...subject, description: e.target.value })}
                            placeholder="Mo ta ngan ve mon hoc"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/60 mb-2">Icon</label>
                        <select
                            className="input-field"
                            value={subject.icon}
                            onChange={(e) => setSubject({ ...subject, icon: e.target.value })}
                        >
                            {iconOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-white/60 mb-2">Mau sac</label>
                        <select
                            className="input-field"
                            value={subject.gradient}
                            onChange={(e) => setSubject({ ...subject, gradient: e.target.value })}
                        >
                            {gradientOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-white/60 mb-2">Thu tu hien thi</label>
                        <input
                            type="number"
                            className="input-field"
                            value={subject.order}
                            onChange={(e) => setSubject({ ...subject, order: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>
            </div>

            {!isNew && (
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Danh sach bai hoc</h2>
                        <Link href={`/admin/subject/${subjectId}/unit/new`} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Them bai
                        </Link>
                    </div>

                    {units.length > 0 ? (
                        <div className="space-y-2">
                            {units.map((unit, idx) => (
                                <Link key={unit.id} href={`/admin/subject/${subjectId}/unit/${unit.id}`}>
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
                            Chua co bai hoc nao. Click "Them bai" de tao bai hoc moi.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
