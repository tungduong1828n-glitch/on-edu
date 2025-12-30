'use client';

import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Unit, Lesson, Exercise, Question, TheorySection } from '@/lib/types';
import {
    ArrowLeft, Plus, Trash2, Save, Loader2,
    BookOpen, PenTool, ChevronDown, ChevronUp,
    GripVertical, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionImporter } from '@/components/question-importer';

interface Props {
    params: Promise<{ subject: string; unit: string }>;
}

const exerciseTypes = [
    { value: 'fill-blank', label: 'Điền vào chỗ trống' },
    { value: 'multiple-choice', label: 'Trắc nghiệm' },
    { value: 'rewrite', label: 'Viết lại câu' },
    { value: 'select', label: 'Chọn đúng/sai' },
];

const theorySectionTypes = [
    { value: 'formula', label: 'Công thức' },
    { value: 'usage', label: 'Cách dùng' },
    { value: 'note', label: 'Lưu ý' },
    { value: 'example', label: 'Ví dụ' },
    { value: 'text', label: 'Văn bản' },
];

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function LessonEditor({
    lesson,
    onUpdate,
    onRemove,
    isExpanded,
    onToggle
}: {
    lesson: Lesson;
    onUpdate: (lesson: Lesson) => void;
    onRemove: () => void;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    const addTheorySection = () => {
        const newSection: TheorySection = {
            id: generateId(),
            title: 'Mục mới',
            type: 'text',
            content: '',
            items: [],
        };
        onUpdate({
            ...lesson,
            theory: {
                ...lesson.theory,
                sections: [...(lesson.theory?.sections || []), newSection],
            },
        });
    };

    const updateTheorySection = (idx: number, section: TheorySection) => {
        const sections = [...(lesson.theory?.sections || [])];
        sections[idx] = section;
        onUpdate({ ...lesson, theory: { ...lesson.theory, sections } });
    };

    const removeTheorySection = (idx: number) => {
        const sections = lesson.theory?.sections?.filter((_, i) => i !== idx) || [];
        onUpdate({ ...lesson, theory: { ...lesson.theory, sections } });
    };

    const addExercise = () => {
        const newExercise: Exercise = {
            id: generateId(),
            type: 'fill-blank',
            instruction: 'Hướng dẫn làm bài',
            questions: [],
        };
        onUpdate({
            ...lesson,
            exercises: [...(lesson.exercises || []), newExercise],
        });
    };

    const updateExercise = (idx: number, exercise: Exercise) => {
        const exercises = [...(lesson.exercises || [])];
        exercises[idx] = exercise;
        onUpdate({ ...lesson, exercises });
    };

    const removeExercise = (idx: number) => {
        const exercises = lesson.exercises?.filter((_, i) => i !== idx) || [];
        onUpdate({ ...lesson, exercises });
    };

    return (
        <Card className="overflow-hidden">
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                        <Input
                            className="bg-transparent border-transparent shadow-none hover:bg-background hover:border-input focus:bg-background focus:border-input text-lg font-semibold px-2 -ml-2 h-auto py-1"
                            value={lesson.title}
                            onChange={(e) => onUpdate({ ...lesson, title: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Tên bài học"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </div>
            </div>

            {isExpanded && (
                <div className="p-6 pt-0 space-y-8 border-t bg-muted/20">
                    {/* Theory Section */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold flex items-center gap-2 text-sm text-foreground">
                                <BookOpen className="w-4 h-4 text-primary" />
                                Lý thuyết
                            </h4>
                            <Button size="sm" variant="outline" onClick={addTheorySection}>
                                <Plus className="w-3 h-3 mr-1" />
                                Thêm mục
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {lesson.theory?.sections?.map((section, idx) => (
                                <div key={section.id} className="p-4 rounded-lg border bg-background space-y-3 relative group">
                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeTheorySection(idx)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-[1fr,200px] gap-3">
                                        <Input
                                            value={section.title}
                                            onChange={(e) => updateTheorySection(idx, { ...section, title: e.target.value })}
                                            placeholder="Tiêu đề mục"
                                        />
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={section.type}
                                            onChange={(e) => updateTheorySection(idx, { ...section, type: e.target.value as TheorySection['type'] })}
                                        >
                                            {theorySectionTypes.map(t => (
                                                <option key={t.value} value={t.value}>{t.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <Textarea
                                        rows={2}
                                        value={section.content}
                                        onChange={(e) => updateTheorySection(idx, { ...section, content: e.target.value })}
                                        placeholder="Nội dung chính"
                                    />

                                    <div>
                                        <Label className="text-xs text-muted-foreground mb-1 block">Danh sách (mỗi dòng 1 mục)</Label>
                                        <Textarea
                                            className="font-mono text-xs"
                                            rows={3}
                                            value={section.items?.join('\n') || ''}
                                            onChange={(e) => updateTheorySection(idx, { ...section, items: e.target.value.split('\n').filter(Boolean) })}
                                            placeholder="- Mục 1&#10;- Mục 2&#10;- Mục 3"
                                        />
                                    </div>
                                </div>
                            ))}
                            {(!lesson.theory?.sections || lesson.theory.sections.length === 0) && (
                                <div className="text-center py-4 text-xs text-muted-foreground border border-dashed rounded-lg">
                                    Chưa có nội dung lý thuyết
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Exercises Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold flex items-center gap-2 text-sm text-foreground">
                                <PenTool className="w-4 h-4 text-primary" />
                                Bài tập
                            </h4>
                            <Button size="sm" variant="outline" onClick={addExercise}>
                                <Plus className="w-3 h-3 mr-1" />
                                Thêm bài tập
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {lesson.exercises?.map((exercise, idx) => (
                                <ExerciseEditor
                                    key={exercise.id}
                                    exercise={exercise}
                                    onUpdate={(ex) => updateExercise(idx, ex)}
                                    onRemove={() => removeExercise(idx)}
                                />
                            ))}
                            {(!lesson.exercises || lesson.exercises.length === 0) && (
                                <div className="text-center py-4 text-xs text-muted-foreground border border-dashed rounded-lg">
                                    Chưa có bài tập nào
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}

function ExerciseEditor({
    exercise,
    onUpdate,
    onRemove,
}: {
    exercise: Exercise;
    onUpdate: (exercise: Exercise) => void;
    onRemove: () => void;
}) {
    const addQuestion = () => {
        const newQuestion: Question = {
            id: generateId(),
            text: '',
            blanks: [],
            options: exercise.type === 'multiple-choice' || exercise.type === 'select' ? ['', ''] : undefined,
            answer: exercise.type === 'fill-blank' ? [] : '',
            explanation: '',
        };
        onUpdate({
            ...exercise,
            questions: [...(exercise.questions || []), newQuestion],
        });
    };

    const updateQuestion = (idx: number, question: Question) => {
        const questions = [...(exercise.questions || [])];
        questions[idx] = question;
        onUpdate({ ...exercise, questions });
    };

    const removeQuestion = (idx: number) => {
        const questions = exercise.questions?.filter((_, i) => i !== idx) || [];
        onUpdate({ ...exercise, questions });
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exercise.questions, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `exercise-${exercise.id}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="p-4 rounded-lg border bg-background space-y-4">
            <div className="flex gap-4 items-start">
                <div className="flex-1 space-y-4">
                    <div className="flex gap-4">
                        <div className="w-48">
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={exercise.type}
                                onChange={(e) => onUpdate({ ...exercise, type: e.target.value as Exercise['type'] })}
                            >
                                {exerciseTypes.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <Input
                            value={exercise.instruction}
                            onChange={(e) => onUpdate({ ...exercise, instruction: e.target.value })}
                            placeholder="Hướng dẫn làm bài"
                        />
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onRemove} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-muted">
                {exercise.questions?.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-md bg-muted/30 space-y-3">
                        <div className="flex items-start gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary text-xs font-medium shrink-0 mt-1">
                                {idx + 1}
                            </span>
                            <div className="flex-1 space-y-3">
                                <Textarea
                                    rows={2}
                                    value={q.text}
                                    onChange={(e) => updateQuestion(idx, { ...q, text: e.target.value })}
                                    placeholder={exercise.type === 'fill-blank' ? 'Câu hỏi (dùng ______ cho chỗ trống)' : 'Câu hỏi'}
                                />

                                {exercise.type === 'fill-blank' && (
                                    <Input
                                        value={Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}
                                        onChange={(e) => updateQuestion(idx, { ...q, answer: e.target.value.split(',').map(s => s.trim()) })}
                                        placeholder="Đáp án (cách nhau bởi dấu phẩy)"
                                    />
                                )}

                                {(exercise.type === 'multiple-choice' || exercise.type === 'select') && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            value={q.options?.join(', ') || ''}
                                            onChange={(e) => updateQuestion(idx, { ...q, options: e.target.value.split(',').map(s => s.trim()) })}
                                            placeholder="Các lựa chọn (cách nhau bởi dấu phẩy)"
                                        />
                                        <Input
                                            value={String(q.answer)}
                                            onChange={(e) => updateQuestion(idx, { ...q, answer: e.target.value })}
                                            placeholder="Đáp án đúng"
                                        />
                                    </div>
                                )}

                                {exercise.type === 'rewrite' && (
                                    <Input
                                        value={String(q.answer)}
                                        onChange={(e) => updateQuestion(idx, { ...q, answer: e.target.value })}
                                        placeholder="Câu trả lời đúng"
                                    />
                                )}

                                <Input
                                    value={q.explanation || ''}
                                    onChange={(e) => updateQuestion(idx, { ...q, explanation: e.target.value })}
                                    placeholder="Giải thích (không bắt buộc)"
                                />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeQuestion(idx)} className="h-6 w-6 text-destructive">
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-dashed" onClick={addQuestion}>
                    <Plus className="w-3 h-3 mr-1" />
                    Thêm câu hỏi
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} title="Export JSON">
                    <Download className="w-3 h-3" />
                </Button>
                <QuestionImporter onImport={(data: any[]) => {
                    const newQuestions = data.map((item: any) => ({
                        id: generateId(),
                        text: item.text || '',
                        options: item.options,
                        answer: item.answer || '',
                        explanation: item.explanation || ''
                    }));
                    onUpdate({
                        ...exercise,
                        questions: [...(exercise.questions || []), ...newQuestions]
                    });
                }} />
            </div>
        </div>
    );
}

export default function AdminUnitPage({ params }: Props) {
    const router = useRouter();
    const { subject: subjectId, unit: unitId } = use(params);
    const isNew = unitId === 'new';

    const [unit, setUnit] = useState<Unit>({
        id: '',
        subjectId: subjectId,
        title: '',
        description: '',
        order: 1,
        lessons: [],
        isActive: true,
    });
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!isNew) {
            fetch(`/api/units/${unitId}?subjectId=${subjectId}`)
                .then(r => r.json())
                .then(data => {
                    setUnit(data);
                    if (data.lessons?.length > 0) {
                        setExpandedLessons(new Set([data.lessons[0].id]));
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [subjectId, unitId, isNew]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = isNew ? '/api/units' : `/api/units/${unitId}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(unit),
            });

            if (res.ok) {
                router.push(`/admin/subject/${subjectId}`);
            }
        } catch (error) {
            console.error('Error saving unit:', error);
        }
        setSaving(false);
    };

    const addLesson = () => {
        const newLesson: Lesson = {
            id: generateId(),
            title: 'Bài học mới',
            theory: { sections: [] },
            exercises: [],
        };
        setUnit({ ...unit, lessons: [...(unit.lessons || []), newLesson] });
        setExpandedLessons(new Set([...expandedLessons, newLesson.id]));
    };

    const updateLesson = (idx: number, lesson: Lesson) => {
        const lessons = [...(unit.lessons || [])];
        lessons[idx] = lesson;
        setUnit({ ...unit, lessons });
    };

    const removeLesson = (idx: number) => {
        const lessons = unit.lessons?.filter((_, i) => i !== idx) || [];
        setUnit({ ...unit, lessons });
    };

    const toggleLesson = (id: string) => {
        const newExpanded = new Set(expandedLessons);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedLessons(newExpanded);
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
                <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                <div className="h-96 w-full bg-muted animate-pulse rounded-lg" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-32">
            <Link href={`/admin/subject/${subjectId}`}>
                <Button variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>
            </Link>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isNew ? 'Tạo Bài học Mới' : 'Chỉnh sửa Bài học'}
                    </h1>
                    <p className="text-muted-foreground mt-1">Biên soạn nội dung lý thuyết và bài tập.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Lưu thay đổi
                </Button>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Thông tin chung</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>ID (tự động tạo)</Label>
                            <Input
                                value={unit.id}
                                onChange={(e) => setUnit({ ...unit, id: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                                placeholder="unit-1"
                                disabled={!isNew}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Thứ tự</Label>
                            <Input
                                type="number"
                                value={unit.order}
                                onChange={(e) => setUnit({ ...unit, order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label>Tiêu đề</Label>
                            <Input
                                value={unit.title}
                                onChange={(e) => setUnit({ ...unit, title: e.target.value })}
                                placeholder="VD: UNIT 1: LIFE STORIES"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label>Mô tả</Label>
                            <Input
                                value={unit.description}
                                onChange={(e) => setUnit({ ...unit, description: e.target.value })}
                                placeholder="Mô tả ngắn về nội dung bài học"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Nội dung chi tiết</h2>
                    <Button onClick={addLesson} variant="secondary">
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm phần học
                    </Button>
                </div>

                <div className="space-y-4">
                    {unit.lessons?.map((lesson, idx) => (
                        <LessonEditor
                            key={lesson.id}
                            lesson={lesson}
                            onUpdate={(l) => updateLesson(idx, l)}
                            onRemove={() => removeLesson(idx)}
                            isExpanded={expandedLessons.has(lesson.id)}
                            onToggle={() => toggleLesson(lesson.id)}
                        />
                    ))}

                    {(!unit.lessons || unit.lessons.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/10">
                            <BookOpen className="w-10 h-10 text-muted-foreground mb-4 opacity-20" />
                            <p className="text-muted-foreground text-sm mb-4">Chưa có phần học nào</p>
                            <Button onClick={addLesson} variant="outline">
                                Tạo phần học đầu tiên
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
