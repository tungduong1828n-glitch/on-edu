'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QuestionImporter } from '@/components/question-importer';
import {
    ArrowLeft, Save, Trash2, Plus, Copy, Eye, Clock, FileText,
    CheckCircle, Settings, GripVertical, Edit3, MoreHorizontal,
    Search, Filter, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { Exam } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';

export default function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<number | null>(null);

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
                alert('Luu thanh cong!');
                router.refresh();
            } else {
                alert('Loi khi luu de thi');
            }
        } catch (error) {
            console.error(error);
            alert('Co loi xay ra');
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

    const duplicateQuestion = (idx: number) => {
        if (!exam || !exam.questions) return;
        const question = exam.questions[idx];
        const newQuestion = {
            ...question,
            id: `q-${Date.now()}-copy`,
        };
        const newQuestions = [...exam.questions];
        newQuestions.splice(idx + 1, 0, newQuestion);
        setExam({ ...exam, questions: newQuestions });
    };

    const updateQuestion = (idx: number, field: string, value: any) => {
        if (!exam || !exam.questions) return;
        const newQuestions = [...exam.questions];
        newQuestions[idx] = { ...newQuestions[idx], [field]: value };
        setExam({ ...exam, questions: newQuestions });
    };

    const updateOption = (qIdx: number, optIdx: number, value: string) => {
        if (!exam || !exam.questions) return;
        const newQuestions = [...exam.questions];
        const newOptions = [...(newQuestions[qIdx].options || [])];
        newOptions[optIdx] = value;
        newQuestions[qIdx] = { ...newQuestions[qIdx], options: newOptions };
        setExam({ ...exam, questions: newQuestions });
    };

    const addOption = (qIdx: number) => {
        if (!exam || !exam.questions) return;
        const newQuestions = [...exam.questions];
        const currentOptions = newQuestions[qIdx].options || [];
        newQuestions[qIdx] = {
            ...newQuestions[qIdx],
            options: [...currentOptions, `Lua chon ${currentOptions.length + 1}`]
        };
        setExam({ ...exam, questions: newQuestions });
    };

    const removeOption = (qIdx: number, optIdx: number) => {
        if (!exam || !exam.questions) return;
        const newQuestions = [...exam.questions];
        const newOptions = [...(newQuestions[qIdx].options || [])];
        newOptions.splice(optIdx, 1);
        newQuestions[qIdx] = { ...newQuestions[qIdx], options: newOptions };
        setExam({ ...exam, questions: newQuestions });
    };

    const filteredQuestions = exam?.questions?.filter(q =>
        searchQuery === '' ||
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.answer as string)?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const getFilteredIndex = (question: any) => {
        return exam?.questions?.findIndex(q => q.id === question.id) ?? -1;
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Đang tải...</div>
        </div>
    );

    if (!exam) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <p className="text-lg font-medium">Không tìm thấy đề thi</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                    Quay lại
                </Button>
            </div>
        </div>
    );

    const questionCount = exam.questions?.length || 0;
    const answeredCount = exam.questions?.filter(q => q.answer).length || 0;
    const completionPercent = questionCount > 0 ? Math.round((answeredCount / questionCount) * 100) : 0;

    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-semibold">{exam.title}</h1>
                                <p className="text-sm text-muted-foreground">
                                    {questionCount} câu hỏi - {exam.duration} phút
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href={`/exam?examId=${exam.id}`} target="_blank">
                                <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" /> Xem thử
                                </Button>
                            </Link>
                            <Button onClick={handleUpdateExam} disabled={saving} size="sm">
                                {saving ? 'Đang lưu...' : <><Save className="w-4 h-4 mr-2" /> Lưu</>}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid gap-6 lg:grid-cols-4">
                    <div className="lg:col-span-1 space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Settings className="w-4 h-4" /> Thong tin chung
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm">Ten de thi</Label>
                                    <Input
                                        value={exam.title}
                                        onChange={(e) => setExam({ ...exam, title: e.target.value })}
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Thoi gian (phut)</Label>
                                    <Input
                                        type="number"
                                        value={exam.duration}
                                        onChange={(e) => setExam({ ...exam, duration: parseInt(e.target.value) || 0 })}
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Loai de thi</Label>
                                    <Input value={exam.type} disabled className="bg-muted h-9" />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm">Trang thai</Label>
                                        <div className="text-xs text-muted-foreground">
                                            {exam.isActive ? 'Dang mo' : 'Da khoa'}
                                        </div>
                                    </div>
                                    <Switch
                                        checked={!!exam.isActive}
                                        onCheckedChange={(checked) => setExam({ ...exam, isActive: checked })}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Thong ke
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Hoan thanh</span>
                                        <span className="font-medium">{completionPercent}%</span>
                                    </div>
                                    <Progress value={completionPercent} className="h-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 rounded-lg bg-muted/50">
                                        <div className="text-2xl font-bold">{questionCount}</div>
                                        <div className="text-xs text-muted-foreground">Cau hoi</div>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-muted/50">
                                        <div className="text-2xl font-bold">{exam.duration}</div>
                                        <div className="text-xs text-muted-foreground">Phut</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader className="border-b">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <CardTitle className="text-lg">Cau hoi</CardTitle>
                                        {selectedQuestions.size > 0 && (
                                            <Badge variant="secondary">
                                                {selectedQuestions.size} da chon
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <div className="relative flex-1 md:flex-none">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Tìm kiếm câu hỏi..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-8 w-full md:w-[200px] h-9"
                                            />
                                        </div>
                                        {selectedQuestions.size > 0 && (
                                            <Button variant="destructive" size="sm" onClick={deleteSelectedQuestions}>
                                                <Trash2 className="w-4 h-4 mr-1" /> Xoa
                                            </Button>
                                        )}
                                        <QuestionImporter onImport={handleImportQuestions} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-primary text-primary focus:ring-primary accent-primary cursor-pointer"
                                        checked={exam.questions && exam.questions.length > 0 && selectedQuestions.size === exam.questions.length}
                                        onChange={toggleSelectAllQuestions}
                                        id="select-all-q"
                                    />
                                    <label htmlFor="select-all-q" className="text-sm font-medium cursor-pointer select-none">
                                        Chon tat ca ({questionCount})
                                    </label>
                                </div>

                                <div className="divide-y max-h-[600px] overflow-y-auto">
                                    {filteredQuestions.map((q, displayIdx) => {
                                        const idx = getFilteredIndex(q);
                                        const isExpanded = expandedQuestion === idx;
                                        const isEditing = editingQuestion === idx;

                                        return (
                                            <div
                                                key={q.id || idx}
                                                className={cn(
                                                    "p-4 transition-colors",
                                                    selectedQuestions.has(idx) && "bg-primary/5",
                                                    isExpanded && "bg-muted/30"
                                                )}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="pt-0.5">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-cyan-600 cursor-pointer"
                                                            checked={selectedQuestions.has(idx)}
                                                            onChange={() => toggleSelectQuestion(idx)}
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="outline" className="font-mono text-xs">
                                                                {idx + 1}
                                                            </Badge>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {q.type || 'multiple-choice'}
                                                            </Badge>
                                                        </div>

                                                        {isEditing ? (
                                                            <div className="space-y-3">
                                                                <Input
                                                                    value={q.text}
                                                                    onChange={(e) => updateQuestion(idx, 'text', e.target.value)}
                                                                    placeholder="Nội dung câu hỏi..."
                                                                    className="text-sm"
                                                                />

                                                                <div className="space-y-2">
                                                                    <Label className="text-xs text-muted-foreground">Cac lua chon:</Label>
                                                                    {q.options?.map((opt, optIdx) => (
                                                                        <div key={optIdx} className="flex items-center gap-2">
                                                                            <span className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-medium">
                                                                                {String.fromCharCode(65 + optIdx)}
                                                                            </span>
                                                                            <Input
                                                                                value={opt}
                                                                                onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                                                                                className="flex-1 h-8 text-sm"
                                                                            />
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8 text-destructive"
                                                                                onClick={() => removeOption(idx, optIdx)}
                                                                            >
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => addOption(idx)}
                                                                        className="w-full"
                                                                    >
                                                                        <Plus className="w-3 h-3 mr-1" /> Them lua chon
                                                                    </Button>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label className="text-xs text-muted-foreground">Dap an dung:</Label>
                                                                    <Input
                                                                        value={q.answer as string}
                                                                        onChange={(e) => updateQuestion(idx, 'answer', e.target.value)}
                                                                        placeholder="A, B, C, hoac D"
                                                                        className="h-8 text-sm"
                                                                    />
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label className="text-xs text-muted-foreground">Giai thich:</Label>
                                                                    <Input
                                                                        value={q.explanation || ''}
                                                                        onChange={(e) => updateQuestion(idx, 'explanation', e.target.value)}
                                                                        placeholder="Giai thich dap an (tuy chon)"
                                                                        className="h-8 text-sm"
                                                                    />
                                                                </div>

                                                                <div className="flex justify-end">
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => setEditingQuestion(null)}
                                                                    >
                                                                        <CheckCircle className="w-3 h-3 mr-1" /> Xong
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <p
                                                                    className="text-sm mb-2 cursor-pointer hover:text-primary transition-colors"
                                                                    onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                                                                >
                                                                    {q.text}
                                                                </p>

                                                                {isExpanded && q.options && (
                                                                    <div className="mt-3 space-y-1.5 pl-4 border-l-2 border-muted">
                                                                        {q.options.map((opt, optIdx) => (
                                                                            <div
                                                                                key={optIdx}
                                                                                className={cn(
                                                                                    "flex items-center gap-2 text-sm py-1 px-2 rounded",
                                                                                    String.fromCharCode(65 + optIdx) === q.answer && "bg-green-500/10 text-green-600"
                                                                                )}
                                                                            >
                                                                                <span className="font-medium">{String.fromCharCode(65 + optIdx)}.</span>
                                                                                <span>{opt}</span>
                                                                                {String.fromCharCode(65 + optIdx) === q.answer && (
                                                                                    <CheckCircle className="w-3 h-3 ml-auto" />
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                <div className="flex items-center gap-3 mt-2">
                                                                    <span className="text-xs text-green-600 font-medium">
                                                                        Dap an: {q.answer as string}
                                                                    </span>
                                                                    {q.explanation && (
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {q.explanation}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => setEditingQuestion(isEditing ? null : idx)}
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => duplicateQuestion(idx)}
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive"
                                                            onClick={() => removeQuestion(idx)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {filteredQuestions.length === 0 && (
                                        <div className="text-center py-16">
                                            {searchQuery ? (
                                                <>
                                                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                                    <p className="text-muted-foreground">Không tìm thấy câu hỏi phù hợp</p>
                                                    <Button
                                                        variant="link"
                                                        onClick={() => setSearchQuery('')}
                                                        className="mt-2"
                                                    >
                                                        Xóa tìm kiếm
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                                    <p className="text-lg font-medium mb-1">Chưa có câu hỏi nào</p>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        Hãy thêm câu hỏi bằng cách import JSON hoặc tạo thủ công
                                                    </p>
                                                    <QuestionImporter onImport={handleImportQuestions} />
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
