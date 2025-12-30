'use client';

import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { Unit, Lesson, Exercise, Question } from '@/lib/types';
import {
    ArrowLeft, BookOpen, PenTool, CheckCircle,
    XCircle, ChevronDown, ChevronUp, RotateCcw,
    Lightbulb, Award, Check, AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface Props {
    params: Promise<{ subject: string; unit: string }>;
}

function TheorySection({ lesson }: { lesson: Lesson }) {
    const [expanded, setExpanded] = useState(true);

    return (
        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <div
                onClick={() => setExpanded(!expanded)}
                className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-sm">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-lg">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground">Lý thuyết</p>
                    </div>
                </div>
                {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </div>

            {expanded && (
                <CardContent className="px-5 pb-5 pt-0 space-y-6">
                    <div className="h-px bg-border/50 mb-4" />
                    {lesson.theory?.sections?.map(section => (
                        <div key={section.id} className="border-l-2 border-primary/30 pl-4">
                            <h4 className="font-semibold text-primary mb-2 text-lg">{section.title}</h4>
                            {section.content && (
                                <div className="text-foreground/90 mb-3 text-base leading-relaxed whitespace-pre-wrap">{section.content}</div>
                            )}
                            {section.items && section.items.length > 0 && (
                                <ul className="space-y-2">
                                    {section.items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-foreground/80 text-sm">
                                            <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                            <span className={cn(
                                                "flex-1",
                                                section.type === 'formula' && "font-mono bg-muted px-2 py-0.5 rounded text-primary"
                                            )}>
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                    {(!lesson.theory?.sections || lesson.theory.sections.length === 0) && (
                        <div className="text-muted-foreground text-sm italic">Không có nội dung lý thuyết.</div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}

function FillBlankExercise({ exercise, onComplete }: { exercise: Exercise; onComplete: (score: number, total: number) => void }) {
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<Record<string, boolean[]>>({});

    const handleInputChange = (qId: string, blankIdx: number, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [qId]: {
                ...(prev[qId] || []),
                [blankIdx]: value
            }
        }));
    };

    const handleSubmit = () => {
        const newResults: Record<string, boolean[]> = {};
        let correct = 0;
        let total = 0;

        exercise.questions.forEach(q => {
            const userAnswers = answers[q.id] || [];
            const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];
            const qResults: boolean[] = [];

            correctAnswers.forEach((ans, idx) => {
                const isCorrect = String(userAnswers[idx] || '').toLowerCase().trim() === String(ans).toLowerCase().trim();
                qResults.push(isCorrect);
                if (isCorrect) correct++;
                total++;
            });

            newResults[q.id] = qResults;
        });

        setResults(newResults);
        setSubmitted(true);
        onComplete(correct, total);
    };

    const handleReset = () => {
        setAnswers({});
        setResults({});
        setSubmitted(false);
    };

    const renderQuestionText = (q: Question) => {
        const parts = q.text.split(/______/);

        return (
            <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-base leading-loose">
                {parts.map((part, idx) => (
                    <span key={idx} className="inline-flex items-center">
                        <span>{part}</span>
                        {idx < parts.length - 1 && (
                            <input
                                type="text"
                                className={cn(
                                    "mx-1 text-center text-sm py-1 px-2 rounded-md border min-w-[80px] outline-none transition-all focus:ring-2 focus:ring-primary/50",
                                    submitted
                                        ? results[q.id]?.[idx]
                                            ? "bg-green-500/10 border-green-500 text-green-600 dark:text-green-400"
                                            : "bg-destructive/10 border-destructive text-destructive"
                                        : "bg-background border-input focus:border-primary"
                                )}
                                value={answers[q.id]?.[idx] || ''}
                                onChange={(e) => handleInputChange(q.id, idx, e.target.value)}
                                disabled={submitted}
                                placeholder="..."
                            />
                        )}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {exercise.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                            {idx + 1}
                        </span>
                        <div className="flex-1 space-y-3">
                            {renderQuestionText(q)}

                            {submitted && !results[q.id]?.every(r => r) && q.explanation && (
                                <div className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-sm">
                                    <div className="flex items-start gap-2">
                                        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="font-semibold text-destructive">Đáp án đúng: </span>
                                            <span className="font-mono text-foreground">{Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}</span>
                                            <div className="mt-1 text-muted-foreground">{q.explanation}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex gap-3 pt-4">
                {!submitted ? (
                    <Button onClick={handleSubmit}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Kiểm tra
                    </Button>
                ) : (
                    <Button onClick={handleReset} variant="secondary">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Làm lại
                    </Button>
                )}
            </div>
        </div>
    );
}

function MultipleChoiceExercise({ exercise, onComplete }: { exercise: Exercise; onComplete: (score: number, total: number) => void }) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        let correct = 0;
        exercise.questions.forEach(q => {
            if (answers[q.id] === q.answer) correct++;
        });
        setSubmitted(true);
        onComplete(correct, exercise.questions.length);
    };

    const handleReset = () => {
        setAnswers({});
        setSubmitted(false);
    };

    return (
        <div className="space-y-4">
            {exercise.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                            {idx + 1}
                        </span>
                        <div className="flex-1">
                            <p className="mb-4 text-base font-medium">{q.text}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {q.options?.map(opt => {
                                    const isSelected = answers[q.id] === opt;
                                    const isCorrect = opt === q.answer;

                                    let variant = "outline";
                                    let className = "justify-start text-left h-auto py-3 px-4 whitespace-normal";

                                    if (submitted) {
                                        if (isCorrect) {
                                            className += " bg-green-500/10 border-green-500 text-green-700 dark:text-green-400 font-medium";
                                        } else if (isSelected && !isCorrect) {
                                            className += " bg-red-500/10 border-red-500 text-red-700 dark:text-red-400";
                                        } else {
                                            className += " opacity-50";
                                        }
                                    } else if (isSelected) {
                                        className += " border-primary bg-primary/5 text-primary ring-1 ring-primary";
                                    }

                                    return (
                                        <Button
                                            key={opt}
                                            variant="outline"
                                            onClick={() => !submitted && setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                            className={className}
                                            disabled={submitted}
                                        >
                                            <div className="flex items-center gap-2 w-full">
                                                <div className={cn(
                                                    "w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0",
                                                    isSelected || (submitted && isCorrect) ? "border-current" : "border-muted-foreground"
                                                )}>
                                                    {(isSelected || (submitted && isCorrect)) && <div className="w-2 h-2 rounded-full bg-current" />}
                                                </div>
                                                <span>{opt}</span>
                                            </div>
                                        </Button>
                                    );
                                })}
                            </div>

                            {submitted && answers[q.id] !== q.answer && q.explanation && (
                                <div className="mt-4 p-3 rounded-lg bg-muted text-sm flex gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-semibold">Giải thích: </span>
                                        <span className="text-muted-foreground">{q.explanation}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex gap-3 pt-4">
                {!submitted ? (
                    <Button onClick={handleSubmit}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Kiểm tra
                    </Button>
                ) : (
                    <Button onClick={handleReset} variant="secondary">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Làm lại
                    </Button>
                )}
            </div>
        </div>
    );
}

// Reuse similar logic for Rewrite and Select but updated visuals
function RewriteExercise({ exercise, onComplete }: { exercise: Exercise; onComplete: (score: number, total: number) => void }) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<Record<string, boolean>>({});

    const handleSubmit = () => {
        const newResults: Record<string, boolean> = {};
        let correct = 0;
        exercise.questions.forEach(q => {
            const userAns = answers[q.id]?.toLowerCase().replace(/[.,!?]/g, '').trim() || '';
            const correctAns = String(q.answer).toLowerCase().replace(/[.,!?]/g, '').trim();
            const isCorrect = userAns === correctAns;
            newResults[q.id] = isCorrect;
            if (isCorrect) correct++;
        });
        setResults(newResults);
        setSubmitted(true);
        onComplete(correct, exercise.questions.length);
    };

    return (
        <div className="space-y-4">
            {exercise.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                            {idx + 1}
                        </span>
                        <div className="flex-1 space-y-3">
                            <p className="text-base">{q.text}</p>
                            <Textarea
                                placeholder="Viết lại câu..."
                                value={answers[q.id] || ''}
                                onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                disabled={submitted}
                                className={cn(
                                    submitted && (results[q.id]
                                        ? "border-green-500 focus:ring-green-500 bg-green-500/5"
                                        : "border-destructive focus:ring-destructive bg-destructive/5")
                                )}
                            />
                            {submitted && !results[q.id] && (
                                <div className="mt-2 text-sm p-3 rounded bg-muted/50">
                                    <div className="text-emerald-500 font-medium">Đáp án: {q.answer}</div>
                                    {q.explanation && <div className="text-muted-foreground mt-1">{q.explanation}</div>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            <div className="flex gap-3 pt-2">
                {!submitted ? (
                    <Button onClick={handleSubmit}><CheckCircle className="w-4 h-4 mr-2" /> Kiểm tra</Button>
                ) : (
                    <Button variant="secondary" onClick={() => { setAnswers({}); setSubmitted(false); }}><RotateCcw className="w-4 h-4 mr-2" /> Làm lại</Button>
                )}
            </div>
        </div>
    )
}

function ExerciseSection({ lesson }: { lesson: Lesson }) {
    const [expanded, setExpanded] = useState(true);
    const [scores, setScores] = useState<Record<string, { correct: number; total: number }>>({});

    const handleComplete = (exId: string, correct: number, total: number) => {
        setScores(prev => ({ ...prev, [exId]: { correct, total } }));
    };

    const totalScore = Object.values(scores).reduce((acc, s) => acc + s.correct, 0);
    const totalQuestions = Object.values(scores).reduce((acc, s) => acc + s.total, 0);

    return (
        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <div
                onClick={() => setExpanded(!expanded)}
                className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                        <PenTool className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-lg">Bài tập vận dụng</h3>
                        <p className="text-sm text-muted-foreground">{lesson.exercises?.length || 0} bài tập</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {totalQuestions > 0 && (
                        <div className="flex items-center gap-2 text-sm bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full font-medium">
                            <Award className="w-4 h-4" />
                            <span>{totalScore}/{totalQuestions}</span>
                        </div>
                    )}
                    {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </div>
            </div>

            {expanded && (
                <CardContent className="px-5 pb-5 pt-0 space-y-8">
                    <div className="h-px bg-border/50 mb-6" />
                    {lesson.exercises?.map((ex, idx) => (
                        <div key={ex.id} className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">BT {idx + 1}</span>
                                <h4 className="font-medium text-foreground">{ex.instruction}</h4>
                            </div>

                            {ex.type === 'fill-blank' && (
                                <FillBlankExercise exercise={ex} onComplete={(c, t) => handleComplete(ex.id, c, t)} />
                            )}
                            {ex.type === 'multiple-choice' && (
                                <MultipleChoiceExercise exercise={ex} onComplete={(c, t) => handleComplete(ex.id, c, t)} />
                            )}
                            {ex.type === 'rewrite' && (
                                <RewriteExercise exercise={ex} onComplete={(c, t) => handleComplete(ex.id, c, t)} />
                            )}
                        </div>
                    ))}
                    {(!lesson.exercises || lesson.exercises.length === 0) && (
                        <div className="text-muted-foreground text-sm italic">Chưa có bài tập nào.</div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}

export default function UnitPage({ params }: Props) {
    const { subject: subjectId, unit: unitId } = use(params);
    const [unit, setUnit] = useState<Unit | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(0);

    useEffect(() => {
        fetch(`/api/units/${unitId}?subjectId=${subjectId}`)
            .then(r => r.json())
            .then(data => {
                setUnit(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [subjectId, unitId]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-8 w-2/3 bg-muted animate-pulse rounded" />
                <div className="h-64 w-full bg-muted animate-pulse rounded-xl" />
            </div>
        );
    }

    if (!unit) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài học</h1>
                <Link href={`/subject/${subjectId}`}>
                    <Button>Quay lại</Button>
                </Link>
            </div>
        );
    }

    const currentLesson = unit.lessons?.[activeLesson];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            <Link
                href={`/subject/${subjectId}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại môn học</span>
            </Link>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {unit.lessons?.length || 0} phần học
                    </div>
                </div>
                <div className="flex justify-between items-start">
                    <h1 className="text-3xl font-bold tracking-tight">{unit.title}</h1>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">{unit.description}</p>
            </div>

            {unit.lessons && unit.lessons.length > 0 && (
                <div className="space-y-6">
                    <div className="flex gap-2 p-1 bg-muted/50 rounded-lg overflow-x-auto">
                        {unit.lessons.map((lesson, idx) => (
                            <button
                                key={lesson.id}
                                onClick={() => setActiveLesson(idx)}
                                className={cn(
                                    "px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all",
                                    activeLesson === idx
                                        ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                )}
                            >
                                {lesson.title}
                            </button>
                        ))}
                    </div>

                    {currentLesson && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <TheorySection lesson={currentLesson} />
                            {currentLesson.exercises && currentLesson.exercises.length > 0 && (
                                <ExerciseSection lesson={currentLesson} />
                            )}
                        </div>
                    )}
                </div>
            )}

            {(!unit.lessons || unit.lessons.length === 0) && (
                <div className="p-12 text-center border-2 border-dashed rounded-xl border-muted">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Bài học này chưa có nội dung chi tiết.</p>
                </div>
            )}
        </div>
    );
}
