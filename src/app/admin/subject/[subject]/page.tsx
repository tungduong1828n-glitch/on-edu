'use client';

import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Subject, Unit } from '@/lib/types';
import {
    ArrowLeft, Plus, ChevronRight,
    Save, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        color: '#06b6d4',
        gradient: 'from-cyan-500 to-teal-600',
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
        { value: 'from-cyan-500 to-teal-600', label: 'Xanh lơ (Cyan)' },
        { value: 'from-blue-500 to-indigo-600', label: 'Xanh dương (Blue)' },
        { value: 'from-emerald-500 to-green-600', label: 'Xanh lá (Emerald)' },
        { value: 'from-violet-500 to-purple-600', label: 'Tím (Violet)' },
        { value: 'from-amber-500 to-orange-600', label: 'Cam (Amber)' },
        { value: 'from-red-500 to-rose-600', label: 'Đỏ (Red)' },
        { value: 'from-pink-500 to-rose-600', label: 'Hồng (Pink)' },
    ];

    const iconOptions = [
        { value: 'book-open', label: 'Sách (Chung)' },
        { value: 'languages', label: 'Ngôn ngữ' },
        { value: 'calculator', label: 'Toán học' },
        { value: 'atom', label: 'Vật lý' },
        { value: 'flask-conical', label: 'Hóa học' },
        { value: 'landmark', label: 'Lịch sử' },
    ];

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
                <div className="h-64 w-full bg-muted animate-pulse rounded-lg" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link href="/admin">
                <Button variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại Admin
                </Button>
            </Link>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    {isNew ? 'Thêm môn học mới' : `Chỉnh sửa: ${subject.name}`}
                </h1>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Lưu thay đổi
                </Button>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Thông tin môn học</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="subject-id">ID (không dấu, không cách)</Label>
                            <Input
                                id="subject-id"
                                value={subject.id}
                                onChange={(e) => setSubject({ ...subject, id: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                                placeholder="vd: tieng-anh"
                                disabled={!isNew}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject-name">Tên môn học</Label>
                            <Input
                                id="subject-name"
                                value={subject.name}
                                onChange={(e) => setSubject({ ...subject, name: e.target.value })}
                                placeholder="VD: Tiếng Anh"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="subject-desc">Mô tả</Label>
                            <Textarea
                                id="subject-desc"
                                rows={3}
                                value={subject.description}
                                onChange={(e) => setSubject({ ...subject, description: e.target.value })}
                                placeholder="Mô tả ngắn về môn học"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject-icon">Biểu tượng</Label>
                            <select
                                id="subject-icon"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={subject.icon}
                                onChange={(e) => setSubject({ ...subject, icon: e.target.value })}
                            >
                                {iconOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject-color">Màu sắc (Gradient)</Label>
                            <select
                                id="subject-color"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={subject.gradient}
                                onChange={(e) => setSubject({ ...subject, gradient: e.target.value })}
                            >
                                {gradientOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject-order">Thứ tự hiển thị</Label>
                            <Input
                                id="subject-order"
                                type="number"
                                value={subject.order}
                                onChange={(e) => setSubject({ ...subject, order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {!isNew && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Danh sách bài học</CardTitle>
                        <Link href={`/admin/subject/${subjectId}/unit/new`}>
                            <Button size="sm" variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm bài
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {units.length > 0 ? (
                            <div className="space-y-2">
                                {units.map((unit, idx) => (
                                    <Link key={unit.id} href={`/admin/subject/${subjectId}/unit/${unit.id}`} className="block">
                                        <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors group border border-transparent hover:border-border">
                                            <div className="flex items-center gap-4">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                                    {idx + 1}
                                                </span>
                                                <div>
                                                    <p className="font-medium group-hover:text-primary transition-colors">{unit.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {unit.lessons?.length || 0} phần - {unit.lessons?.reduce((acc, l) => acc + (l.exercises?.length || 0), 0) || 0} bài tập
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground border-t border-dashed">
                                Chưa có bài học nào. Click "Thêm bài" để tạo bài học mới.
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
