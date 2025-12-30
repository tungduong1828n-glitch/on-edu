'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionImporter } from '@/components/question-importer';
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';
import { Exam } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export default function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());

    const toggleSelectQuestion = (idx: number) => {
        const newSelected = new Set(selectedQuestions);
        if (newSelected.has(idx)) newSelected.delete(idx);
        else newSelected.add(idx);
        setSelectedQuestions(newSelected);
    };

    const toggleSelectAllQuestions = () => {
        if (!exam || !exam.questions) return;
        if (selectedQuestions.size === exam.questions.length) {
            setSelectedQuestions(new Set());
        } else {
            setSelectedQuestions(new Set(exam.questions.map((_, idx) => idx)));
        }
    };

    const deleteSelectedQuestions = () => {
        if (!exam || !exam.questions) return;
        if (!confirm(`Xóa ${selectedQuestions.size} câu hỏi đã chọn?`)) return;

        const newQuestions = exam.questions.filter((_, idx) => !selectedQuestions.has(idx));
        setExam({ ...exam, questions: newQuestions });
        setSelectedQuestions(new Set());
    };

    useEffect(() => {
        if (!id) return;
        fetch(`/api/exams/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setExam(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleImportQuestions = (importedQuestions: any[]) => {
        if (!exam) return;

        // Map imported questions to match schema if needed, or assume they are correct
        const newQuestions = importedQuestions.map((q, idx) => ({
            id: `q-${Date.now()}-${idx}`,
            text: q.text || 'Question text',
            answer: q.answer || '',
            options: q.options || [],
            type: q.type || 'multiple-choice',
            explanation: q.explanation || ''
        }));

        setExam({
            ...exam,
            questions: [...(exam.questions || []), ...newQuestions]
        });
    };

    const handleUpdateExam = async () => {
        if (!exam) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/exams/${exam.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(exam)
            });

            if (res.ok) {
                alert('Lưu thành công!');
                router.refresh(); // Refresh stored data
            } else {
                alert('Lỗi khi lưu đề thi');
            }
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const removeQuestion = (idx: number) => {
        if (!exam) return;
        const newQuestions = [...(exam.questions || [])];
        newQuestions.splice(idx, 1);
        setExam({ ...exam, questions: newQuestions });
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!exam) return <div className="p-8">Exam not found</div>;

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa Đề thi</h1>
                            <p className="text-muted-foreground">{exam.id}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.back()}>Hủy</Button>
                        <Button onClick={handleUpdateExam} disabled={saving}>
                            {saving ? 'Đang lưu...' : <><Save className="w-4 h-4 mr-2" /> Lưu thay đổi</>}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-1 h-fit">
                        <CardHeader>
                            <CardTitle>Thông tin chung</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Tên đề thi</Label>
                                <Input
                                    value={exam.title}
                                    onChange={(e) => setExam({ ...exam, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Thời gian (phút)</Label>
                                <Input
                                    type="number"
                                    value={exam.duration}
                                    onChange={(e) => setExam({ ...exam, duration: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Loại</Label>
                                <Input value={exam.type} disabled className="bg-muted" />
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <Label>Trạng thái</Label>
                                    <div className="text-[0.8rem] text-muted-foreground">
                                        {exam.isActive ? 'Đang mở (Public)' : 'Đã khóa (Private)'}
                                    </div>
                                </div>
                                <Switch
                                    checked={!!exam.isActive}
                                    onCheckedChange={(checked) => setExam({ ...exam, isActive: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                <CardTitle>Danh sách câu hỏi ({exam.questions?.length || 0})</CardTitle>
                                {selectedQuestions.size > 0 && (
                                    <Button variant="destructive" size="sm" onClick={deleteSelectedQuestions}>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Xóa ({selectedQuestions.size})
                                    </Button>
                                )}
                            </div>
                            <QuestionImporter onImport={handleImportQuestions} />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 px-1 mb-4 border-b pb-4">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-primary text-primary focus:ring-primary accent-primary cursor-pointer"
                                    checked={exam.questions && exam.questions.length > 0 && selectedQuestions.size === exam.questions.length}
                                    onChange={toggleSelectAllQuestions}
                                    id="select-all-q"
                                />
                                <label htmlFor="select-all-q" className="text-sm font-medium cursor-pointer select-none">
                                    Chọn tất cả
                                </label>
                            </div>

                            <div className="space-y-4">
                                {exam.questions?.map((q, idx) => (
                                    <div key={idx} className={`flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors group relative ${selectedQuestions.has(idx) ? 'bg-primary/5 border-primary' : 'bg-card'}`}>
                                        <div className="pt-1">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-cyan-600 cursor-pointer shadow-sm"
                                                checked={selectedQuestions.has(idx)}
                                                onChange={() => toggleSelectQuestion(idx)}
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">Q{idx + 1}</span>
                                                <span className="text-xs text-muted-foreground uppercase">{q.type || 'multiple-choice'}</span>
                                            </div>
                                            <p className="font-medium text-sm mb-2">{q.text}</p>
                                            <p className="text-sm text-green-600 dark:text-green-400">Đáp án: {q.answer as string}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeQuestion(idx)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}

                                {(!exam.questions || exam.questions.length === 0) && (
                                    <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                                        Chưa có câu hỏi nào. <br />
                                        Hãy nhấn <strong>Import JSON</strong> để thêm câu hỏi.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
