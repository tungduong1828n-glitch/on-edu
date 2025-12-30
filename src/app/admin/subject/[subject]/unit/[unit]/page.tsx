'use client';

import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Unit, Lesson, Exercise, Question, TheorySection } from '@/lib/types';
import {
    ArrowLeft, Plus, Trash2, Save, Loader2,
    BookOpen, PenTool, ChevronDown, ChevronUp,
    GripVertical, Copy
} from 'lucide-react';

interface Props {
    params: Promise<{ subject: string; unit: string }>;
}

const exerciseTypes = [
    { value: 'fill-blank', label: 'Dien vao cho trong' },
    { value: 'multiple-choice', label: 'Trac nghiem' },
    { value: 'rewrite', label: 'Viet lai cau' },
    { value: 'select', label: 'Chon dung/sai' },
];

const theorySectionTypes = [
    { value: 'formula', label: 'Cong thuc' },
    { value: 'usage', label: 'Cach dung' },
    { value: 'note', label: 'Luu y' },
    { value: 'example', label: 'Vi du' },
    { value: 'text', label: 'Van ban' },
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
            title: 'Muc moi',
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
            instruction: 'Huong dan lam bai',
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
        <div className="glass-card overflow-hidden">
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-white/30" />
                    <div>
                        <input
                            type="text"
                            className="bg-transparent border-none text-lg font-semibold focus:outline-none focus:ring-0"
                            value={lesson.title}
                            onChange={(e) => onUpdate({ ...lesson, title: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Ten bai hoc"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </div>

            {isExpanded && (
                <div className="p-6 pt-2 space-y-6 border-t border-white/5">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-cyan-400" />
                                Ly thuyet
                            </h4>
                            <button onClick={addTheorySection} className="btn-ghost text-sm flex items-center gap-1">
                                <Plus className="w-4 h-4" />
                                Them muc
                            </button>
                        </div>

                        <div className="space-y-4">
                            {lesson.theory?.sections?.map((section, idx) => (
                                <div key={section.id} className="p-4 rounded-xl bg-white/5 space-y-3">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            className="input-field flex-1"
                                            value={section.title}
                                            onChange={(e) => updateTheorySection(idx, { ...section, title: e.target.value })}
                                            placeholder="Tieu de"
                                        />
                                        <select
                                            className="input-field w-40"
                                            value={section.type}
                                            onChange={(e) => updateTheorySection(idx, { ...section, type: e.target.value as TheorySection['type'] })}
                                        >
                                            {theorySectionTypes.map(t => (
                                                <option key={t.value} value={t.value}>{t.label}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => removeTheorySection(idx)}
                                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <textarea
                                        className="input-field resize-none"
                                        rows={2}
                                        value={section.content}
                                        onChange={(e) => updateTheorySection(idx, { ...section, content: e.target.value })}
                                        placeholder="Noi dung chinh"
                                    />

                                    <div>
                                        <label className="text-sm text-white/50 mb-1 block">Danh sach (moi dong 1 muc)</label>
                                        <textarea
                                            className="input-field resize-none font-mono text-sm"
                                            rows={3}
                                            value={section.items?.join('\n') || ''}
                                            onChange={(e) => updateTheorySection(idx, { ...section, items: e.target.value.split('\n').filter(Boolean) })}
                                            placeholder="- Muc 1&#10;- Muc 2&#10;- Muc 3"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium flex items-center gap-2">
                                <PenTool className="w-4 h-4 text-emerald-400" />
                                Bai tap
                            </h4>
                            <button onClick={addExercise} className="btn-ghost text-sm flex items-center gap-1">
                                <Plus className="w-4 h-4" />
                                Them bai tap
                            </button>
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
                        </div>
                    </div>
                </div>
            )}
        </div>
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

    return (
        <div className="p-4 rounded-xl bg-white/5 space-y-4">
            <div className="flex gap-3 items-start">
                <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                        <select
                            className="input-field w-48"
                            value={exercise.type}
                            onChange={(e) => onUpdate({ ...exercise, type: e.target.value as Exercise['type'] })}
                        >
                            {exerciseTypes.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            className="input-field flex-1"
                            value={exercise.instruction}
                            onChange={(e) => onUpdate({ ...exercise, instruction: e.target.value })}
                            placeholder="Huong dan lam bai"
                        />
                    </div>
                </div>
                <button onClick={onRemove} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-3">
                {exercise.questions?.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-lg bg-white/5 space-y-2">
                        <div className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-2">
                                {idx + 1}
                            </span>
                            <div className="flex-1 space-y-2">
                                <textarea
                                    className="input-field resize-none text-sm"
                                    rows={2}
                                    value={q.text}
                                    onChange={(e) => updateQuestion(idx, { ...q, text: e.target.value })}
                                    placeholder={exercise.type === 'fill-blank' ? 'Cau hoi (dung ______ cho cho trong)' : 'Cau hoi'}
                                />

                                {exercise.type === 'fill-blank' && (
                                    <input
                                        type="text"
                                        className="input-field text-sm"
                                        value={Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}
                                        onChange={(e) => updateQuestion(idx, { ...q, answer: e.target.value.split(',').map(s => s.trim()) })}
                                        placeholder="Dap an (cach nhau boi dau phay)"
                                    />
                                )}

                                {(exercise.type === 'multiple-choice' || exercise.type === 'select') && (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            className="input-field text-sm"
                                            value={q.options?.join(', ') || ''}
                                            onChange={(e) => updateQuestion(idx, { ...q, options: e.target.value.split(',').map(s => s.trim()) })}
                                            placeholder="Cac lua chon (cach nhau boi dau phay)"
                                        />
                                        <input
                                            type="text"
                                            className="input-field text-sm"
                                            value={String(q.answer)}
                                            onChange={(e) => updateQuestion(idx, { ...q, answer: e.target.value })}
                                            placeholder="Dap an dung"
                                        />
                                    </div>
                                )}

                                {exercise.type === 'rewrite' && (
                                    <input
                                        type="text"
                                        className="input-field text-sm"
                                        value={String(q.answer)}
                                        onChange={(e) => updateQuestion(idx, { ...q, answer: e.target.value })}
                                        placeholder="Cau tra loi dung"
                                    />
                                )}

                                <input
                                    type="text"
                                    className="input-field text-sm"
                                    value={q.explanation || ''}
                                    onChange={(e) => updateQuestion(idx, { ...q, explanation: e.target.value })}
                                    placeholder="Giai thich (khong bat buoc)"
                                />
                            </div>
                            <button onClick={() => removeQuestion(idx)} className="p-1.5 rounded hover:bg-red-500/20 text-red-400">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={addQuestion} className="btn-ghost text-sm w-full flex items-center justify-center gap-1 border border-dashed border-white/10 hover:border-cyan-500/30">
                <Plus className="w-4 h-4" />
                Them cau hoi
            </button>
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
            title: 'Bai hoc moi',
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
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="space-y-4">
                    <div className="h-8 skeleton rounded w-32"></div>
                    <div className="glass-card p-6 h-64"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <Link
                href={`/admin/subject/${subjectId}`}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lai</span>
            </Link>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">
                    {isNew ? 'Tao bai hoc moi' : 'Chinh sua bai hoc'}
                </h1>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Luu
                </button>
            </div>

            <div className="glass-card p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Thong tin chung</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-white/60 mb-2">ID (tu dong tao)</label>
                        <input
                            type="text"
                            className="input-field"
                            value={unit.id}
                            onChange={(e) => setUnit({ ...unit, id: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                            placeholder="unit-1"
                            disabled={!isNew}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/60 mb-2">Thu tu</label>
                        <input
                            type="number"
                            className="input-field"
                            value={unit.order}
                            onChange={(e) => setUnit({ ...unit, order: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm text-white/60 mb-2">Tieu de</label>
                        <input
                            type="text"
                            className="input-field"
                            value={unit.title}
                            onChange={(e) => setUnit({ ...unit, title: e.target.value })}
                            placeholder="VD: UNIT 1: LIFE STORIES"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm text-white/60 mb-2">Mo ta</label>
                        <input
                            type="text"
                            className="input-field"
                            value={unit.description}
                            onChange={(e) => setUnit({ ...unit, description: e.target.value })}
                            placeholder="Mo ta ngan ve noi dung bai hoc"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Noi dung bai hoc</h2>
                <button onClick={addLesson} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Them bai
                </button>
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
                    <div className="glass-card p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-white/30" />
                        </div>
                        <p className="text-white/50 mb-4">Chua co bai hoc nao</p>
                        <button onClick={addLesson} className="btn-primary text-sm py-2 px-4">
                            Tao bai hoc dau tien
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
